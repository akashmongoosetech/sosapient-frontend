import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close AI assistant chat' : 'Open AI assistant chat'}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-xl transition hover:shadow-2xl hover:brightness-110 sm:bottom-6 sm:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {open && (
        <div className="fixed inset-x-3 bottom-20 top-16 z-50 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[560px] sm:w-[380px] sm:max-h-[calc(100dvh-120px)]">
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
