import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Inbox, RefreshCw, X } from 'lucide-react';

/* ---------- Cards ---------- */

export const ContentCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}>
    {children}
  </div>
);

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  loading?: boolean;
}> = ({ label, value, icon, sub, loading }) => (
  <ContentCard className="p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {loading ? (
          <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ) : (
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        )}
        {sub && !loading && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-800/30 dark:text-primary-400">
        {icon}
      </div>
    </div>
  </ContentCard>
);

/* ---------- Status badge (color + text, never color-only) ---------- */

const badgeStyles: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
};

export const StatusBadge: React.FC<{ label: string; tone?: keyof typeof badgeStyles }> = ({ label, tone = 'gray' }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[tone]}`}>
    {label}
  </span>
);

export function contactTone(status: string): keyof typeof badgeStyles {
  switch (status) {
    case 'new': return 'blue';
    case 'read': return 'yellow';
    case 'replied': return 'green';
    case 'archived': return 'gray';
    default: return 'gray';
  }
}

export function careerTone(status: string): keyof typeof badgeStyles {
  switch (status) {
    case 'pending': return 'yellow';
    case 'reviewed': return 'blue';
    case 'shortlisted': return 'green';
    case 'rejected': return 'red';
    default: return 'gray';
  }
}

/* ---------- Table shell (responsive scroll + skeleton) ---------- */

export const AdminTableShell: React.FC<{ children: React.ReactNode; fixed?: boolean }> = ({ children, fixed = false }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700 ${fixed ? 'table-fixed' : ''}`}>
      {children}
    </table>
  </div>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">
    <tr>{children}</tr>
  </thead>
);

export const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th scope="col" className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </th>
);

export const SkeletonRows: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r}>
        {Array.from({ length: cols }).map((_, c) => (
          <td key={c} className="px-4 py-4">
            <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

/* ---------- Page header ---------- */

export const PageHeader: React.FC<{
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

/* ---------- Buttons ---------- */

const btnBase = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 min-h-[40px]';

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...rest }) => (
  <button className={`${btnBase} bg-primary-600 text-white hover:bg-primary-700 ${className}`} {...rest} />
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...rest }) => (
  <button className={`${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 ${className}`} {...rest} />
);

export const DangerButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...rest }) => (
  <button className={`${btnBase} bg-red-600 text-white hover:bg-red-700 ${className}`} {...rest} />
);

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }> = ({ label, className = '', ...rest }) => (
  <button aria-label={label} title={label} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 ${className}`} {...rest} />
);

/* ---------- Form fields ---------- */

const fieldCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

export const AdminInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`${fieldCls} ${props.className || ''}`} />
);

export const AdminSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className={`${fieldCls} ${props.className || ''}`} />
);

export const AdminTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className={`${fieldCls} ${props.className || ''}`} />
);

export const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
  </label>
);

/* ---------- Feedback states ---------- */

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
    <RefreshCw className="h-5 w-5 animate-spin" />
    <span className="text-sm">{message}</span>
  </div>
);

export const EmptyState: React.FC<{ title: string; body: string; action?: React.ReactNode }> = ({ title, body, action }) => (
  <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
      <Inbox className="h-6 w-6" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{body}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState: React.FC<{ title: string; body: string; onRetry?: () => void }> = ({ title, body, onRetry }) => (
  <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-900/30">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{body}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 min-h-[40px]">
        <RefreshCw className="h-4 w-4" /> Try again
      </button>
    )}
  </div>
);

/* ---------- Confirm dialog (replaces window.confirm) ---------- */

export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ open, title, body, confirmLabel = 'Delete', busy, onCancel, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onCancel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onCancel} aria-label="Close dialog" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{body}</p>
          <p className="mt-1 text-sm font-medium text-red-600">This action cannot be undone.</p>
          <div className="mt-6 flex justify-end gap-2">
            <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
            <DangerButton onClick={onConfirm} disabled={busy}>{busy ? 'Deleting…' : confirmLabel}</DangerButton>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
