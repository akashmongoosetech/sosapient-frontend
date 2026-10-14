import React from 'react';
import { Link } from 'react-router-dom';

// Minimal markdown renderer for assistant messages (XSS-safe: React nodes only,
// no dangerouslySetInnerHTML, no raw HTML passthrough).
// Supports: **bold**, •/- bullets, 1. numbered lists, [label](/internal-path).
// External http(s) links render as plain text (never clickable from bot output).

const BOLD_RE = /\*\*([^*]+)\*\*/g;
const MD_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function isInternalUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // split() with 2 capture groups yields [text, label, url, text, ...]: stride 3.
  const linkParts = text.split(MD_LINK_RE);
  for (let i = 0; i < linkParts.length; i += 3) {
    const plain = linkParts[i] || '';
    const label = linkParts[i + 1];
    const url = linkParts[i + 2];
    nodes.push(...renderBold(plain, `${keyPrefix}-t${i}`));
    if (label !== undefined && url !== undefined) {
      if (isInternalUrl(url)) {
        nodes.push(
          <Link key={`${keyPrefix}-l${i}`} to={url} className="font-medium text-primary-600 underline dark:text-primary-400">
            {label}
          </Link>
        );
      } else {
        nodes.push(<span key={`${keyPrefix}-l${i}`}>{label}</span>);
      }
    }
  }
  return nodes;
}

function renderBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(BOLD_RE);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}-b${i}`}>{p}</strong> : <span key={`${keyPrefix}-s${i}`}>{p}</span>
  );
}

function isBullet(line: string): boolean {
  return /^\s*(•|[-*])\s+/.test(line);
}

function isNumbered(line: string): boolean {
  return /^\s*\d+[.)]\s+/.test(line);
}

function stripMarker(line: string): string {
  return line.replace(/^\s*(•|[-*]|\d+[.)])\s+/, '');
}

const ChatMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = String(text || '').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = (ordered: boolean) => {
    if (list.length === 0) return;
    const Tag = ordered ? 'ol' : 'ul';
    blocks.push(
      <Tag key={`list-${listKey++}`} className={ordered ? 'list-decimal pl-5' : 'list-disc pl-5'}>
        {list}
      </Tag>
    );
    list = [];
  };

  let inOrdered = false;
  lines.forEach((line, i) => {
    if (isBullet(line)) {
      if (inOrdered) {
        flushList(true);
        inOrdered = false;
      }
      list.push(<li key={i}>{renderInline(stripMarker(line), `li${i}`)}</li>);
    } else if (isNumbered(line)) {
      if (!inOrdered && list.length > 0) flushList(false);
      inOrdered = true;
      list.push(<li key={i}>{renderInline(stripMarker(line), `li${i}`)}</li>);
    } else {
      flushList(inOrdered);
      inOrdered = false;
      if (line.trim()) {
        blocks.push(
          <p key={`p${i}`} className={blocks.length > 0 ? 'mt-1.5' : undefined}>
            {renderInline(line, `p${i}`)}
          </p>
        );
      }
    }
  });
  flushList(inOrdered);

  return <div className="whitespace-pre-wrap">{blocks.length > 0 ? blocks : text}</div>;
};

export default ChatMessage;
