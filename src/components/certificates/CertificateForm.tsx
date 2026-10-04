import React, { useState, useMemo } from 'react';
import {
  ContentCard, PrimaryButton, SecondaryButton, AdminInput,
  FieldLabel
} from '../admin/ui';
import CertificateTemplate from './CertificateTemplate';
import { CERTIFICATE_CONFIG } from '../../config/certificate';
import { calcDuration, durationText, isValidMobile } from '../../utils/certificate';

export interface CertificateFormValues {
  firstName: string;
  lastName: string;
  college: string;
  email: string;
  mobileNumber: string;
  course: string;
  internshipTrainingCourse: string;
  startDate: string;
  endDate: string;
  hrHeadName: string;
  hrHeadDesignation: string;
  hrHeadSignature: string;
  managerName: string;
  managerDesignation: string;
  managerSignature: string;
}

export const toFormValues = (doc: {
  firstName: string; lastName: string; college: string; email: string;
  mobileNumber: string; course: string; internshipTrainingCourse: string;
  startDate: string; endDate: string;
  hrHeadName: string; hrHeadDesignation: string; hrHeadSignature: string;
  managerName: string; managerDesignation: string; managerSignature: string;
}): CertificateFormValues => {
  const base = emptyCertificateForm();
  return {
    ...base,
    firstName: doc.firstName || '',
    lastName: doc.lastName || '',
    college: doc.college || '',
    email: doc.email || '',
    mobileNumber: doc.mobileNumber || '',
    course: doc.course || '',
    internshipTrainingCourse: (doc as { internshipTrainingCourse?: string }).internshipTrainingCourse || '',
    startDate: doc.startDate ? new Date(doc.startDate).toISOString().slice(0, 10) : '',
    endDate: doc.endDate ? new Date(doc.endDate).toISOString().slice(0, 10) : '',
    hrHeadName: doc.hrHeadName || base.hrHeadName,
    hrHeadDesignation: doc.hrHeadDesignation || base.hrHeadDesignation,
    hrHeadSignature: doc.hrHeadSignature || '',
    managerName: doc.managerName || base.managerName,
    managerDesignation: doc.managerDesignation || base.managerDesignation,
    managerSignature: doc.managerSignature || ''
  };
};

export const emptyCertificateForm = (): CertificateFormValues => ({
  firstName: '',
  lastName: '',
  college: '',
  email: '',
  mobileNumber: '',
  course: '',
  internshipTrainingCourse: '',
  startDate: '',
  endDate: '',
  hrHeadName: CERTIFICATE_CONFIG.hrHeadName,
  hrHeadDesignation: CERTIFICATE_CONFIG.hrHeadDesignation,
  hrHeadSignature: CERTIFICATE_CONFIG.hrHeadSignature,
  managerName: CERTIFICATE_CONFIG.managerName,
  managerDesignation: CERTIFICATE_CONFIG.managerDesignation,
  managerSignature: CERTIFICATE_CONFIG.managerSignature
});

interface CertificateFormProps {
  initial: CertificateFormValues;
  submitting: boolean;
  submitLabel: string;
  serverError: string | null;
  previewIdLabel: string;
  onCancel: () => void;
  onSubmit: (values: CertificateFormValues) => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  initial, submitting, submitLabel, serverError, previewIdLabel, onCancel, onSubmit
}) => {
  const [v, setV] = useState<CertificateFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof CertificateFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((prev) => ({ ...prev, [key]: e.target.value }));

  const span = useMemo(() => {
    if (!v.startDate || !v.endDate) return { months: 0, days: 0 };
    return calcDuration(v.startDate, v.endDate);
  }, [v.startDate, v.endDate]);

  const datesInvalid = Boolean(v.startDate && v.endDate) && !(new Date(v.endDate) > new Date(v.startDate));

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!v.firstName.trim()) e.firstName = 'First name is required.';
    else if (v.firstName.trim().length > 100) e.firstName = 'First name must be at most 100 characters.';
    if (!v.lastName.trim()) e.lastName = 'Last name is required.';
    else if (v.lastName.trim().length > 100) e.lastName = 'Last name must be at most 100 characters.';
    if (v.college.trim() && v.college.trim().length > 200) e.college = 'College must be at most 200 characters.';
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
    if (v.mobileNumber.trim() && !isValidMobile(v.mobileNumber)) e.mobileNumber = 'Please enter a valid mobile number.';
    if (v.course.trim() && v.course.trim().length > 160) e.course = 'Course must be at most 160 characters.';
    if (!v.internshipTrainingCourse.trim()) e.internshipTrainingCourse = 'Internship Training Course is required.';
    else if (v.internshipTrainingCourse.trim().length > 160) e.internshipTrainingCourse = 'Internship Training Course must be at most 160 characters.';
    if (!v.startDate || !v.endDate) e.dates = 'Course duration is required.';
    else if (datesInvalid) e.dates = 'End date must be after the start date.';
    if (!v.hrHeadName.trim()) e.hrHeadName = 'HR head name is required.';
    if (!v.managerName.trim()) e.managerName = 'Manager name is required.';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit(v);
  };

  const MAX_SIGNATURE_BYTES = 200 * 1024;

  const handleSignatureFile = (key: 'hrHeadSignature' | 'managerSignature') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setErrors((prev) => ({ ...prev, [key]: 'Please choose a PNG or JPEG image.' }));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_SIGNATURE_BYTES) {
      setErrors((prev) => ({ ...prev, [key]: 'Signature image is too large (max 200KB). Please use a smaller file.' }));
      e.target.value = '';
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setV((prev) => ({ ...prev, [key]: dataUrl }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch {
      setErrors((prev) => ({ ...prev, [key]: 'Could not read the image file.' }));
    }
  };

  const errCls = 'mt-1 text-xs text-red-600';

  const sigField = (
    label: string,
    valueKey: 'hrHeadSignature' | 'managerSignature',
    nameKey: 'hrHeadName' | 'managerName',
    desigKey: 'hrHeadDesignation' | 'managerDesignation'
  ) => (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{label}</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Name</FieldLabel>
          <AdminInput value={v[nameKey]} onChange={set(nameKey)} />
        </div>
        <div>
          <FieldLabel>Designation</FieldLabel>
          <AdminInput value={v[desigKey]} onChange={set(desigKey)} />
        </div>
      </div>
      <div className="mt-3">
        <FieldLabel>Signature image (optional — elegant name fallback is used when empty)</FieldLabel>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleSignatureFile(valueKey)}
            aria-label={`${label} signature image`}
            className="text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          {v[valueKey] && (
            <button
              type="button"
              onClick={() => setV((prev) => ({ ...prev, [valueKey]: '' }))}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        {v[valueKey] ? (
          <img src={v[valueKey]} alt={`${label} signature preview`} className="mt-2 h-14 object-contain" />
        ) : (
          <p className="mt-2 font-script text-2xl text-gray-700 dark:text-gray-300" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {v[nameKey] || 'Signature preview'}
          </p>
        )}
        {errors[valueKey] && <p className={errCls}>{errors[valueKey]}</p>}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {serverError}
        </div>
      )}

      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Candidate information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>First name *</FieldLabel>
            <AdminInput value={v.firstName} maxLength={101} onChange={set('firstName')} placeholder="Akash" />
            {errors.firstName && <p className={errCls}>{errors.firstName}</p>}
          </div>
          <div>
            <FieldLabel>Last name *</FieldLabel>
            <AdminInput value={v.lastName} maxLength={101} onChange={set('lastName')} placeholder="Raikwar" />
            {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
          </div>
          <div>
            <FieldLabel>College</FieldLabel>
            <AdminInput value={v.college} maxLength={201} onChange={set('college')} placeholder="ABC College of Engineering" />
            {errors.college && <p className={errCls}>{errors.college}</p>}
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <AdminInput type="email" value={v.email} onChange={set('email')} placeholder="akash@example.com" autoComplete="email" />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>
          <div>
            <FieldLabel>Mobile</FieldLabel>
            <AdminInput value={v.mobileNumber} onChange={set('mobileNumber')} placeholder="9876543210" autoComplete="tel" />
            {errors.mobileNumber && <p className={errCls}>{errors.mobileNumber}</p>}
          </div>
          <div>
            <FieldLabel>Course</FieldLabel>
            <AdminInput value={v.course} maxLength={161} onChange={set('course')} placeholder="B.Tech Computer Science" />
            {errors.course && <p className={errCls}>{errors.course}</p>}
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Internship Training Course *</FieldLabel>
            <AdminInput value={v.internshipTrainingCourse} maxLength={161} onChange={set('internshipTrainingCourse')} placeholder="Full Stack Web Development" />
            {errors.internshipTrainingCourse && <p className={errCls}>{errors.internshipTrainingCourse}</p>}
          </div>
        </div>
      </ContentCard>

      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Course Duration *</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel>Start date *</FieldLabel>
            <AdminInput type="date" value={v.startDate} onChange={set('startDate')} />
          </div>
          <div>
            <FieldLabel>End date *</FieldLabel>
            <AdminInput type="date" value={v.endDate} onChange={set('endDate')} />
          </div>
          <div>
            <FieldLabel>Calculated Duration</FieldLabel>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" aria-live="polite">
              {v.startDate && v.endDate && !datesInvalid ? durationText(span.months, span.days) : '—'}
            </div>
          </div>
        </div>
        {errors.dates && <p className={errCls}>{errors.dates}</p>}
      </ContentCard>

      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Authorities</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sigField('HR Head', 'hrHeadSignature', 'hrHeadName', 'hrHeadDesignation')}
          {sigField('Manager', 'managerSignature', 'managerName', 'managerDesignation')}
        </div>
        {(errors.hrHeadName || errors.managerName) && (
          <p className={errCls}>{errors.hrHeadName || errors.managerName}</p>
        )}
      </ContentCard>

      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Live preview</h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Certificate ID <span className="font-mono font-semibold">{previewIdLabel}</span> · QR code is added after generation.
        </p>
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <CertificateTemplate
            data={{
              certificateId: previewIdLabel,
              firstName: v.firstName || 'First',
              lastName: v.lastName || 'Last',
              college: v.college,
              course: v.internshipTrainingCourse || 'Course',
              durationText: v.startDate && v.endDate && !datesInvalid ? durationText(span.months, span.days) : '—',
              startDate: v.startDate,
              endDate: v.endDate,
              hrHeadName: v.hrHeadName,
              hrHeadDesignation: v.hrHeadDesignation,
              hrHeadSignature: v.hrHeadSignature,
              managerName: v.managerName,
              managerDesignation: v.managerDesignation,
              managerSignature: v.managerSignature,
              verificationUrl: 'https://sosapient.in/preview/PREVIEW'
            }}
          />
        </div>
      </ContentCard>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <SecondaryButton type="button" onClick={onCancel}>Back</SecondaryButton>
        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default CertificateForm;
