import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

const QUICK_ACTIONS = [
  'What services do you offer?',
  'AI & Automation',
  'Web Development',
  'View Case Studies',
  'Get a Quote',
  'Talk to Us'
];

const ChatInput: React.FC<ChatInputProps & { showQuickActions: boolean; onQuickAction: (text: string) => void }> = ({
  disabled,
  onSend,
  showQuickActions,
  onQuickAction
}) => {
  const [value, setValue] = useState('');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    setValue('');
    onSend(text);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {showQuickActions && (
        <div className="flex flex-wrap gap-1.5 px-3 pt-2.5" aria-label="Quick actions">
          {QUICK_ACTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={disabled}
              onClick={() => onQuickAction(q)}
              className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100 disabled:opacity-50 dark:border-primary-800 dark:bg-primary-800/30 dark:text-primary-300"
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex items-end gap-2 p-3">
        <label htmlFor="chatbot-input" className="sr-only">Type your message</label>
        <textarea
          id="chatbot-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          maxLength={2000}
          disabled={disabled}
          placeholder="Ask about services, work, pricing…"
          className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
