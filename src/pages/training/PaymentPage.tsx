import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Check
} from 'lucide-react';
import { Enrollment, Training } from '../../types/training';

const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

type PageStatus =
  | 'loading'
  | 'idle'
  | 'creating-order'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'verification-failed';

interface OrderInfo {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_CHECKOUT_URL}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout')));
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.head.appendChild(script);
  });
}

const PaymentPage: React.FC = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [training, setTraining] = useState<Training | null>(null);
  const [status, setStatus] = useState<PageStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const mounted = useRef(true);
  const checkoutInitiated = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Fetch the enrollment (token-gated). The API also returns the populated
  // training, so no second request is needed for the course details.
  const loadEnrollment = useCallback(async (): Promise<Enrollment | null> => {
    if (!enrollmentId) return null;
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/training/enrollment/${enrollmentId}${query}`
    );
    const data = await res.json();
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Enrollment not found');
    }
    if (!mounted.current) return null;
    const next = data.data as Enrollment;
    setEnrollment(next);
    if (next.training) setTraining(next.training);
    return next;
  }, [enrollmentId, token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus('loading');
        setError(null);
        const next = await loadEnrollment();
        if (cancelled || !next) return;

        if (next.paymentStatus === 'paid' && next.enrollmentStatus === 'confirmed') {
          setStatus('success');
        } else if (next.enrollmentStatus === 'cancelled') {
          setStatus('cancelled');
          setError('This enrollment was cancelled. Please enroll again.');
        } else if (next.paymentType === 'Free') {
          setStatus('success');
        } else {
          setStatus('idle');
        }

        if (next.paymentType === 'Paid' && next.paymentStatus !== 'paid') {
          try {
            await loadRazorpayScript();
            if (!cancelled) setRazorpayLoaded(true);
          } catch {
            if (!cancelled) {
              setError('Could not load the payment gateway. Check your connection and retry.');
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load enrollment details');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadEnrollment]);

  // While checkout is open (or a webhook may still be landing), poll the
  // enrollment so a payment confirmed server-side flips the page to success.
  useEffect(() => {
    if (status !== 'processing') return;
    let stopped = false;
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const next = await loadEnrollment();
        if (stopped) return;
        if (next && next.paymentStatus === 'paid') {
          setStatus('success');
          setError(null);
        }
      } catch {
        // keep polling; transient errors are expected
      }
      if (attempts >= 10) clearInterval(timer);
    }, 4000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [status, loadEnrollment]);

  // Allow retries once the checkout is no longer in flight.
  useEffect(() => {
    if (status !== 'processing' && status !== 'creating-order') {
      checkoutInitiated.current = false;
    }
  }, [status]);

  const startPayment = useCallback(async () => {
    if (!enrollment || !training) return;
    if (checkoutInitiated.current) return;
    checkoutInitiated.current = true;

    try {
      setError(null);
      setStatus('creating-order');

      let orderData = order;
      if (!orderData) {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/training/payment/create-order`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enrollmentId: enrollment._id, token })
          }
        );
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to create payment order');
        orderData = data.data as OrderInfo;
        setOrder(orderData);
      }

      await loadRazorpayScript();
      if (!mounted.current) return;
      setRazorpayLoaded(true);
      setStatus('processing');

      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) throw new Error('Payment gateway is unavailable');
      const rzp = new RazorpayCtor({
        key: orderData.keyId,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency,
        name: 'SoSapient',
        description: `Enrollment: ${training.title}`,
        image: 'https://sosapient.in/logo/Dlogo.png',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_BASE_URL}/api/training/payment/verify`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  enrollmentId: enrollment._id,
                  token
                })
              }
            );
            const verifyData = await verifyRes.json();
            if (!mounted.current) return;
            if (verifyData.success) {
              setStatus('success');
              setError(null);
              // Refresh to pick up the final status/transaction details.
              loadEnrollment().catch(() => undefined);
            } else {
              setStatus('verification-failed');
              setError(verifyData.message || 'Payment verification failed');
            }
          } catch {
            if (!mounted.current) return;
            setStatus('verification-failed');
            setError('Payment verification failed. Please contact support if money was debited.');
          }
        },
        prefill: {
          name: enrollment.candidateName,
          email: enrollment.email,
          contact: enrollment.mobile
        },
        theme: { color: '#7F5FA8' },
        modal: {
          escape: true,
          backdropclose: false,
          ondismiss: () => {
            if (!mounted.current) return;
            setStatus('cancelled');
            setError('Payment was cancelled. You can try again.');
            checkoutInitiated.current = false;
          }
        }
      });

      rzp.on('payment.failed', (response) => {
        if (!mounted.current) return;
        setStatus('failed');
        setError(response?.error?.description || 'Payment failed. Please try again.');
        checkoutInitiated.current = false;
      });

      rzp.open();
    } catch (err) {
      if (!mounted.current) return;
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Failed to open payment checkout');
      checkoutInitiated.current = false;
    }
  }, [enrollment, training, order, token, loadEnrollment]);

  if (error && !enrollment) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            This enrollment link is no longer valid
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {error || 'The enrollment could not be found or has already been completed.'}
          </p>
          <button
            onClick={() => navigate('/training')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Training
          </button>
        </div>
      </div>
    );
  }

  if (!enrollment || status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">Loading payment page...</p>
        </div>
      </div>
    );
  }

  const courseTitle = training?.title || enrollment.courseTitleSnapshot;
  const courseSlug = training?.slug;
  const amountLabel =
    enrollment.paymentType === 'Paid' ? `₹${Number(enrollment.amount).toLocaleString()}` : 'Free';
  const modeLabel: Record<string, string> = {
    Online: 'Online',
    Offline: 'Offline / In-person',
    Hybrid: 'Hybrid'
  };
  const isFailure = status === 'failed' || status === 'cancelled' || status === 'verification-failed';
  const bannerClass = status === 'success'
    ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
    : isFailure
      ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
      : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {enrollment.paymentType === 'Paid' ? 'Payment' : 'Enrollment'} - {courseTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {enrollment.paymentType === 'Paid'
                  ? 'Complete your enrollment payment securely'
                  : 'Your enrollment is confirmed'}
              </p>
            </div>
            {courseSlug && (
              <a
                href={`/training/${courseSlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Course
              </a>
            )}
          </div>

          {status !== 'idle' && (
            <div className={`mb-8 rounded-xl border p-4 text-center ${bannerClass}`}>
              {status === 'success' && (
                <>
                  <CheckCircle className="mx-auto h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                    Enrollment Confirmed
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your enrollment for {courseTitle} is confirmed.
                  </p>
                  {enrollment.transactionId && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Transaction ID: {enrollment.transactionId}
                    </p>
                  )}
                </>
              )}
              {(status === 'processing' || status === 'creating-order') && (
                <>
                  <div className="mx-auto h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                    Processing Payment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Please wait while we verify your payment...
                  </p>
                </>
              )}
              {isFailure && (
                <>
                  <AlertCircle className="mx-auto h-8 w-8 text-red-600 dark:text-red-400 mb-3" />
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                    {status === 'verification-failed' ? 'Verification Failed' : 'Payment Failed'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {error || 'Payment could not be completed'}
                  </p>
                  <button
                    onClick={startPayment}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <RefreshCw className="w-4 h-4" /> Retry Payment
                  </button>
                </>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment Summary</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Course: {courseTitle}</p>
              </div>
              <span className={`text-lg font-bold ${
                enrollment.paymentType === 'Paid'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {amountLabel}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Course</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{courseTitle}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Candidate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{enrollment.candidateName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{enrollment.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mobile</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{enrollment.mobile}</span>
              </div>
              {training && (
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mode</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {modeLabel[training.trainingMode] || training.trainingMode}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                  {enrollment.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                <span className={`text-sm font-medium ${
                  enrollment.paymentStatus === 'paid'
                    ? 'text-green-600 dark:text-green-400'
                    : enrollment.paymentStatus === 'failed'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {enrollment.paymentStatus.charAt(0).toUpperCase() + enrollment.paymentStatus.slice(1)}
                </span>
              </div>
            </div>

            {enrollment.paymentType === 'Paid' && enrollment.paymentStatus !== 'paid' && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                {!razorpayLoaded ? (
                  <div className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading payment gateway...</span>
                  </div>
                ) : (
                  <button
                    onClick={startPayment}
                    disabled={status === 'processing' || status === 'creating-order'}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'processing' || status === 'creating-order' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pay Now with Razorpay</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {enrollment.paymentStatus === 'paid' && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Payment already completed.
                  </span>
                </div>
              </div>
            )}

            {enrollment.paymentType === 'Free' && enrollment.paymentStatus !== 'paid' && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  This is a free course - no payment required.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PaymentPage;
