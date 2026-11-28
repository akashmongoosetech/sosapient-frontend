import { useCallback } from 'react';
import { X, Mail, Phone, Building2, BookOpen, Clock, CreditCard, RefreshCw } from 'lucide-react';
import { ContentCard, StatusBadge, SecondaryButton } from '../../components/admin/ui';
import { CandidateDetail } from '../../types/training';

const paymentTone = (s: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  switch (s) {
    case 'paid': return 'green';
    case 'pending': return 'yellow';
    case 'failed': return 'red';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};

const enrollmentTone = (s: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  switch (s) {
    case 'confirmed': return 'green';
    case 'pending': return 'yellow';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};

const nA = (value: unknown): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && value.trim() === '') return 'N/A';
  return String(value);
};

interface CandidateDetailsModalProps {
  open: boolean;
  candidate: CandidateDetail | null;
  onClose: () => void;
  busy?: boolean;
}

export function CandidateDetailsModal({ open, candidate, onClose, busy = false }: CandidateDetailsModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  const c = candidate;
  if (!c) return null;

  const training = c.training;
  const payment = c.payment;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 md:p-6 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Candidate details"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-4xl flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <ContentCard
          className="w-full flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-0!"
        >
          {/* Sticky Modal Header */}
          <div className="shrink-0 flex items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                  {nA(c.candidateName)}
                </h2>
                <StatusBadge
                  label={c.enrollmentStatus.charAt(0).toUpperCase() + c.enrollmentStatus.slice(1)}
                  tone={enrollmentTone(c.enrollmentStatus)}
                />
                <StatusBadge
                  label={`Payment: ${c.paymentStatus.charAt(0).toUpperCase() + c.paymentStatus.slice(1)}`}
                  tone={paymentTone(c.paymentStatus)}
                />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Candidate Details</span>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300 break-all">
                  ID: {c._id}
                </span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close candidate details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-8">
            {/* Personal Information */}
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                    {nA(c.candidateName)}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-900 dark:text-white break-all">
                    <Mail className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                    <span>{nA(c.email)}</span>
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Mobile Number
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Phone className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                    <span>{nA(c.mobile)}</span>
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Qualification
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white break-words">
                    {nA(c.qualification)}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl sm:col-span-2 lg:col-span-2">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Organization
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white break-words">
                    {nA(c.organization)}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl col-span-1 sm:col-span-2 lg:col-span-3">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Message
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line leading-relaxed">
                    {nA(c.message)}
                  </p>
                </div>
              </div>
            </section>

            {/* Course & Enrollment Information */}
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Course &amp; Enrollment Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl sm:col-span-2">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {training ? nA(training.title) : nA(c.courseTitleSnapshot)}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course Price
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {training && training.paymentType === 'Paid'
                      ? `${training.currency === 'INR' ? '₹' : ''}${nA(training.amount)}`
                      : 'Free'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course Category
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {training ? nA(training.category) : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course Duration
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {training ? nA(training.duration) : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course Slug
                  </p>
                  <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {training ? nA(training.slug) : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course ID
                  </p>
                  <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {training ? nA(training._id) : nA(c.trainingId)}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Enrollment ID
                  </p>
                  <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {c._id}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Enrollment Date
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {c.enrolledAt ? new Date(c.enrolledAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Enrollment Status
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <StatusBadge
                      label={c.enrollmentStatus.charAt(0).toUpperCase() + c.enrollmentStatus.slice(1)}
                      tone={enrollmentTone(c.enrollmentStatus)}
                    />
                  </div>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Enrollment Type
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {c.paymentType === 'Paid' ? 'Paid Course' : 'Free Course'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Currency
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">{nA(c.currency)}</p>
                </div>
              </div>
            </section>

            {/* Payment Information */}
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Payment Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Payment Status
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <StatusBadge
                      label={c.paymentStatus.charAt(0).toUpperCase() + c.paymentStatus.slice(1)}
                      tone={paymentTone(c.paymentStatus)}
                    />
                  </div>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Payment Amount
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {c.paymentType === 'Paid' ? `${c.currency === 'INR' ? '₹' : ''}${nA(c.amount)}` : 'Free'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Currency
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">{nA(c.currency)}</p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Transaction ID
                  </p>
                  <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {nA(c.transactionId)}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Razorpay Order ID
                  </p>
                  <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {payment ? nA(payment.razorpayOrderId) : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Razorpay Payment ID
                  </p>
                  <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {payment ? nA(payment.razorpayPaymentId) : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Signature Verified
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    {payment ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          payment.razorpaySignatureVerified
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        }`}
                      >
                        {payment.razorpaySignatureVerified ? 'Yes' : 'No'}
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Payment Method
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {payment ? nA(payment.paymentMethod) : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Payment Date
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {payment ? (payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'N/A') : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl sm:col-span-2 lg:col-span-3">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Failure Reason
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white break-words">
                    {payment && payment.failureReason ? nA(payment.failureReason) : 'N/A'}
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Additional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Registered At
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-800 p-3.5 sm:p-4 rounded-xl sm:col-span-2 lg:col-span-1">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Payment Timestamp
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {payment ? (payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A') : 'N/A'}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-900/95 flex items-center justify-end gap-3">
            <SecondaryButton
              onClick={handleClose}
              disabled={busy}
              className="w-full sm:w-auto justify-center"
            >
              {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              Close
            </SecondaryButton>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}

export default CandidateDetailsModal;