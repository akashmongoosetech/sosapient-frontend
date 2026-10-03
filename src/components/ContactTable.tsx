import React, { useState, useEffect } from 'react';
import {
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  Table as TableIcon,
  Search,
  RefreshCw,
  Pencil
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { authFetch } from '../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton, IconButton, AdminInput, AdminSelect,
  AdminTableShell, TableHead, Th, StatusBadge, contactTone,
  LoadingState, EmptyState, ErrorState, ConfirmDialog, FieldLabel
} from './admin/ui';

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

const PAGE_SIZE = 10;
const STATUSES: ContactSubmission['status'][] = ['new', 'read', 'replied', 'archived'];

const ContactTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<ContactSubmission['status']>('new');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Search, filter, and pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactSubmission['status']>('all');
  const [page, setPage] = useState(1);

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/contact?limit=100`);
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      if (data.success) {
        setSubmissions(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filtering and searching
  useEffect(() => {
    let filtered = submissions;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(s) ||
        sub.email.toLowerCase().includes(s) ||
        (sub.subject && sub.subject.toLowerCase().includes(s)) ||
        (sub.company && sub.company.toLowerCase().includes(s)) ||
        (sub.phone && sub.phone.toLowerCase().includes(s))
      );
    }
    setFilteredSubmissions(filtered);
    setPage(1); // Reset to first page on filter/search change
  }, [submissions, search, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedSubmissions = filteredSubmissions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const deleteTarget = submissions.find((s) => s._id === deleteId) || null;

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle status update (backend PATCH honors status only)
  const handleStatusUpdate = async (id: string, newStatus: ContactSubmission['status']) => {
    try {
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmissions(submissions.map(sub =>
          sub._id === id ? { ...sub, status: newStatus } : sub
        ));
        notify('success', 'Status updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Handle delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/contact/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setSubmissions(submissions.filter(sub => sub._id !== deleteTarget._id));
        notify('success', 'Submission deleted successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to delete submission');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const openStatusEditor = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setStatusDraft(submission.status);
    setIsStatusModalOpen(true);
  };

  // Enhanced PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Contact Submissions', 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Add table
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'Phone', 'Company', 'Subject', 'Status', 'Received On']],
      body: filteredSubmissions.map(sub => [
        sub.name,
        sub.email,
        sub.phone || '-',
        sub.company || '-',
        sub.subject,
        sub.status,
        new Date(sub.createdAt).toLocaleDateString()
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
    });

    // Save the PDF
    doc.save('contact_submissions.pdf');
  };

  // Excel Export
  const handleExportExcel = () => {
    // Prepare data for Excel
    const data = filteredSubmissions.map(sub => ({
      Name: sub.name,
      Email: sub.email,
      Phone: sub.phone || '-',
      Company: sub.company || '-',
      Subject: sub.subject,
      Message: sub.message,
      Budget: sub.budget || '-',
      Timeline: sub.timeline || '-',
      Status: sub.status,
      'Received On': new Date(sub.createdAt).toLocaleDateString()
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contact Submissions');

    // Save the Excel file
    XLSX.writeFile(wb, 'contact_submissions.xlsx');
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Contacts" subtitle="Manage and review contact form submissions" />
        <ContentCard><LoadingState message="Loading contacts…" /></ContentCard>
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div>
        <PageHeader title="Contacts" subtitle="Manage and review contact form submissions" />
        <ContentCard><ErrorState title="Unable to load contacts" body={error} onRetry={fetchSubmissions} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Manage and review contact form submissions"
        actions={
          <>
            <SecondaryButton onClick={fetchSubmissions} aria-label="Refresh contacts">
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
            <SecondaryButton onClick={handleExportPDF}>
              <FileText className="h-4 w-4" /> Export PDF
            </SecondaryButton>
            <SecondaryButton onClick={handleExportExcel}>
              <TableIcon className="h-4 w-4" /> Export Excel
            </SecondaryButton>
          </>
        }
      />

      {notification && (
        <div
          role="status"
          className={`mb-4 flex items-center gap-3 rounded-xl border p-4 text-sm ${
            notification.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {notification.message}
        </div>
      )}

      <ContentCard>
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <AdminInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, subject…"
              aria-label="Search contacts"
              className="pl-9"
            />
          </div>
          <AdminSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            aria-label="Filter by status"
            className="sm:w-44"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </AdminSelect>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 sm:hidden">
          {paginatedSubmissions.map((submission) => (
            <div key={submission._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-gray-900 dark:text-white">{submission.name}</h3>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{submission.email}</p>
                </div>
                <StatusBadge label={submission.status} tone={contactTone(submission.status)} />
              </div>
              <p className="mt-2 truncate text-sm text-gray-600 dark:text-gray-300">{submission.subject}</p>
              <p className="mt-1 text-xs text-gray-400">Received {new Date(submission.createdAt).toLocaleDateString()}</p>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <AdminSelect
                  value={submission.status}
                  onChange={(e) => handleStatusUpdate(submission._id, e.target.value as ContactSubmission['status'])}
                  aria-label={`Update status for ${submission.name}`}
                  className="w-auto text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </AdminSelect>
                <div className="flex gap-1">
                  <IconButton label="View details" onClick={() => { setSelectedSubmission(submission); setIsViewModalOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Change status" onClick={() => openStatusEditor(submission)}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Delete submission" onClick={() => setDeleteId(submission._id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
          {paginatedSubmissions.length === 0 && (
            <EmptyState title="No contacts found" body={search || statusFilter !== 'all' ? 'No submissions match your filters.' : 'There are currently no contact submissions.'} />
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <AdminTableShell>
            <TableHead>
              <Th>Contact</Th>
              <Th>Subject</Th>
              <Th>Project details</Th>
              <Th>Status</Th>
              <Th>Received</Th>
              <Th className="text-right">Actions</Th>
            </TableHead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {paginatedSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{submission.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{submission.email}</div>
                    {submission.phone && <div className="text-xs text-gray-400">{submission.phone}</div>}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-sm text-gray-900 dark:text-white">{submission.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {submission.budget && <div>Budget: {submission.budget}</div>}
                    {submission.timeline && <div>Timeline: {submission.timeline}</div>}
                    {!submission.budget && !submission.timeline && <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <AdminSelect
                      value={submission.status}
                      onChange={(e) => handleStatusUpdate(submission._id, e.target.value as ContactSubmission['status'])}
                      aria-label={`Update status for ${submission.name}`}
                      className="w-auto py-1 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </AdminSelect>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <IconButton label="View details" onClick={() => { setSelectedSubmission(submission); setIsViewModalOpen(true); }}>
                        <Eye className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Change status" onClick={() => openStatusEditor(submission)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Delete submission" onClick={() => setDeleteId(submission._id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableShell>
          {paginatedSubmissions.length === 0 && (
            <EmptyState title="No contacts found" body={search || statusFilter !== 'all' ? 'No submissions match your filters.' : 'There are currently no contact submissions.'} />
          )}
          {filteredSubmissions.length > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <span>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredSubmissions.length)} of {filteredSubmissions.length}</span>
              <span>{safePage} / {totalPages}</span>
              <div className="flex gap-2">
                <SecondaryButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</SecondaryButton>
                <SecondaryButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</SecondaryButton>
              </div>
            </div>
          )}
        </div>
      </ContentCard>

      {/* View modal */}
      {isViewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsViewModalOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Contact details">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact details</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[['Name', selectedSubmission.name], ['Email', selectedSubmission.email], ['Phone', selectedSubmission.phone], ['Company', selectedSubmission.company], ['Subject', selectedSubmission.subject], ['Budget', selectedSubmission.budget], ['Timeline', selectedSubmission.timeline]].map(([k, v]) => v ? (
                <div key={k}>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{k}</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{v}</p>
                </div>
              ) : null)}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Status</p>
                <div className="mt-1"><StatusBadge label={selectedSubmission.status} tone={contactTone(selectedSubmission.status)} /></div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">{selectedSubmission.message}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={() => setIsViewModalOpen(false)}>Close</SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Status editor modal (backend PATCH honors status only) */}
      {isStatusModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsStatusModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-900" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Update status">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update status</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedSubmission.name} · {selectedSubmission.subject}</p>
            <div className="mt-4">
              <FieldLabel htmlFor="contact-status">Status</FieldLabel>
              <AdminSelect id="contact-status" value={statusDraft} onChange={(e) => setStatusDraft(e.target.value as ContactSubmission['status'])}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                ))}
              </AdminSelect>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <SecondaryButton onClick={() => setIsStatusModalOpen(false)}>Cancel</SecondaryButton>
              <SecondaryButton
                onClick={() => { handleStatusUpdate(selectedSubmission._id, statusDraft); setIsStatusModalOpen(false); }}
                className="bg-primary-600 text-white hover:bg-primary-700 border-primary-600"
              >
                Save status
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete submission?"
        body={`Are you sure you want to delete the submission from ${deleteTarget?.name || 'this contact'}?`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ContactTable;
