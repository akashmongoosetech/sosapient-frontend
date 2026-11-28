import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TrainingFAQ as TrainingFAQType } from '../../types/training';

interface TrainingFAQProps {
  faqs: TrainingFAQType[];
}

export function TrainingFAQ({ faqs }: TrainingFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-expanded={isOpen}
                aria-controls={`training-faq-${index}`}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h4>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
