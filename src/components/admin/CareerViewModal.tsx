import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  MapPin,
  Linkedin,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';
import { StatusBadge, SecondaryButton } from './ui';

export interface CareerApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  currentCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  currentAddress: string;
  city: string;
  state: string;
  country: string;
  linkedinUrl: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
  resume: {
    filename: string;
    contentType: string;
  };
}

export interface CareerViewModalProps {
  open: boolean;
  application: CareerApplication | null;
  onClose: () => void;
  handleDownload?: (id: string) => Promise<void>;
}

const careerTone = (s: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  switch (s) {
    case 'pending': return 'blue';
    case 'reviewed': return 'green';
    case 'shortlisted': return 'yellow';
    case 'rejected': return 'red';
    default: return 'gray';
  }
};

const nA = (value: unknown): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && value.trim() === '') return 'N/A';
  return String(value);
};

export function CareerViewModal({ open, application, onClose, handleDownload }: CareerViewModalProps) {
  if (!open) return null;
  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 md:p-6 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Application details"
      >
        {/* Sticky Modal Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                {nA(application.name)}
              </h3>
              <StatusBadge label={application.status} tone={careerTone(application.status)} />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Application details</span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300 break-all">
                ID: {application._id}
              </span>
              {application.createdAt && (
                <>
                  <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(application.createdAt).toLocaleString()}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close application details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6">
          {/* Applicant Profile */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <User className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Applicant Profile
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                  {nA(application.name)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white break-all">
                  <Mail className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(application.email)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Phone className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(application.phone)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  LinkedIn
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white break-all">
                  <Linkedin className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(application.linkedinUrl)}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Role & Experience */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Role &amp; Experience
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Position
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">
                  {nA(application.position)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Experience
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {nA(application.experience)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Current company
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white break-words">
                  <Building2 className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(application.currentCompany)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Expected salary
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <DollarSign className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(application.expectedSalary)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Notice period
                </p>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Clock className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{nA(application.noticePeriod)}</span>
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Status
                </p>
                <div>
                  <StatusBadge label={application.status} tone={careerTone(application.status)} />
                </div>
              </div>
            </div>
          </section>

          {/* Location Details */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Location
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl sm:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                  {nA(application.currentAddress)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  City
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {nA(application.city)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  State
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {nA(application.state)}
                </p>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {nA(application.country)}
                </p>
              </div>
            </div>
          </section>

          {/* Resume & Cover Letter */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Documents &amp; Cover Letter
              </h4>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
                    Resume
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {application.resume?.filename || 'Download resume'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload && handleDownload(application._id)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 px-3.5 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>{application.resume?.filename || 'Download resume'}</span>
                </button>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-4 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Cover letter
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-white">
                  {application.coverLetter || '—'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-900/95 flex items-center justify-end">
          <SecondaryButton onClick={onClose} className="w-full sm:w-auto justify-center">
            Close
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}