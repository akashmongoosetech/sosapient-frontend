import React, { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react";
import { authFetch } from '../utils/api';
import {
  ContentCard, PageHeader, PrimaryButton, SecondaryButton, IconButton,
  AdminInput, AdminSelect, FieldLabel,
  AdminTableShell, TableHead, Th, StatusBadge, EmptyState, ErrorState, ConfirmDialog, LoadingState
} from '../components/admin/ui';
import RichTextEditor, { isRichTextEmpty } from '../components/common/RichTextEditor';

interface JobPayload {
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: "open" | "closed";
}

const emptyJob: JobPayload = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  salary: "",
  experience: "",
  description: "",
  requirements: [],
  responsibilities: [],
  benefits: [],
  status: "open",
};

const JobAdmin: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<JobPayload>(emptyJob);
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/jobs?limit=100`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data?.success) setJobs(Array.isArray(data.data) ? data.data : []);
      else setError(data?.message || 'Failed to load jobs.');
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) =>
      String(j.title || '').toLowerCase().includes(q) ||
      String(j.department || '').toLowerCase().includes(q) ||
      String(j.location || '').toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const deleteTarget = jobs.find((j) => j._id === deleteId) || null;

  // Rich HTML from one editor is stored as a single array element so the
  // existing string[] API shape is preserved. Empty editors save as [].
  const docToArray = (html: string): string[] => (isRichTextEmpty(html) ? [] : [html]);

  // Legacy multi-item plain-text arrays become paragraphs for editing.
  // Saved back as a single HTML document on submit.
  const arrayToHtml = (items: unknown): string => {
    if (typeof items === 'string') return items;
    if (!Array.isArray(items)) return '';
    if (items.length === 1 && typeof items[0] === 'string') return items[0];
    return items
      .filter((v) => typeof v === 'string')
      .map((v) => (v as string).includes('<') ? (v as string) : `<p>${(v as string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('');
  };

  const setRichField = (key: 'description' | 'requirements' | 'responsibilities' | 'benefits') => (html: string) => {
    if (key === 'description') {
      setForm((f) => ({ ...f, description: html }));
      if (!isRichTextEmpty(html)) setDescError(null);
    } else {
      setForm((f) => ({ ...f, [key]: docToArray(html) }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRichTextEmpty(form.description)) {
      setDescError('Description is required.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const method = editing ? "PATCH" : "POST";
      const url = editing
        ? `${import.meta.env.VITE_BASE_URL}/api/jobs/${editing._id}`
        : `${import.meta.env.VITE_BASE_URL}/api/jobs`;
      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to save job.');
      }
      setForm(emptyJob);
      setEditing(null);
      setDescError(null);
      fetchJobs();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await authFetch(`${import.meta.env.VITE_BASE_URL}/api/jobs/${deleteTarget._id}`, {
        method: "DELETE",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
      fetchJobs();
    }
  };

  const onChangeStatus = async (id: string, status: 'open' | 'closed') => {
    try {
      await authFetch(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      // Optimistic UI: update local state
      setJobs(prev => prev.map(j => j._id === id ? { ...j, status } : j));
    } catch {
      // Fallback: refetch
      fetchJobs();
    }
  };

  const formatPosted = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso).getTime();
      const diff = Date.now() - d;
      const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
      const sec = Math.round(diff / 1000);
      const min = Math.round(sec / 60);
      const hr = Math.round(min / 60);
      const day = Math.round(hr / 24);
      const week = Math.round(day / 7);
      const month = Math.round(day / 30);
      const year = Math.round(day / 365);
      if (Math.abs(sec) < 60) return rtf.format(-sec, 'second');
      if (Math.abs(min) < 60) return rtf.format(-min, 'minute');
      if (Math.abs(hr) < 24) return rtf.format(-hr, 'hour');
      if (Math.abs(day) < 7) return rtf.format(-day, 'day');
      if (Math.abs(week) < 5) return rtf.format(-week, 'week');
      if (Math.abs(month) < 12) return rtf.format(-month, 'month');
      return rtf.format(-year, 'year');
    } catch {
      return '';
    }
  };

  const startEdit = (job: any) => {
    setEditing(job);
    setDescError(null);
    setSaveError(null);
    const {
      title,
      department,
      location,
      type,
      salary,
      experience,
      description,
      requirements,
      responsibilities,
      benefits,
      status,
    } = job;
    setForm({
      title,
      department,
      location,
      type,
      salary,
      experience,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      benefits: benefits || [],
      status,
    });
    setActiveTab("form");
  };

  return (
    <div>
      <PageHeader
        title="Job Management"
        subtitle="Create and manage job opportunities"
        actions={
          activeTab === 'list' ? (
            <PrimaryButton onClick={() => { setEditing(null); setForm(emptyJob); setActiveTab('form'); }}>
              <Plus className="h-4 w-4" /> New job
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={() => setActiveTab('list')}>View listings</SecondaryButton>
          )
        }
      />

      <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium min-h-[40px] ${
            activeTab === "form"
              ? "border-primary-600 text-primary-600 dark:text-primary-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("form")}
        >
          {editing ? 'Edit Job' : 'Post a Job'}
        </button>
        <button
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium min-h-[40px] ${
            activeTab === "list"
              ? "border-primary-600 text-primary-600 dark:text-primary-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("list")}
        >
          Job Listings
        </button>
      </div>

      {activeTab === "form" && (
        <ContentCard className="p-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="job-title">Title</FieldLabel>
              <AdminInput id="job-title" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <FieldLabel htmlFor="job-dept">Department</FieldLabel>
              <AdminInput id="job-dept" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
            </div>
            <div>
              <FieldLabel htmlFor="job-loc">Location</FieldLabel>
              <AdminInput id="job-loc" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <FieldLabel htmlFor="job-type">Type</FieldLabel>
              <AdminInput id="job-type" placeholder="Type (Full-time/Part-time)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
            </div>
            <div>
              <FieldLabel htmlFor="job-salary">Salary</FieldLabel>
              <AdminInput id="job-salary" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            </div>
            <div>
              <FieldLabel htmlFor="job-exp">Experience</FieldLabel>
              <AdminInput id="job-exp" placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                key={`desc-${editing?._id || 'new'}`}
                id="job-desc"
                label="Description"
                required
                value={form.description}
                onChange={setRichField('description')}
                placeholder="Write a clear overview of the role…"
                error={descError}
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                key={`req-${editing?._id || 'new'}`}
                id="job-req"
                label="Requirements"
                value={arrayToHtml(form.requirements)}
                onChange={setRichField('requirements')}
                placeholder="Add required skills, qualifications, and experience…"
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                key={`resp-${editing?._id || 'new'}`}
                id="job-resp"
                label="Responsibilities"
                value={arrayToHtml(form.responsibilities)}
                onChange={setRichField('responsibilities')}
                placeholder="Describe the key responsibilities for this role…"
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                key={`ben-${editing?._id || 'new'}`}
                id="job-ben"
                label="Benefits"
                value={arrayToHtml(form.benefits)}
                onChange={setRichField('benefits')}
                placeholder="Add salary, benefits, perks, and other advantages…"
              />
            </div>
            <div>
              <FieldLabel htmlFor="job-status">Status</FieldLabel>
              <AdminSelect id="job-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobPayload['status'] })}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </AdminSelect>
            </div>
            {saveError && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                {saveError}
              </p>
            )}
            <div className="flex items-end gap-2 md:col-span-2">
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? "Update Job" : "Create Job"}</PrimaryButton>
              {editing && (
                <SecondaryButton type="button" onClick={() => { setEditing(null); setForm(emptyJob); setDescError(null); }}>
                  Cancel
                </SecondaryButton>
              )}
            </div>
          </form>
        </ContentCard>
      )}

      {activeTab === "list" && (
        <ContentCard>
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <AdminInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs…" aria-label="Search jobs" className="pl-9" />
            </div>
            <SecondaryButton onClick={fetchJobs} aria-label="Refresh jobs">
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
          </div>
          {loading ? (
            <LoadingState message="Loading jobs…" />
          ) : error && jobs.length === 0 ? (
            <ErrorState title="Unable to load jobs" body={error} onRetry={fetchJobs} />
          ) : (
            <>
              <AdminTableShell>
                <TableHead>
                  <Th>Title</Th>
                  <Th>Department</Th>
                  <Th>Location</Th>
                  <Th>Type</Th>
                  <Th>Posted</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </TableHead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {filtered.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{job.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{job.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{job.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{job.type}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatPosted(job.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge label={job.status} tone={job.status === 'open' ? 'green' : 'gray'} />
                          <AdminSelect
                            value={job.status}
                            onChange={(e) => onChangeStatus(job._id, e.target.value as 'open' | 'closed')}
                            aria-label={`Update status for ${job.title}`}
                            className="w-auto py-1 text-sm"
                          >
                            <option value="open">open</option>
                            <option value="closed">closed</option>
                          </AdminSelect>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <IconButton label={`Edit ${job.title}`} onClick={() => startEdit(job)}>
                            <Pencil className="h-4 w-4" />
                          </IconButton>
                          <IconButton label={`Delete ${job.title}`} onClick={() => setDeleteId(job._id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AdminTableShell>
              {filtered.length === 0 && (
                <EmptyState title="No jobs found" body={search ? 'No jobs match your search.' : 'No job postings yet. Create the first one.'} />
              )}
            </>
          )}
        </ContentCard>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete job?"
        body={`Are you sure you want to delete “${deleteTarget?.title || 'this job posting'}”?`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default JobAdmin;
