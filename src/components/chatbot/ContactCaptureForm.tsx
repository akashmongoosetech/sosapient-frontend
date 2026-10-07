import React, { useState } from 'react';
import { SERVICES } from '../../data/services';

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  website?: string;
}

interface ContactCaptureFormProps {
  initialService: string;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (payload: LeadPayload) => void;
  onCancel: () => void;
}

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.name), 'Other'];

const ContactCaptureForm: React.FC<ContactCaptureFormProps> = ({
  initialService,
  submitting,
  serverError,
  onSubmit,
  onCancel
}) => {
  const [form, setForm] = useState<LeadPayload>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService && SERVICE_OPTIONS.includes(initialService) ? initialService : '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof LeadPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2 || form.name.trim().length > 80) e.name = 'Please share your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please share a valid email.';
    if (!/^\+?[0-9\s-]{7,18}$/.test(form.phone.trim())) e.phone = 'Please share a valid phone number.';
    if (form.company && form.company.trim().length > 100) e.company = 'Company name is too long.';
    if (!form.message.trim() || form.message.length > 2000) e.message = 'Please describe your project briefly.';
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), company: form.company.trim(), message: form.message.trim() });
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

  return (
    <form onSubmit={submit} className="rounded-xl border border-primary-200 bg-primary-50/50 p-3 dark:border-primary-800 dark:bg-primary-800/20">
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Share your details and our team will reach out about your project. We&apos;ll use these details only to contact you about your inquiry.
      </p>
      <div className="mt-2 space-y-2">
        <div>
          <label className="mb-0.5 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="cb-name">Name *</label>
          <input id="cb-name" value={form.name} onChange={set('name')} autoComplete="name" className={inputCls} />
          {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="cb-email">Email *</label>
          <input id="cb-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" className={inputCls} />
          {errors.email && <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="cb-phone">Phone *</label>
          <input id="cb-phone" value={form.phone} onChange={set('phone')} autoComplete="tel" className={inputCls} />
          {errors.phone && <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="cb-company">Company (optional)</label>
          <input id="cb-company" value={form.company} onChange={set('company')} autoComplete="organization" className={inputCls} />
        </div>
        <div>
          <span className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Service you need</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Service">
            {SERVICE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((f) => ({ ...f, service: s })) }
                aria-pressed={form.service === s}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${form.service === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="cb-message">Project details *</label>
          <textarea id="cb-message" value={form.message} onChange={set('message')} rows={3} maxLength={2000} className={`${inputCls} resize-none`} />
          {errors.message && <p className="mt-0.5 text-xs text-red-600">{errors.message}</p>}
          {/* Honeypot: hidden from humans, traps bots */}
          <input type="text" value={(form as { website?: string }).website || ''} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        </div>
      </div>
      {serverError && <p role="alert" className="mt-2 text-xs text-red-600">{serverError}</p>}
      <div className="mt-2.5 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Submit details'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactCaptureForm;
