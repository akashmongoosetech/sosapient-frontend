import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  ContentCard, PrimaryButton, SecondaryButton, AdminInput, AdminSelect,
  AdminTextarea, FieldLabel
} from '../../components/admin/ui';
import {
  CaseStudy, CaseStudyResult,
  CASE_STUDY_ICONS, CASE_STUDY_ICON_NAMES, CASE_STUDY_GRADIENTS,
  CASE_STUDY_CATEGORY_SUGGESTIONS
} from '../../types/caseStudy';
import { buildSlugPreview, isValidSlug } from '../../utils/blog';

export interface CaseStudyFormValues {
  title: string;
  slug: string;
  slugCustomized: boolean;
  client: string;
  category: string;
  duration: string;
  icon: string;
  color: string;
  thumbnailImageUrl: string;
  overview: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologiesCsv: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywordsCsv: string;
  published: boolean;
}

export const emptyFormValues = (): CaseStudyFormValues => ({
  title: '',
  slug: '',
  slugCustomized: false,
  client: '',
  category: '',
  duration: '',
  icon: 'Briefcase',
  color: CASE_STUDY_GRADIENTS[0],
  thumbnailImageUrl: '',
  overview: '',
  challenge: '',
  solution: '',
  results: [],
  technologiesCsv: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywordsCsv: '',
  published: false
});

export const toFormValues = (doc: CaseStudy): CaseStudyFormValues => ({
  title: doc.title,
  slug: doc.slug,
  slugCustomized: true,
  client: doc.client,
  category: doc.category,
  duration: doc.duration,
  icon: doc.icon,
  color: doc.color,
  thumbnailImageUrl: doc.thumbnailImageUrl,
  overview: doc.overview,
  challenge: doc.challenge || '',
  solution: doc.solution || '',
  results: Array.isArray(doc.results) ? doc.results.map((r) => ({ icon: r.icon, label: r.label, value: r.value })) : [],
  technologiesCsv: (doc.technologies || []).join(', '),
  seoTitle: doc.seo?.metaTitle || '',
  seoDescription: doc.seo?.metaDescription || '',
  seoKeywordsCsv: (doc.seo?.keywords || []).join(', '),
  published: Boolean(doc.published)
});

export interface CaseStudySubmitPayload {
  title: string;
  slug?: string;
  client: string;
  category: string;
  duration: string;
  icon: string;
  color: string;
  thumbnailImageUrl: string;
  overview: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string;
  seo: { metaTitle: string; metaDescription: string; keywords: string };
  published: boolean;
}

const RICH_TOOLBAR = [
  'heading', '|', 'bold', 'italic', 'underline', 'link', 'blockQuote',
  'bulletedList', 'numberedList', 'insertTable', '|', 'undo', 'redo'
];

const isHttpUrl = (v: string): boolean => {
  try {
    const u = new URL(v.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

interface CaseStudyFormProps {
  initial: CaseStudyFormValues;
  categories: string[];
  submitting: boolean;
  submitLabel: string;
  serverError: string | null;
  onCancel: () => void;
  onSubmit: (payload: CaseStudySubmitPayload) => void;
}

const Counter: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const over = value > max;
  const warn = !over && value > max * 0.9;
  return (
    <p className={`mt-1 text-xs ${over ? 'text-red-600 font-semibold' : warn ? 'text-amber-600' : 'text-gray-400'}`}>
      {value.toLocaleString()} / {max.toLocaleString()}{over ? ' — over limit' : ''}
    </p>
  );
};

const CaseStudyForm: React.FC<CaseStudyFormProps> = ({
  initial, categories, submitting, submitLabel, serverError, onCancel, onSubmit
}) => {
  const [v, setV] = useState<CaseStudyFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbOk, setThumbOk] = useState<boolean | null>(null);

  const set = <K extends keyof CaseStudyFormValues>(key: K, value: CaseStudyFormValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const suggestions = [...new Set([...CASE_STUDY_CATEGORY_SUGGESTIONS, ...categories])];

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!v.title.trim() || v.title.trim().length > 100) e.title = 'Title is required (max 100 characters).';
    if (v.slug.trim() && !isValidSlug(v.slug.trim().toLowerCase())) e.slug = 'Lowercase letters, numbers and single hyphens only (max 160).';
    if (!v.client.trim() || v.client.trim().length > 100) e.client = 'Client is required (max 100 characters).';
    if (!v.category.trim() || v.category.trim().length > 80) e.category = 'Category is required (max 80 characters).';
    if (!v.duration.trim() || v.duration.trim().length > 40) e.duration = 'Duration is required (max 40 characters).';
    if (!v.icon.trim()) e.icon = 'Icon is required.';
    if (!v.color.trim()) e.color = 'Color is required.';
    if (!isHttpUrl(v.thumbnailImageUrl)) e.thumbnailImageUrl = 'A valid http(s) image URL is required.';
    if (!v.overview.trim() || v.overview.length > 3000) e.overview = 'Overview is required (max 3000 characters).';
    if (v.challenge.length > 5000) e.challenge = 'Challenge must be at most 5000 characters.';
    if (v.solution.length > 5000) e.solution = 'Solution must be at most 5000 characters.';
    v.results.forEach((r, i) => {
      if (!r.icon.trim() || !r.label.trim() || !r.value.trim()) e[`results.${i}`] = `Result ${i + 1} needs icon, label and value.`;
      else if (r.label.length > 60 || r.value.length > 40) e[`results.${i}`] = `Result ${i + 1} exceeds limits (label 60, value 40).`;
    });
    if (v.results.length > 4) e.results = 'At most 4 results are allowed.';
    if (v.seoTitle.length > 60) e.seoTitle = 'Meta title must be at most 60 characters.';
    if (v.seoDescription.length > 160) e.seoDescription = 'Meta description must be at most 160 characters.';
    if (v.seoKeywordsCsv.length > 200) e.seoKeywords = 'Keywords must fit within 200 characters total.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      title: v.title.trim(),
      slug: v.slug.trim() ? v.slug.trim().toLowerCase() : undefined,
      client: v.client.trim(),
      category: v.category.trim(),
      duration: v.duration.trim(),
      icon: v.icon.trim(),
      color: v.color.trim(),
      thumbnailImageUrl: v.thumbnailImageUrl.trim(),
      overview: v.overview,
      challenge: v.challenge,
      solution: v.solution,
      results: v.results,
      technologies: v.technologiesCsv,
      seo: { metaTitle: v.seoTitle.trim(), metaDescription: v.seoDescription.trim(), keywords: v.seoKeywordsCsv },
      published: v.published
    });
  };

  const moveResult = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= v.results.length) return;
    const next = [...v.results];
    [next[i], next[j]] = [next[j], next[i]];
    setV((prev) => ({ ...prev, results: next }));
  };

  const errCls = 'mt-1 text-xs text-red-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {serverError}
        </div>
      )}

      {/* Basic information */}
      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Basic information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FieldLabel>Title *</FieldLabel>
            <AdminInput value={v.title} maxLength={101} onChange={(e) => setV((prev) => ({
              ...prev,
              title: e.target.value,
              slug: prev.slugCustomized ? prev.slug : buildSlugPreview(e.target.value)
            }))} placeholder="AI-Powered CRM & Business Automation" />
            <Counter value={v.title.trim().length} max={100} />
            {errors.title && <p className={errCls}>{errors.title}</p>}
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Slug</FieldLabel>
            <div className="flex gap-2">
              <AdminInput
                value={v.slug}
                onChange={(e) => { setV((prev) => ({ ...prev, slug: e.target.value.toLowerCase(), slugCustomized: true })); }}
                placeholder="auto-generated-from-title"
                className="font-mono"
              />
              <button
                type="button"
                onClick={() => setV((prev) => ({ ...prev, slug: buildSlugPreview(prev.title), slugCustomized: false }))}
                className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Regenerate
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {(v.slug || '').length}/160 · {v.slug && isValidSlug(v.slug.trim().toLowerCase()) ? 'Valid slug' : 'Lowercase letters, numbers and hyphens only'}
              {!v.slugCustomized && ' · auto-updates with title'}
            </p>
            {errors.slug && <p className={errCls}>{errors.slug}</p>}
          </div>
          <div>
            <FieldLabel>Client *</FieldLabel>
            <AdminInput value={v.client} maxLength={101} onChange={(e) => set('client', e.target.value)} placeholder="Confidential Business Client" />
            <Counter value={v.client.trim().length} max={100} />
            {errors.client && <p className={errCls}>{errors.client}</p>}
          </div>
          <div>
            <FieldLabel>Category *</FieldLabel>
            <AdminInput
              value={v.category}
              maxLength={81}
              list="cs-category-suggestions"
              onChange={(e) => set('category', e.target.value)}
              placeholder="Select or type a custom category"
            />
            <datalist id="cs-category-suggestions">
              {suggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category && <p className={errCls}>{errors.category}</p>}
          </div>
          <div>
            <FieldLabel>Duration *</FieldLabel>
            <AdminInput value={v.duration} maxLength={41} onChange={(e) => set('duration', e.target.value)} placeholder="10–12 weeks" />
            {errors.duration && <p className={errCls}>{errors.duration}</p>}
          </div>
          <div>
            <FieldLabel>Thumbnail image URL *</FieldLabel>
            <AdminInput value={v.thumbnailImageUrl} inputMode="url" onChange={(e) => { set('thumbnailImageUrl', e.target.value); setThumbOk(null); }} placeholder="https://example.com/images/crm-dashboard.jpg" />
            {errors.thumbnailImageUrl && <p className={errCls}>{errors.thumbnailImageUrl}</p>}
            {v.thumbnailImageUrl.trim() && isHttpUrl(v.thumbnailImageUrl) && (
              <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {thumbOk === false ? (
                  <p className="p-3 text-xs text-red-600">Image failed to load — check the URL.</p>
                ) : (
                  <img
                    src={v.thumbnailImageUrl.trim()}
                    alt="Thumbnail preview"
                    className="max-h-48 w-full object-cover"
                    onLoad={() => setThumbOk(true)}
                    onError={() => setThumbOk(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <FieldLabel>Icon *</FieldLabel>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10" role="radiogroup" aria-label="Icon">
            {CASE_STUDY_ICON_NAMES.map((name) => {
              const Icon = CASE_STUDY_ICONS[name];
              const active = v.icon === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={name}
                  onClick={() => set('icon', name)}
                  className={`flex h-11 items-center justify-center rounded-lg border transition ${active ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-800/30' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'}`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
          {errors.icon && <p className={errCls}>{errors.icon}</p>}
        </div>

        <div className="mt-4">
          <FieldLabel>Color *</FieldLabel>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Gradient">
            {CASE_STUDY_GRADIENTS.map((g) => {
              const active = v.color === g;
              return (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={g}
                  onClick={() => set('color', g)}
                  className={`h-10 w-20 rounded-lg bg-gradient-to-r ${g} transition ${active ? 'ring-2 ring-primary-600 ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                />
              );
            })}
          </div>
          {errors.color && <p className={errCls}>{errors.color}</p>}
        </div>
      </ContentCard>

      {/* Content */}
      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Content</h2>
        {([
          ['overview', 'Overview', true, 3000],
          ['challenge', 'Challenge (optional)', false, 5000],
          ['solution', 'Solution (optional)', false, 5000],
        ] as const).map(([key, label, required, max]) => (
          <div key={key} className="mt-4">
            <FieldLabel>{label}{required ? ' *' : ''}</FieldLabel>
            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
              <CKEditor
                editor={ClassicEditor as unknown as any}
                data={v[key]}
                config={{ toolbar: RICH_TOOLBAR }}
                onChange={(_, editor) => set(key, editor.getData())}
              />
            </div>
            <Counter value={v[key].length} max={max} />
            {errors[key] && <p className={errCls}>{errors[key]}</p>}
          </div>
        ))}
      </ContentCard>

      {/* Results */}
      <ContentCard className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Results <span className="font-normal text-gray-400">(max 4)</span></h2>
          <button
            type="button"
            disabled={v.results.length >= 4}
            onClick={() => setV((prev) => ({ ...prev, results: [...prev.results, { icon: 'TrendingUp', label: '', value: '' }] }))}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
          >
            <Plus className="h-4 w-4" /> Add result
          </button>
        </div>
        {v.results.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">No results yet. Add up to 4 measurable outcomes.</p>
        )}
        <div className="mt-3 space-y-3">
          {v.results.map((r, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <div>
                  <FieldLabel>Icon {i + 1}</FieldLabel>
                  <AdminSelect value={r.icon} onChange={(e) => {
                    const next = [...v.results];
                    next[i] = { ...next[i], icon: e.target.value };
                    setV((prev) => ({ ...prev, results: next }));
                  }}>
                    {CASE_STUDY_ICON_NAMES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </AdminSelect>
                </div>
                <div>
                  <FieldLabel>Label</FieldLabel>
                  <AdminInput value={r.label} maxLength={61} placeholder="Faster Lead Processing" onChange={(e) => {
                    const next = [...v.results];
                    next[i] = { ...next[i], label: e.target.value };
                    setV((prev) => ({ ...prev, results: next }));
                  }} />
                </div>
                <div>
                  <FieldLabel>Value</FieldLabel>
                  <AdminInput value={r.value} maxLength={41} placeholder="40%" onChange={(e) => {
                    const next = [...v.results];
                    next[i] = { ...next[i], value: e.target.value };
                    setV((prev) => ({ ...prev, results: next }));
                  }} />
                </div>
                <div className="flex items-end gap-1">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => moveResult(i, -1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Move down" disabled={i === v.results.length - 1} onClick={() => moveResult(i, 1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove result ${i + 1}`}
                    onClick={() => setV((prev) => ({ ...prev, results: prev.results.filter((_, j) => j !== i) }))}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {errors[`results.${i}`] && <p className={errCls}>{errors[`results.${i}`]}</p>}
            </div>
          ))}
        </div>
        {errors.results && <p className={errCls}>{errors.results}</p>}
      </ContentCard>

      {/* Technologies */}
      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Technologies</h2>
        <div className="mt-3">
          <FieldLabel>Comma-separated technologies</FieldLabel>
          <AdminTextarea
            value={v.technologiesCsv}
            rows={2}
            onChange={(e) => set('technologiesCsv', e.target.value)}
            placeholder="React.js, Node.js, Express.js, MongoDB, OpenAI, Make Automation"
          />
          <p className="mt-1 text-xs text-gray-400">Stored as an array — duplicates and blanks are removed automatically.</p>
        </div>
      </ContentCard>

      {/* SEO */}
      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">SEO settings</h2>
        <div className="mt-3 grid grid-cols-1 gap-4">
          <div>
            <FieldLabel>Meta title</FieldLabel>
            <AdminInput value={v.seoTitle} maxLength={61} onChange={(e) => set('seoTitle', e.target.value)} placeholder="AI-Powered CRM Case Study | SoSapient" />
            <Counter value={v.seoTitle.length} max={60} />
            {errors.seoTitle && <p className={errCls}>{errors.seoTitle}</p>}
          </div>
          <div>
            <FieldLabel>Meta description</FieldLabel>
            <AdminTextarea value={v.seoDescription} maxLength={161} rows={2} onChange={(e) => set('seoDescription', e.target.value)} placeholder="How we automated…" />
            <Counter value={v.seoDescription.length} max={160} />
            {errors.seoDescription && <p className={errCls}>{errors.seoDescription}</p>}
          </div>
          <div>
            <FieldLabel>SEO keywords (comma-separated, 200 chars total)</FieldLabel>
            <AdminInput value={v.seoKeywordsCsv} onChange={(e) => set('seoKeywordsCsv', e.target.value)} placeholder="AI CRM, CRM automation, business automation" />
            <Counter value={v.seoKeywordsCsv.length} max={200} />
            {errors.seoKeywords && <p className={errCls}>{errors.seoKeywords}</p>}
          </div>
        </div>
      </ContentCard>

      {/* Publishing */}
      <ContentCard className="p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Publishing</h2>
        <label className="mt-3 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={v.published}
            onChange={(e) => set('published', e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Publish case study</span>
        </label>
        <p className="mt-1 text-xs text-gray-400">Unpublished case studies stay in draft and are hidden from any future public listing.</p>
      </ContentCard>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <SecondaryButton type="button" onClick={onCancel}>Cancel</SecondaryButton>
        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default CaseStudyForm;
