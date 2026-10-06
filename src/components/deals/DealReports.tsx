import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Paperclip, CalendarDays } from 'lucide-react';
import { authFetch } from '../../utils/api';
import { formatDealDate, toDateInputValue, type Deal, type DealReport } from '../../types/deal';
import {
  SecondaryButton,
  PrimaryButton,
  ConfirmDialog,
} from '../admin/ui';
import AttachmentList from './AttachmentList';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

interface DealReportsProps {
  deal: Deal;
  onChanged: () => void;
}

function todayInput(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DealReports: React.FC<DealReportsProps> = ({ deal, onChanged }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DealReport | null>(null);
  const [date, setDate] = useState(todayInput());
  const [work, setWork] = useState('');
  const [comment, setComment] = useState('');
  const [nextPlan, setNextPlan] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removingAtt, setRemovingAtt] = useState<string | null>(null);

  const sorted = [...(deal.reports || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openAdd = () => {
    setEditing(null);
    setDate(todayInput());
    setWork('');
    setComment('');
    setNextPlan('');
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (rep: DealReport) => {
    setEditing(rep);
    setDate(toDateInputValue(rep.date));
    setWork(rep.workCompleted);
    setComment(rep.comment || '');
    setNextPlan(rep.nextPlan || '');
    setFormError(null);
    setFormOpen(true);
  };

  const saveReport = async () => {
    if (!date) {
      setFormError('Report date is required.');
      return;
    }
    if (!work.trim()) {
      setFormError('Work completed is required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const url = editing
        ? `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/reports/${editing._id}`
        : `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/reports`;
      const res = await authFetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, workCompleted: work.trim(), comment: comment.trim(), nextPlan: nextPlan.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.success) {
        throw new Error((data && data.message) || 'Unable to save report.');
      }
      setFormOpen(false);
      onChanged();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save report.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/reports/${deleteId}`, {
        method: 'DELETE',
      });
      onChanged();
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const uploadFiles = async (reportId: string, files: File[]) => {
    if (files.length > MAX_FILES) {
      setUploadError(`You can attach up to ${MAX_FILES} files at once.`);
      return;
    }
    for (const f of files) {
      if (f.size > MAX_FILE_BYTES) {
        setUploadError(`"${f.name}" exceeds the 5 MB limit.`);
        return;
      }
    }
    setUploadingId(reportId);
    setUploadError(null);
    try {
      const fd = new FormData();
      for (const f of files) fd.append('files', f, f.name);
      const res = await authFetch(
        `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/reports/${reportId}/attachments`,
        { method: 'POST', body: fd }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.success) {
        throw new Error((data && data.message) || 'Upload failed.');
      }
      onChanged();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploadingId(null);
    }
  };

  const removeAttachment = async (reportId: string, attId: string) => {
    setRemovingAtt(attId);
    try {
      await authFetch(
        `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/reports/${reportId}/attachments/${attId}`,
        { method: 'DELETE' }
      );
      onChanged();
    } finally {
      setRemovingAtt(null);
    }
  };

  return (
    <section aria-label="Project reports">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">
          Project Reports
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {sorted.length}
          </span>
        </h3>
        <SecondaryButton type="button" onClick={openAdd}>
          <Plus className="mr-1 h-4 w-4" /> Add Report
        </SecondaryButton>
      </div>

      {uploadError && (
        <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {uploadError}
        </p>
      )}

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No reports yet. Record the first day of work to start the project timeline.
        </p>
      ) : (
        <ol className="relative flex flex-col gap-4 border-l-2 border-primary-200 pl-5 dark:border-primary-800">
          {sorted.map((rep) => (
            <li key={rep._id} className="relative rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full bg-primary-600 ring-4 ring-white dark:ring-gray-900" aria-hidden="true" />
              <div className="flex items-start justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 dark:text-primary-300">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {formatDealDate(rep.date)}
                </p>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(rep)}
                    aria-label={`Edit report from ${formatDealDate(rep.date)}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(rep._id)}
                    aria-label={`Delete report from ${formatDealDate(rep.date)}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Work completed</p>
                  <p className="mt-0.5 whitespace-pre-line text-gray-800 dark:text-gray-100">{rep.workCompleted}</p>
                </div>
                {rep.comment && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Comment</p>
                    <p className="mt-0.5 whitespace-pre-line text-gray-700 dark:text-gray-200">{rep.comment}</p>
                  </div>
                )}
                {rep.nextPlan && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Next plan</p>
                    <p className="mt-0.5 whitespace-pre-line text-gray-700 dark:text-gray-200">{rep.nextPlan}</p>
                  </div>
                )}
              </div>
              <AttachmentList
                attachments={rep.attachments}
                onDelete={(attId) => removeAttachment(rep._id, attId)}
                deletingId={removingAtt}
              />
              <label className="mt-2 inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-gray-600 dark:text-gray-300">
                <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                {uploadingId === rep._id ? 'Uploading…' : 'Attach screenshots / files'}
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  className="sr-only"
                  disabled={uploadingId === rep._id}
                  onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    e.target.value = '';
                    if (files.length > 0) uploadFiles(rep._id, files);
                  }}
                />
              </label>
            </li>
          ))}
        </ol>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={editing ? 'Edit report' : 'Add report'}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">
            <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white">
              {editing ? 'Edit Report' : 'Add Daily Report'}
            </h4>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="report-date" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Date *
                </label>
                <input
                  id="report-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={todayInput()}
                  className="min-h-[40px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="report-work" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Work Completed *
                </label>
                <textarea
                  id="report-work"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  rows={4}
                  maxLength={10000}
                  placeholder="What was done on this date…"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="report-comment" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Comment / Notes
                </label>
                <textarea
                  id="report-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={10000}
                  placeholder="Client feedback, blockers, notes…"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="report-next" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Next Plan
                </label>
                <textarea
                  id="report-next"
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value)}
                  rows={3}
                  maxLength={10000}
                  placeholder="What happens next…"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              {formError && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                  {formError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="button" onClick={saveReport} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Save Report'}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete report?"
        body="Delete this report and its attachments? This cannot be undone."
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default DealReports;
