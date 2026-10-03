import React, { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react";
import { authFetch } from '../utils/api';
import {
  ContentCard, PageHeader, PrimaryButton, SecondaryButton, IconButton,
  AdminInput, AdminSelect, AdminTextarea, FieldLabel,
  AdminTableShell, TableHead, Th, StatusBadge, EmptyState, ErrorState, ConfirmDialog, LoadingState
} from '../components/admin/ui';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing
      ? `${import.meta.env.VITE_BASE_URL}/api/jobs/${editing._id}`
      : `${import.meta.env.VITE_BASE_URL}/api/jobs`;
    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyJob);
    setEditing(null);
    fetchJobs();
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

  const toArray = (value: string) =>
    value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

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
              <FieldLabel htmlFor="job-desc">Description</FieldLabel>
              <AdminTextarea id="job-desc" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
            </div>
            <div>
              <FieldLabel htmlFor="job-req">Requirements (one per line)</FieldLabel>
              <AdminTextarea id="job-req" placeholder="Requirements (one per line)" value={form.requirements.join("\n")} onChange={(e) => setForm({ ...form, requirements: toArray(e.target.value) })} rows={4} />
            </div>
            <div>
              <FieldLabel htmlFor="job-resp">Responsibilities (one per line)</FieldLabel>
              <AdminTextarea id="job-resp" placeholder="Responsibilities (one per line)" value={form.responsibilities.join("\n")} onChange={(e) => setForm({ ...form, responsibilities: toArray(e.target.value) })} rows={4} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="job-ben">Benefits (one per line)</FieldLabel>
              <AdminTextarea id="job-ben" placeholder="Benefits (one per line)" value={form.benefits.join("\n")} onChange={(e) => setForm({ ...form, benefits: toArray(e.target.value) })} rows={3} />
            </div>
            <div>
              <FieldLabel htmlFor="job-status">Status</FieldLabel>
              <AdminSelect id="job-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobPayload['status'] })}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </AdminSelect>
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <PrimaryButton type="submit">{editing ? "Update Job" : "Create Job"}</PrimaryButton>
              {editing && (
                <SecondaryButton type="button" onClick={() => { setEditing(null); setForm(emptyJob); }}>
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
