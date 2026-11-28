import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Building2, GraduationCap, Briefcase, MessageCircle, User } from 'lucide-react';
import { Training } from '../../types/training';

interface EnrollmentFormProps {
  training: Training;
  onEnroll: (data: {
    candidateName: string;
    email: string;
    mobile: string;
    qualification: string;
    organization: string;
    message: string;
  }) => Promise<void>;
  busy?: boolean;
}

export function EnrollmentForm({ training, onEnroll, busy = false }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    mobile: '',
    qualification: '',
    organization: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!formData.candidateName.trim()) e.candidateName = 'Full name is required';
    else if (formData.candidateName.length > 160) e.candidateName = 'Name must be at most 160 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Please enter a valid email';
    if (!formData.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(formData.mobile.trim())) e.mobile = 'Please enter a valid mobile number';
    if (formData.qualification.length > 200) e.qualification = 'Qualification must be at most 200 characters';
    if (formData.organization.length > 200) e.organization = 'Organization must be at most 200 characters';
    if (formData.message.length > 1000) e.message = 'Message must be at most 1000 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await onEnroll({
        candidateName: formData.candidateName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        qualification: formData.qualification.trim(),
        organization: formData.organization.trim(),
        message: formData.message.trim()
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err?.message || 'Enrollment failed. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const amountLabel = training.paymentType === 'Paid' ? `₹${training.amount.toLocaleString()}` : 'Free';

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Enroll in {training.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Complete the form below to secure your spot.{' '}
                {training.paymentType === 'Paid' ? `Course fee: ${amountLabel}` : 'This is a free course.'}
              </p>
            </div>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              training.paymentType === 'Paid'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            }`}>
              {training.paymentType === 'Paid' ? 'Paid Course' : 'Free Course'}
            </span>
          </div>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                status.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
              }`}
            >
              {status.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className={status.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {status.message}
              </span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.candidateName}
                    onChange={(e) => handleChange('candidateName', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.candidateName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.candidateName && <p className="mt-1 text-xs text-red-600">{errors.candidateName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="+91 99999 99999"
                    className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.mobile ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Company (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    placeholder="e.g. Infosys"
                    className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.organization ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.organization && <p className="mt-1 text-xs text-red-600">{errors.organization}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Name
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={training.title}
                    readOnly
                    className="w-full px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Message (Optional)
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Any questions or special requirements..."
                  className="w-full px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y"
                />
              </div>
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={busy || submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing enrollment...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>{training.paymentType === 'Paid' ? 'Proceed to Payment' : 'Enroll Now'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
