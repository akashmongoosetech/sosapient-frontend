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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Candidate details"
      onClick={handleClose}
    >
      <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ContentCard
          className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-2xl"
        >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Candidate Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enrollment ID: {c._id}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
            aria-label="Close candidate details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Personal Information */}
        <div className="p-6 space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Full Name</p>
              <p className="text-sm text-gray-900 dark:text-white">{nA(c.candidateName)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Email Address</p>
              <p className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                <Mail className="w-4 h-4 text-gray-500" />
                {nA(c.email)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Mobile Number</p>
              <p className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                <Phone className="w-4 h-4 text-gray-500" />
                {nA(c.mobile)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Qualification</p>
              <p className="text-sm text-gray-900 dark:text-white">{nA(c.qualification)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Organization</p>
              <p className="text-sm text-gray-900 dark:text-white">{nA(c.organization)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Message</p>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line">{nA(c.message)}</p>
            </div>
          </div>

          {/* Course & Enrollment Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Course &amp; Enrollment Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Course Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{training ? nA(training.title) : nA(c.courseTitleSnapshot)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Course ID</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{training ? nA(training._id) : nA(c.trainingId)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Course Slug</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{training ? nA(training.slug) : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Course Category</p>
              <p className="text-sm text-gray-900 dark:text-white">{training ? nA(training.category) : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Course Duration</p>
              <p className="text-sm text-gray-900 dark:text-white">{training ? nA(training.duration) : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Course Price</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {training && training.paymentType === 'Paid' ? `${training.currency === 'INR' ? '₹' : ''}${nA(training.amount)}` : 'Free'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Enrollment ID</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{c._id}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Enrollment Date</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {c.enrolledAt ? new Date(c.enrolledAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Enrollment Status</p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <StatusBadge label={c.enrollmentStatus.charAt(0).toUpperCase() + c.enrollmentStatus.slice(1)} tone={enrollmentTone(c.enrollmentStatus)} />
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Enrollment Type</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {c.paymentType === 'Paid' ? 'Paid Course' : 'Free Course'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Currency</p>
              <p className="text-sm text-gray-900 dark:text-white">{nA(c.currency)}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Payment Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Payment Status</p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <StatusBadge label={c.paymentStatus.charAt(0).toUpperCase() + c.paymentStatus.slice(1)} tone={paymentTone(c.paymentStatus)} />
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Payment Amount</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {c.paymentType === 'Paid' ? `${c.currency === 'INR' ? '₹' : ''}${nA(c.amount)}` : 'Free'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Currency</p>
              <p className="text-sm text-gray-900 dark:text-white">{nA(c.currency)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Transaction ID</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{nA(c.transactionId)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Razorpay Order ID</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{payment ? nA(payment.razorpayOrderId) : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Razorpay Payment ID</p>
              <p className="text-sm text-gray-900 dark:text-white truncate">{payment ? nA(payment.razorpayPaymentId) : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Signature Verified</p>
              <p className="flex items-center gap-2 text-sm">
                {payment ? (
                  <span className={`font-medium ${payment.razorpaySignatureVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {payment.razorpaySignatureVerified ? 'Yes' : 'No'}
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">N/A</span>
                )}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Payment Method</p>
              <p className="text-sm text-gray-900 dark:text-white capitalize">{payment ? nA(payment.paymentMethod) : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Payment Date</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {payment ? (payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'N/A') : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Failure Reason</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {payment && payment.failureReason ? nA(payment.failureReason) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Additional Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Registered At</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Last Updated</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Payment Timestamp</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {payment ? (payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A') : 'N/A'}
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <SecondaryButton onClick={handleClose} disabled={busy}>
              {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              Close
            </SecondaryButton>
          </div>
        </div>
      </ContentCard>
      </div>
    </div>
  );
}

export default CandidateDetailsModal;
