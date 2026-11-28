import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Save, Trash2, Plus, Users, Award, FileText, BookOpen, HelpCircle } from 'lucide-react';
import { buildSlugPreview, isValidSlug } from '../../utils/blog';
import {
  ContentCard, PrimaryButton, SecondaryButton,
  AdminInput, AdminSelect, AdminTextarea, FieldLabel
} from '../../components/admin/ui';

const MODES: { value: 'Online' | 'Offline' | 'Hybrid'; label: string }[] = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline / In-person' },
  { value: 'Hybrid', label: 'Hybrid' }
];

const LEVELS: { value: 'Beginner' | 'Intermediate' | 'Advanced'; label: string }[] = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
];

const STATUSES: { value: 'draft' | 'published' | 'inactive'; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'inactive', label: 'Inactive' }
];

export interface TrainingCurriculumValue {
  title: string;
  description: string;
  hours: string;
}

export interface TrainingFaqValue {
  question: string;
  answer: string;
}

export interface TrainingFormValues {
  title: string;
  slug: string;
  slugCustomized: boolean;
  shortDescription: string;
  description: string;
  featuredImage: string;
  category: string;
  duration: string;
  trainingMode: 'Online' | 'Offline' | 'Hybrid';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  technologiesCsv: string;
  paymentType: 'Free' | 'Paid';
  amount: string;
  currency: string;
  startDate: string;
  endDate: string;
  curriculum: TrainingCurriculumValue[];
  faqs: TrainingFaqValue[];
  prerequisitesCsv: string;
  targetAudienceCsv: string;
  learningOutcomesCsv: string;
  status: 'draft' | 'published' | 'inactive';
  isFeatured: boolean;
  displayOrder: string;
  trainerName: string;
  trainerDesignation: string;
  trainerImage: string;
  trainerBio: string;
  certProvided: boolean;
  certName: string;
  certDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const emptyValues = (): TrainingFormValues => ({
  title: '',
  slug: '',
  slugCustomized: false,
  shortDescription: '',
  description: '',
  featuredImage: '',
  category: '',
  duration: '',
  trainingMode: 'Online',
  level: 'Beginner',
  technologiesCsv: '',
  paymentType: 'Free',
  amount: '0',
  currency: 'INR',
  startDate: '',
  endDate: '',
  curriculum: [],
  faqs: [],
  prerequisitesCsv: '',
  targetAudienceCsv: '',
  learningOutcomesCsv: '',
  status: 'draft',
  isFeatured: false,
  displayOrder: '0',
  trainerName: '',
  trainerDesignation: '',
  trainerImage: '',
  trainerBio: '',
  certProvided: false,
  certName: '',
  certDescription: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
});

interface TrainingFormProps {
  onSave: (values: TrainingFormValues) => Promise<void>;
  initialValues?: TrainingFormValues;
  busy?: boolean;
}

export function TrainingForm({ onSave, initialValues, busy = false }: TrainingFormProps) {
  const [values, setValues] = useState<TrainingFormValues>(emptyValues());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!values.title.trim()) e.title = 'Title is required';
    else if (values.title.length > 160) e.title = 'Title must be at most 160 characters';
    if (!values.shortDescription.trim()) e.shortDescription = 'Short description is required';
    else if (values.shortDescription.length > 500) e.shortDescription = 'Short description must be at most 500 characters';
    if (!values.description.trim()) e.description = 'Description is required';
    if (!values.category.trim()) e.category = 'Category is required';
    if (!values.duration.trim()) e.duration = 'Duration is required';
    if (values.featuredImage && !/^https?:\/\//i.test(values.featuredImage)) e.featuredImage = 'Featured image must be a valid URL';
    if (!values.technologiesCsv.trim()) e.technologiesCsv = 'At least one technology is required';
    if (values.paymentType === 'Paid') {
      if (!values.amount.trim()) e.amount = 'Amount is required for paid trainings';
      else if (isNaN(Number(values.amount)) || Number(values.amount) <= 0) e.amount = 'Amount must be greater than 0';
    }
    if (!values.currency.trim()) e.currency = 'Currency is required';
    if (values.startDate && values.endDate && new Date(values.endDate) < new Date(values.startDate)) {
      e.endDate = 'End date must be after the start date';
    }
    if (!values.displayOrder.trim()) e.displayOrder = 'Display order is required';
    else if (isNaN(Number(values.displayOrder))) e.displayOrder = 'Display order must be a number';
    if (values.slug && !isValidSlug(values.slug)) e.slug = 'Slug may contain lowercase letters, numbers and single hyphens only';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [values]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave(values);
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (k: keyof TrainingFormValues, v: any) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: '' }));
  };

  const slugPreview = values.title ? buildSlugPreview(values.title) : '';

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Training Details</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">All fields required unless noted</span>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Title *</FieldLabel>
          <AdminInput
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="e.g. MERN Stack Development"
            className={errors.title ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>
        <div>
          <FieldLabel>Slug *</FieldLabel>
          <div className="relative">
            <AdminInput
              value={values.slugCustomized && values.slug ? values.slug : slugPreview}
              onChange={(e) => {
                setField('slug', e.target.value);
                setField('slugCustomized', true);
              }}
              placeholder={slugPreview || 'mern-stack-development'}
              disabled={!values.slugCustomized}
              className={errors.slug ? 'border-red-500 dark:border-red-500' : ''}
            />
            {!values.slugCustomized && (
              <button
                type="button"
                onClick={() => setField('slugCustomized', true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-600 hover:underline"
              >
                Customize
              </button>
            )}
            {values.slugCustomized && (
              <button
                type="button"
                onClick={() => { setField('slug', ''); setField('slugCustomized', false); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Auto-generated from title. Lowercase, hyphens only, max 160 chars.
          </p>
        </div>
      </div>

      <div>
        <FieldLabel>Short Description *</FieldLabel>
        <AdminTextarea
          value={values.shortDescription}
          onChange={(e) => setField('shortDescription', e.target.value)}
          rows={3}
          placeholder="Brief summary shown on listing cards"
          className={errors.shortDescription ? 'border-red-500 dark:border-red-500' : ''}
        />
        {errors.shortDescription && <p className="mt-1 text-xs text-red-600">{errors.shortDescription}</p>}
      </div>

      <div>
        <FieldLabel>Full Description *</FieldLabel>
        <AdminTextarea
          value={values.description}
          onChange={(e) => setField('description', e.target.value)}
          rows={8}
          placeholder="Rich description of the training program"
          className={errors.description ? 'border-red-500 dark:border-red-500' : ''}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Featured Image URL</FieldLabel>
          <AdminInput
            value={values.featuredImage}
            onChange={(e) => setField('featuredImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={errors.featuredImage ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.featuredImage && <p className="mt-1 text-xs text-red-600">{errors.featuredImage}</p>}
        </div>
        <div>
          <FieldLabel>Category *</FieldLabel>
          <AdminInput
            value={values.category}
            onChange={(e) => setField('category', e.target.value)}
            placeholder="e.g. Web Development"
            className={errors.category ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Duration *</FieldLabel>
          <AdminInput
            value={values.duration}
            onChange={(e) => setField('duration', e.target.value)}
            placeholder="e.g. 12 weeks"
            className={errors.duration ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.duration && <p className="mt-1 text-xs text-red-600">{errors.duration}</p>}
        </div>
        <div>
          <FieldLabel>Training Mode *</FieldLabel>
          <AdminSelect
            value={values.trainingMode}
            onChange={(e) => setField('trainingMode', e.target.value as TrainingFormValues['trainingMode'])}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </AdminSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Level *</FieldLabel>
          <AdminSelect
            value={values.level}
            onChange={(e) => setField('level', e.target.value as TrainingFormValues['level'])}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </AdminSelect>
        </div>
        <div>
          <FieldLabel>Payment Type *</FieldLabel>
          <AdminSelect
            value={values.paymentType}
            onChange={(e) => {
              const next = e.target.value as TrainingFormValues['paymentType'];
              setField('paymentType', next);
              if (next === 'Free') setField('amount', '0');
            }}
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </AdminSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <FieldLabel>Course Fee *</FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {values.currency === 'INR' ? '₹' : values.currency}
            </span>
            <AdminInput
              type="number"
              min="0"
              value={values.amount}
              onChange={(e) => setField('amount', e.target.value)}
              placeholder="0"
              disabled={values.paymentType === 'Free'}
              className={`pl-8 ${errors.amount ? 'border-red-500 dark:border-red-500' : ''}`}
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This is the amount Razorpay charges for paid trainings.
          </p>
        </div>
        <div>
          <FieldLabel>Currency *</FieldLabel>
          <AdminInput
            value={values.currency}
            onChange={(e) => setField('currency', e.target.value.toUpperCase())}
            placeholder="INR"
            maxLength={10}
            className={errors.currency ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.currency && <p className="mt-1 text-xs text-red-600">{errors.currency}</p>}
        </div>
        <div>
          <FieldLabel>Status *</FieldLabel>
          <AdminSelect
            value={values.status}
            onChange={(e) => setField('status', e.target.value as TrainingFormValues['status'])}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </AdminSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Start Date</FieldLabel>
          <AdminInput
            type="date"
            value={values.startDate}
            onChange={(e) => setField('startDate', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>End Date</FieldLabel>
          <AdminInput
            type="date"
            value={values.endDate}
            onChange={(e) => setField('endDate', e.target.value)}
            className={errors.endDate ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
        </div>
      </div>

      <div>
        <FieldLabel>Technologies (comma-separated) *</FieldLabel>
        <AdminInput
          value={values.technologiesCsv}
          onChange={(e) => setField('technologiesCsv', e.target.value)}
          placeholder="e.g. MongoDB, Express, React, Node.js"
          className={errors.technologiesCsv ? 'border-red-500 dark:border-red-500' : ''}
        />
        {errors.technologiesCsv && <p className="mt-1 text-xs text-red-600">{errors.technologiesCsv}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FieldLabel>Prerequisites (comma-separated)</FieldLabel>
          <AdminInput
            value={values.prerequisitesCsv}
            onChange={(e) => setField('prerequisitesCsv', e.target.value)}
            placeholder="e.g. Basic HTML, CSS"
          />
        </div>
        <div>
          <FieldLabel>Target Audience (comma-separated)</FieldLabel>
          <AdminInput
            value={values.targetAudienceCsv}
            onChange={(e) => setField('targetAudienceCsv', e.target.value)}
            placeholder="e.g. Freshers, Developers"
          />
        </div>
        <div>
          <FieldLabel>Learning Outcomes (comma-separated)</FieldLabel>
          <AdminInput
            value={values.learningOutcomesCsv}
            onChange={(e) => setField('learningOutcomesCsv', e.target.value)}
            placeholder="e.g. Build full-stack apps"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Display Order</FieldLabel>
          <AdminInput
            type="number"
            value={values.displayOrder}
            onChange={(e) => setField('displayOrder', e.target.value)}
            placeholder="0"
            className={errors.displayOrder ? 'border-red-500 dark:border-red-500' : ''}
          />
          {errors.displayOrder && <p className="mt-1 text-xs text-red-600">{errors.displayOrder}</p>}
        </div>
        <div>
          <FieldLabel>Featured</FieldLabel>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => setField('isFeatured', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Mark as featured
          </label>
        </div>
      </div>

      {/* Curriculum */}
      <ContentCard className="p-4 mb-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Curriculum
          </h3>
          <SecondaryButton type="button" onClick={() => setField('curriculum', [...values.curriculum, { title: '', description: '', hours: '' }])}>
            <Plus className="w-4 h-4" /> Add module
          </SecondaryButton>
        </div>
        {values.curriculum.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No modules yet. Add modules to show a course syllabus.</p>
        )}
        <div className="space-y-4">
          {values.curriculum.map((module, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3">
                <div>
                  <FieldLabel>Module Title</FieldLabel>
                  <AdminInput
                    value={module.title}
                    onChange={(e) => {
                      const next = values.curriculum.map((m, i) => (i === idx ? { ...m, title: e.target.value } : m));
                      setField('curriculum', next);
                    }}
                    placeholder="e.g. Introduction to React"
                  />
                </div>
                <div>
                  <FieldLabel>Hours</FieldLabel>
                  <AdminInput
                    type="number"
                    min="0"
                    value={module.hours}
                    onChange={(e) => {
                      const next = values.curriculum.map((m, i) => (i === idx ? { ...m, hours: e.target.value } : m));
                      setField('curriculum', next);
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setField('curriculum', values.curriculum.filter((_, i) => i !== idx))}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <FieldLabel>Description</FieldLabel>
                <AdminTextarea
                  rows={2}
                  value={module.description}
                  onChange={(e) => {
                    const next = values.curriculum.map((m, i) => (i === idx ? { ...m, description: e.target.value } : m));
                    setField('curriculum', next);
                  }}
                  placeholder="What this module covers"
                />
              </div>
            </div>
          ))}
        </div>
      </ContentCard>

      {/* FAQs */}
      <ContentCard className="p-4 mb-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> FAQs
          </h3>
          <SecondaryButton type="button" onClick={() => setField('faqs', [...values.faqs, { question: '', answer: '' }])}>
            <Plus className="w-4 h-4" /> Add FAQ
          </SecondaryButton>
        </div>
        {values.faqs.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No FAQs yet. Add common questions to help candidates.</p>
        )}
        <div className="space-y-4">
          {values.faqs.map((faq, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div>
                    <FieldLabel>Question</FieldLabel>
                    <AdminInput
                      value={faq.question}
                      onChange={(e) => {
                        const next = values.faqs.map((f, i) => (i === idx ? { ...f, question: e.target.value } : f));
                        setField('faqs', next);
                      }}
                      placeholder="e.g. Do I need prior experience?"
                    />
                  </div>
                  <div>
                    <FieldLabel>Answer</FieldLabel>
                    <AdminTextarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const next = values.faqs.map((f, i) => (i === idx ? { ...f, answer: e.target.value } : f));
                        setField('faqs', next);
                      }}
                      placeholder="Answer the question"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setField('faqs', values.faqs.filter((_, i) => i !== idx))}
                  className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </ContentCard>

      {/* Trainer */}
      <ContentCard className="p-4 mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" /> Trainer / Instructor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Trainer Name</FieldLabel>
            <AdminInput value={values.trainerName} onChange={(e) => setField('trainerName', e.target.value)} placeholder="e.g. John Doe" />
          </div>
          <div>
            <FieldLabel>Designation</FieldLabel>
            <AdminInput value={values.trainerDesignation} onChange={(e) => setField('trainerDesignation', e.target.value)} placeholder="e.g. Senior Developer" />
          </div>
        </div>
        <div className="mt-4">
          <FieldLabel>Trainer Image URL</FieldLabel>
          <AdminInput value={values.trainerImage} onChange={(e) => setField('trainerImage', e.target.value)} placeholder="https://example.com/trainer.jpg" />
        </div>
        <div className="mt-4">
          <FieldLabel>Trainer Bio</FieldLabel>
          <AdminTextarea value={values.trainerBio} onChange={(e) => setField('trainerBio', e.target.value)} rows={3} placeholder="Brief bio of the trainer" />
        </div>
      </ContentCard>

      {/* Certification */}
      <ContentCard className="p-4 mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" /> Certification
        </h3>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={values.certProvided}
            onChange={(e) => setField('certProvided', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Provide certificate on completion
        </label>
        {values.certProvided && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Certificate Name</FieldLabel>
              <AdminInput value={values.certName} onChange={(e) => setField('certName', e.target.value)} placeholder="e.g. MERN Stack Certificate" />
            </div>
            <div>
              <FieldLabel>Certificate Description</FieldLabel>
              <AdminInput value={values.certDescription} onChange={(e) => setField('certDescription', e.target.value)} placeholder="Description of the certificate" />
            </div>
          </div>
        )}
      </ContentCard>

      {/* SEO */}
      <ContentCard className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> SEO Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel>Meta Title</FieldLabel>
            <AdminInput value={values.seoTitle} onChange={(e) => setField('seoTitle', e.target.value)} placeholder="Max 60 chars" />
          </div>
          <div>
            <FieldLabel>Meta Description</FieldLabel>
            <AdminInput value={values.seoDescription} onChange={(e) => setField('seoDescription', e.target.value)} placeholder="Max 160 chars" />
          </div>
          <div>
            <FieldLabel>Meta Keywords</FieldLabel>
            <AdminInput value={values.seoKeywords} onChange={(e) => setField('seoKeywords', e.target.value)} placeholder="Comma-separated" />
          </div>
        </div>
      </ContentCard>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/admin/trainings"
          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </Link>
        <PrimaryButton type="submit" disabled={busy || submitting}>
          <Save className="w-4 h-4 mr-2" /> {busy || submitting ? 'Saving…' : 'Save Training'}
        </PrimaryButton>
      </div>
    </form>
  );
}
