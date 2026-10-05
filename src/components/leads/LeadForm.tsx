import React, { useState } from 'react';
import { LEAD_STATUSES, type LeadStatus } from '../../types/lead';
import {
  ContentCard,
  PrimaryButton,
  SecondaryButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  FieldLabel,
} from '../admin/ui';

export interface LeadFormValues {
  title: string;
  categoryName: string;
  address: string;
  city: string;
  website: string;
  phone: string;
  phoneUnformatted: string;
  status: LeadStatus;
}

export function emptyLeadForm(): LeadFormValues {
  return {
    title: '',
    categoryName: '',
    address: '',
    city: '',
    website: '',
    phone: '',
    phoneUnformatted: '',
    status: 'New',
  };
}

interface LeadFormProps {
  initial: LeadFormValues;
  submitting: boolean;
  serverError: string | null;
  submitLabel: string;
  requireIdentity?: boolean;
  onCancel: () => void;
  onSubmit: (values: LeadFormValues) => void;
}

function isValidWebsite(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const LeadForm: React.FC<LeadFormProps> = ({
  initial,
  submitting,
  serverError,
  submitLabel,
  requireIdentity = true,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<LeadFormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});

  const set = (key: keyof LeadFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof LeadFormValues, string>> = {};
    if (form.title && form.title.trim().length > 200) next.title = 'Title must be at most 200 characters.';
    if (form.categoryName && form.categoryName.trim().length > 160) next.categoryName = 'Category must be at most 160 characters.';
    if (form.address && form.address.trim().length > 500) next.address = 'Address must be at most 500 characters.';
    if (form.city && form.city.trim().length > 100) next.city = 'City must be at most 100 characters.';
    if (!isValidWebsite(form.website)) next.website = 'Website must be a valid http(s) URL.';
    if (form.phone && form.phone.trim().length > 40) next.phone = 'Phone must be at most 40 characters.';
    if (form.phoneUnformatted && form.phoneUnformatted.trim().length > 40) {
      next.phoneUnformatted = 'Phone must be at most 40 characters.';
    }
    if (!LEAD_STATUSES.includes(form.status)) next.status = 'Select a valid status.';
    if (requireIdentity) {
      const hasIdentity =
        form.title.trim() !== '' || form.phone.trim() !== '' || form.phoneUnformatted.trim() !== '' || form.website.trim() !== '';
      if (!hasIdentity) {
        next.title = 'Provide at least a title, phone number or website.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      title: form.title.trim(),
      categoryName: form.categoryName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      website: form.website.trim(),
      phone: form.phone.trim(),
      phoneUnformatted: form.phoneUnformatted.trim(),
    });
  };

  const err = (key: keyof LeadFormValues) =>
    errors[key] ? <p className="mt-1 text-xs text-red-600">{errors[key]}</p> : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ContentCard>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>Business / Lead Title</FieldLabel>
            <AdminInput value={form.title} onChange={set('title')} placeholder="e.g. Visualeyes Hospital" maxLength={200} />
            {err('title')}
          </div>
          <div>
            <FieldLabel>Category</FieldLabel>
            <AdminInput value={form.categoryName} onChange={set('categoryName')} placeholder="e.g. Ophthalmology clinic" maxLength={160} />
            {err('categoryName')}
          </div>
          <div>
            <FieldLabel>City</FieldLabel>
            <AdminInput value={form.city} onChange={set('city')} placeholder="e.g. Ujjain" maxLength={100} />
            {err('city')}
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Address</FieldLabel>
            <AdminTextarea value={form.address} onChange={set('address')} placeholder="Full street address" rows={2} maxLength={500} />
            {err('address')}
          </div>
          <div>
            <FieldLabel>Website</FieldLabel>
            <AdminInput value={form.website} onChange={set('website')} placeholder="https://example.com" inputMode="url" maxLength={500} />
            {err('website')}
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <AdminSelect value={form.status} onChange={set('status')}>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </AdminSelect>
            {err('status')}
          </div>
          <div>
            <FieldLabel>Phone (display)</FieldLabel>
            <AdminInput value={form.phone} onChange={set('phone')} placeholder="+91 89820 66690" inputMode="tel" maxLength={40} />
            {err('phone')}
          </div>
          <div>
            <FieldLabel>Phone (unformatted)</FieldLabel>
            <AdminInput value={form.phoneUnformatted} onChange={set('phoneUnformatted')} placeholder="+918982066690" inputMode="tel" maxLength={40} />
            {err('phoneUnformatted')}
          </div>
        </div>

        {serverError && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            {serverError}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton type="button" onClick={onCancel}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : submitLabel}
          </PrimaryButton>
        </div>
      </ContentCard>
    </form>
  );
};

export default LeadForm;
