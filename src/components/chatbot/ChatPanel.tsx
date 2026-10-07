import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, Bot, RotateCcw, ExternalLink } from 'lucide-react';
import { getBaseUrl } from '../../utils/api';
import ChatInput from './ChatInput';
import ContactCaptureForm, { LeadPayload } from './ContactCaptureForm';

interface Source {
  title: string;
  url: string;
}

interface ChatMsg {
  id: number;
  isUser: boolean;
  text: string;
  sources?: Source[];
}

type CaptureState =
  | { mode: 'off' }
  | { mode: 'form'; service: string };

const WELCOME: ChatMsg = {
  id: 0,
  isUser: false,
  text: "Hi! I'm the SoSapient AI assistant. I can help you explore our web development, AI, automation, CRM, digital marketing and other services. What are you looking to build?"
};

function newId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function conversationId() {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    // fall through
  }
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const CONTACT_TRIGGERS = ['quote', 'contact', 'call me', 'hire', 'discuss', 'talk to', 'get in touch', 'reach out', 'pricing', 'price', 'cost', 'how much'];

const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const [pending, setPending] = useState(false);
  const [capture, setCapture] = useState<CaptureState>({ mode: 'off' });
  const [captureBusy, setCaptureBusy] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [captureDone, setCaptureDone] = useState(false);
  const [sessionId] = useState(conversationId);
  const [failed, setFailed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending, capture]);

  const pushAssistant = useCallback((text: string, sources?: Source[]) => {
    setMessages((prev) => [...prev, { id: newId(), isUser: false, text, sources }]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const clean = text.trim().slice(0, 2000);
    if (!clean || pending) return;
    setFailed(false);
    setMessages((prev) => [...prev, { id: newId(), isUser: true, text: clean }]);
    setPending(true);
    try {
      const history = [...messages.slice(-6).map((m) => ({ isUser: m.isUser, text: m.text })), { isUser: true, text: clean }].slice(-6);
      const res = await fetch(`${getBaseUrl()}/api/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: sessionId, message: clean, history })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.message) {
        throw new Error(data?.message || 'Request failed');
      }
      pushAssistant(data.message, Array.isArray(data.sources) ? data.sources : []);
      const lower = clean.toLowerCase();
      if (!captureDone && capture.mode === 'off' && CONTACT_TRIGGERS.some((t) => lower.includes(t))) {
        setCapture({ mode: 'form', service: '' });
      }
    } catch {
      setFailed(true);
      pushAssistant("I'm having trouble responding right now. Please try again or use our contact form.");
    } finally {
      setPending(false);
    }
  }, [pending, messages, pushAssistant, sessionId, captureDone, capture.mode]);

  const submitLead = useCallback(async (payload: LeadPayload) => {
    setCaptureBusy(true);
    setCaptureError(null);
    try {
      const res = await fetch(`${getBaseUrl()}/api/chatbot/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: sessionId, ...payload })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Submission failed');
      }
      setCaptureDone(true);
      setCapture({ mode: 'off' });
      try {
        const { trackFormSubmit } = await import('../../utils/analytics');
        trackFormSubmit('chatbot_lead');
      } catch {
        /* analytics optional */
      }
      pushAssistant(data.message || "Thanks! I've received your details. We'll be in touch soon.");
    } catch (err) {
      setCaptureError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setCaptureBusy(false);
    }
  }, [sessionId, pushAssistant]);

  const reset = useCallback(() => {
    setMessages([WELCOME]);
    setCapture({ mode: 'off' });
    setCaptureDone(false);
    setCaptureError(null);
    setFailed(false);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900" role="dialog" aria-label="SoSapient AI assistant chat">
      <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-3 text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-bold">SoSapient AI Assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-green-300" aria-hidden="true" />
            Online — answers from our website
          </p>
        </div>
        <button onClick={reset} aria-label="Start new conversation" className="rounded-lg p-1.5 hover:bg-white/20">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button onClick={onClose} aria-label="Close chat" className="rounded-lg p-1.5 hover:bg-white/20">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.isUser
                  ? 'rounded-br-md bg-primary-600 text-white'
                  : 'rounded-bl-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              {!m.isUser && m.sources && m.sources.length > 0 && (
                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Sources</p>
                  <ul className="mt-1 space-y-1">
                    {m.sources.map((s) => (
                      <li key={s.url}>
                        <Link
                          to={s.url}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                        >
                          {s.title} <ExternalLink className="h-3 w-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        {capture.mode === 'form' && !captureDone && (
          <ContactCaptureForm
            initialService=""
            submitting={captureBusy}
            serverError={captureError}
            onSubmit={submitLead}
            onCancel={() => setCapture({ mode: 'off' })}
          />
        )}
        {failed && !pending && (
          <button
            onClick={() => {
              const lastUser = [...messages].reverse().find((m) => m.isUser);
              if (lastUser) {
                setMessages((prev) => prev.slice(0, -1));
                setFailed(false);
                void sendMessage(lastUser.text);
              }
            }}
            className="text-xs font-medium text-primary-600 hover:underline"
          >
            Retry last message
          </button>
        )}
      </div>

      <ChatInput
        disabled={pending}
        onSend={sendMessage}
        showQuickActions={messages.length <= 1}
        onQuickAction={sendMessage}
      />
    </div>
  );
};

export default ChatPanel;
