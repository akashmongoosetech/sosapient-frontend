import React, { useState, useEffect, useRef } from 'react';
import { Bot, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

const AUTO_OPEN_KEY = 'ai_chatbot_auto_opened';
const AUTO_OPEN_DELAY_MS = 1500;

function readAutoOpened(): boolean {
  try {
    return localStorage.getItem(AUTO_OPEN_KEY) === 'true';
  } catch {
    return true; // storage unavailable: never auto-open
  }
}

function markAutoOpened(): void {
  try {
    localStorage.setItem(AUTO_OPEN_KEY, 'true');
  } catch {
    // private mode etc. — stay silent, just don't auto-open again this session
  }
}

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  // Auto-open exactly once per browser (first visit). The widget lives in
  // Layout so it never remounts on route changes — no route listener needed,
  // and closing never clears the flag.
  useEffect(() => {
    if (readAutoOpened()) return;
    timer.current = window.setTimeout(() => {
      setOpen(true);
      markAutoOpened();
    }, AUTO_OPEN_DELAY_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <div className="group fixed bottom-5 right-5 z-50 mb-[env(safe-area-inset-bottom)] sm:bottom-6 sm:right-6">
        <span
          role="tooltip"
          aria-hidden="true"
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 dark:bg-white dark:text-gray-900 sm:block"
        >
          AI Chatbot
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close AI Chatbot' : 'Open AI Chatbot'}
          aria-describedby="ai-chatbot-tooltip"
          className="chatbot-float inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-xl transition hover:scale-105 hover:shadow-2xl hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 motion-safe:animate-[chatbot-float_5s_ease-in-out_infinite]"
        >
          {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
        </button>
        <span id="ai-chatbot-tooltip" className="sr-only">AI Chatbot assistant</span>
      </div>
      {open && (
        <div className="fixed inset-x-3 bottom-24 top-16 z-50 max-h-[calc(100dvh-160px)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[560px] sm:w-[380px] sm:max-h-[calc(100dvh-120px)]">
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
