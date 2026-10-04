import { buildSlugPreview } from './blog';

// Mirrors backend utils/certificate.js: full months + leftover days, end strictly after start.
export function calcDuration(startIso: string, endIso: string): { months: number; days: number } {
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || !(e > s)) {
    return { months: 0, days: 0 };
  }
  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const anchor = new Date(s);
  anchor.setMonth(anchor.getMonth() + months);
  if (anchor > e) {
    months -= 1;
    anchor.setMonth(anchor.getMonth() - 1);
  }
  return { months, days: Math.round((e.getTime() - anchor.getTime()) / 86400000) };
}

export function calcDurationMonths(startIso: string, endIso: string): number {
  return calcDuration(startIso, endIso).months;
}

function unitText(value: number, singular: string, plural: string): string {
  return value === 1 ? `1 ${singular}` : `${value} ${plural}`;
}

export function durationText(months: number, days = 0): string {
  const parts: string[] = [];
  if (months > 0) parts.push(unitText(months, 'Month', 'Months'));
  if (days > 0) parts.push(unitText(days, 'Day', 'Days'));
  return parts.length > 0 ? parts.join(' ') : '—';
}

export function candidateSlug(firstName: string, lastName: string): string {
  return buildSlugPreview(`${firstName} ${lastName}`) || 'candidate';
}

// Display-only name normalization: "AKash RaIkwar" -> "Akash Raikwar".
// Handles hyphenated and apostrophe names: "anne-marie o'connor" -> "Anne-Marie O'Connor".
// Stored values are never modified — apply at render time only.
export function formatName(firstName: string, lastName: string): string {
  const titleWord = (word: string): string =>
    word
      .toLowerCase()
      .split(/(-|')/)
      .map((part) =>
        part === '-' || part === "'"
          ? part
          : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('');
  return `${titleWord(String(firstName || '').trim())} ${titleWord(String(lastName || '').trim())}`
    .trim()
    .replace(/\s+/g, ' ');
}

export function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isValidMobile(value: string): boolean {
  const v = String(value || '').trim().replace(/[\s-]/g, '');
  if (/^\+[1-9]\d{7,14}$/.test(v)) return true;
  if (/^[6-9]\d{9}$/.test(v)) return true;
  return false;
}
