import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Paperclip } from 'lucide-react';
import { authFetch } from '../../utils/api';
import type { Deal, DealRequirement } from '../../types/deal';
import {
  SecondaryButton,
  PrimaryButton,
  ConfirmDialog,
} from '../admin/ui';
import RichTextEditor, { isRichTextEmpty } from '../common/RichTextEditor';
import BlogRichContent from '../Blog/BlogRichContent';
import AttachmentList from './AttachmentList';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

interface DealRequirementsProps {
  deal: Deal;
  onChanged: () => void;
}

function filesError(files: File[]): string | null {
  if (files.length > MAX_FILES) return `You can attach up to ${MAX_FILES} files at once.`;
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) return `"${f.name}" exceeds the 5 MB limit.`;
  }
  return null;
}

const DealRequirements: React.FC<DealRequirementsProps> = ({ deal, onChanged }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DealRequirement | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removingAtt, setRemovingAtt] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setTitle('');
    setDescription('');
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (req: DealRequirement) => {
    setEditing(req);
    setTitle(req.title);
    setDescription(req.description || '');
    setFormError(null);
    setFormOpen(true);
  };

  const saveRequirement = async () => {
    if (!title.trim()) {
      setFormError('Requirement title is required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const url = editing
        ? `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/requirements/${editing._id}`
        : `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/requirements`;
      const res = await authFetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.success) {
        throw new Error((data && data.message) || 'Unable to save requirement.');
      }
      setFormOpen(false);
      onChanged();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save requirement.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/requirements/${deleteId}`, {
        method: 'DELETE',
      });
      onChanged();
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const uploadFiles = async (reqId: string, files: File[]) => {
    const err = filesError(files);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadingId(reqId);
    setUploadError(null);
    try {
      const fd = new FormData();
      for (const f of files) fd.append('files', f, f.name);
      const res = await authFetch(
        `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/requirements/${reqId}/attachments`,
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

  const removeAttachment = async (reqId: string, attId: string) => {
    setRemovingAtt(attId);
    try {
      await authFetch(
        `${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}/requirements/${reqId}/attachments/${attId}`,
        { method: 'DELETE' }
      );
      onChanged();
    } finally {
      setRemovingAtt(null);
    }
  };

  return (
    <section aria-label="Client requirements">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">
          Client Requirements
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {deal.requirements.length}
          </span>
        </h3>
        <SecondaryButton type="button" onClick={openAdd}>
          <Plus className="mr-1 h-4 w-4" /> Add Requirement
        </SecondaryButton>
      </div>

      {uploadError && (
        <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {uploadError}
        </p>
      )}

      {deal.requirements.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No requirements yet. Add the first one to record what the client wants.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {deal.requirements.map((req, i) => (
            <li key={req._id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-gray-900 dark:text-white">
                  <span className="mr-2 text-gray-400">{i + 1}.</span>
                  {req.title}
                </p>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(req)}
                    aria-label={`Edit requirement ${req.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(req._id)}
                    aria-label={`Delete requirement ${req.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {req.description && !isRichTextEmpty(req.description) && (
                <div className="mt-2">
                  <BlogRichContent html={req.description} label={`Requirement ${req.title}`} />
                </div>
              )}
              <AttachmentList
                attachments={req.attachments}
                onDelete={(attId) => removeAttachment(req._id, attId)}
                deletingId={removingAtt}
              />
              <label className="mt-2 inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-gray-600 dark:text-gray-300">
                <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                {uploadingId === req._id ? 'Uploading…' : 'Attach files (images, PDF · max 5 MB each)'}
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  className="sr-only"
                  disabled={uploadingId === req._id}
                  onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    e.target.value = '';
                    if (files.length > 0) uploadFiles(req._id, files);
                  }}
                />
              </label>
            </li>
          ))}
        </ol>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={editing ? 'Edit requirement' : 'Add requirement'}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">
            <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white">
              {editing ? 'Edit Requirement' : 'Add Requirement'}
            </h4>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="req-title" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Requirement Title *
                </label>
                <input
                  id="req-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Business website"
                  maxLength={200}
                  className="min-h-[40px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <RichTextEditor
                key={`deal-req-${editing?._id || 'new'}`}
                id="req-description"
                label="Requirement Description"
                value={description}
                onChange={setDescription}
                placeholder="Describe what the client wants in detail…"
              />
              {formError && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                  {formError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <SecondaryButton type="button" onClick={() => setFormOpen(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="button" onClick={saveRequirement} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Requirement'}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete requirement?"
        body="Delete this requirement and its attachments? This cannot be undone."
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default DealRequirements;
