import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { StatusBadge, SecondaryButton } from './ui';

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface ContactViewModalProps {
  open: boolean;
  submission: ContactSubmission | null;
  onClose: () => void;
  handleStatusUpdate?: (id: string, newStatus: ContactSubmission['status']) => Promise<void>;
}

export function ContactViewModal({ open, submission, onClose, handleStatusUpdate }: ContactViewModalProps) {
  if (!open) return null;
  if (!submission) return null;

  const contactTone = (s: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
    switch (s) {
      case 'new': return 'blue';
      case 'read': return 'green';
      case 'replied': return 'yellow';
      case 'archived': return 'red';
      default: return 'gray';
    }
  };

  const nA = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string' && value.trim() === '') return 'N/A';
    return String(value);
  };

  const handleStatusChange = async (newStatus: ContactSubmission['status']) => {
    if (handleStatusUpdate) {
      await handleStatusUpdate(submission._id, newStatus);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 md:p-6 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Contact details"
      >
        {/* Sticky Modal Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                {nA(submission.name)}
              </h3>
              <StatusBadge label={submission.status} tone={contactTone(submission.status)} />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Contact details</span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300 break-all">
                ID: {submission._id}
              </span>
              {submission.createdAt && (
                <>
                  <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(submission.createdAt).toLocaleString()}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close contact details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6">
          {/* Contact Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <User className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Contact Information
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                  {nA(submission.name)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white break-all">
                  <Mail className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(submission.email)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Phone className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(submission.phone)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Company
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white break-words">
                  <Building2 className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(submission.company)}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Inquiry & Project Details */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Inquiry Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl sm:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Subject
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">
                  {nA(submission.subject)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Budget
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <DollarSign className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(submission.budget)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Timeline
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Clock className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(submission.timeline)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Status
                </p>
                <div>
                  <StatusBadge label={submission.status} tone={contactTone(submission.status)} />
                </div>
              </div>
            </div>
          </section>

          {/* Message */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Message
              </h4>
            </div>

            <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-4 rounded-xl">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-white">
                {submission.message}
              </p>
            </div>
          </section>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-900/95 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <SecondaryButton onClick={onClose} className="w-full sm:w-auto justify-center">
            Close
          </SecondaryButton>

          {handleStatusUpdate && (
            <SecondaryButton
              onClick={() => handleStatusChange(submission.status)}
              className="w-full sm:w-auto justify-center bg-primary-700 text-white hover:bg-primary-900 border-primary-600"
            >
              Update status
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  );
}