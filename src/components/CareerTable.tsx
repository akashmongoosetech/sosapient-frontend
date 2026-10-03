import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Trash2,
  Download,
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
  AdminTableShell, TableHead, Th, StatusBadge, careerTone,
  LoadingState, EmptyState, ErrorState, ConfirmDialog, FieldLabel
} from './admin/ui';

interface CareerApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  currentCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
  resume: {
    filename: string;
    contentType: string;
  };
}

const PAGE_SIZE = 10;
const STATUSES: CareerApplication['status'][] = ['pending', 'reviewed', 'shortlisted', 'rejected'];

const CareerTable: React.FC = () => {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<CareerApplication['status']>('pending');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CareerApplication['status']>('all');
  const [page, setPage] = useState(1);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/career?limit=100`);
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      if (data.success) {
        setApplications(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = useMemo(() => {
    let list = applications;
    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q) ||
        (a.currentCompany && a.currentCompany.toLowerCase().includes(q))
      );
    }
    return list;
  }, [applications, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const deleteTarget = applications.find((a) => a._id === deleteId) || null;

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle status update (backend PATCH honors status only)
  const handleStatusUpdate = async (id: string, newStatus: CareerApplication['status']) => {
    try {
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/career/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setApplications(applications.map(app =>
          app._id === id ? { ...app, status: newStatus } : app
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
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/career/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setApplications(applications.filter(app => app._id !== deleteTarget._id));
        notify('success', 'Application deleted successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to delete application');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const openStatusEditor = (application: CareerApplication) => {
    setSelectedApplication(application);
    setStatusDraft(application.status);
    setIsStatusModalOpen(true);
  };

  // Handle resume download
  const handleDownload = async (id: string) => {
    try {
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/career/${id}/resume`);
      if (!response.ok) {
        throw new Error(`Resume download failed (${response.status})`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      notify('error', 'Failed to download resume');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Career Applications', 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Add table
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'Position', 'Experience', 'Status', 'Applied On']],
      body: filtered.map(app => [
        app.name,
        app.email,
        app.position,
        app.experience,
        app.status,
        new Date(app.createdAt).toLocaleDateString()
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
    doc.save('career-applications.pdf');
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const data = filtered.map(app => ({
      Name: app.name,
      Email: app.email,
      Position: app.position,
      Experience: app.experience,
      'Current Company': app.currentCompany,
      'Expected Salary': app.expectedSalary,
      'Notice Period': app.noticePeriod,
      Status: app.status,
      'Applied On': new Date(app.createdAt).toLocaleDateString()
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Career Applications');

    // Save the Excel file
    XLSX.writeFile(wb, 'career-applications.xlsx');
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Career Applications" subtitle="Manage candidate applications" />
        <ContentCard><LoadingState message="Loading applications…" /></ContentCard>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div>
        <PageHeader title="Career Applications" subtitle="Manage candidate applications" />
        <ContentCard><ErrorState title="Unable to load applications" body={error} onRetry={fetchApplications} /></ContentCard>
      </div>
    );
  }

  const statusSelect = (application: CareerApplication, cls = 'w-auto py-1 text-sm') => (
    <AdminSelect
      value={application.status}
      onChange={(e) => handleStatusUpdate(application._id, e.target.value as CareerApplication['status'])}
      aria-label={`Update status for ${application.name}`}
      className={cls}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
      ))}
    </AdminSelect>
  );

  const actionButtons = (application: CareerApplication) => (
    <>
      <IconButton label="Download resume" onClick={() => handleDownload(application._id)}>
        <Download className="h-4 w-4 text-blue-600" />
      </IconButton>
      <IconButton label="View details" onClick={() => { setSelectedApplication(application); setIsViewModalOpen(true); }}>
        <Eye className="h-4 w-4" />
      </IconButton>
      <IconButton label="Change status" onClick={() => openStatusEditor(application)}>
        <Pencil className="h-4 w-4" />
      </IconButton>
      <IconButton label="Delete application" onClick={() => setDeleteId(application._id)}>
        <Trash2 className="h-4 w-4 text-red-600" />
      </IconButton>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Career Applications"
        subtitle="Manage candidate applications"
        actions={
          <>
            <SecondaryButton onClick={fetchApplications} aria-label="Refresh applications">
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
            <SecondaryButton onClick={exportToPDF}>
              <FileText className="h-4 w-4" /> Export PDF
            </SecondaryButton>
            <SecondaryButton onClick={exportToExcel}>
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
              placeholder="Search name, email, position…"
              aria-label="Search applications"
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
          {paged.map((application) => (
            <div key={application._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-gray-900 dark:text-white">{application.name}</h3>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{application.email}</p>
                </div>
                <StatusBadge label={application.status} tone={careerTone(application.status)} />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{application.position} · {application.experience}</p>
              <p className="mt-1 text-xs text-gray-400">Applied {new Date(application.createdAt).toLocaleDateString()}</p>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                {statusSelect(application)}
                <div className="flex gap-1">{actionButtons(application)}</div>
              </div>
            </div>
          ))}
          {paged.length === 0 && (
            <EmptyState title="No applications found" body={search || statusFilter !== 'all' ? 'No applications match your filters.' : 'There are currently no job applications.'} />
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <AdminTableShell>
            <TableHead>
              <Th>Applicant</Th>
              <Th>Position</Th>
              <Th>Experience</Th>
              <Th>Status</Th>
              <Th>Applied</Th>
              <Th className="text-right">Actions</Th>
            </TableHead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {paged.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{application.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{application.email}</div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-sm text-gray-900 dark:text-white">{application.position}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">{application.experience}</td>
                  <td className="px-4 py-3">{statusSelect(application)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">{actionButtons(application)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableShell>
          {paged.length === 0 && (
            <EmptyState title="No applications found" body={search || statusFilter !== 'all' ? 'No applications match your filters.' : 'There are currently no job applications.'} />
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <span>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
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
      {isViewModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsViewModalOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Application details">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application details</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[['Name', selectedApplication.name], ['Email', selectedApplication.email], ['Phone', selectedApplication.phone], ['Position', selectedApplication.position], ['Experience', selectedApplication.experience], ['Current company', selectedApplication.currentCompany], ['Expected salary', selectedApplication.expectedSalary], ['Notice period', selectedApplication.noticePeriod]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{k}</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{v || '—'}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Status</p>
                <div className="mt-1"><StatusBadge label={selectedApplication.status} tone={careerTone(selectedApplication.status)} /></div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Resume</p>
                <button onClick={() => handleDownload(selectedApplication._id)} className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
                  <Download className="h-4 w-4" /> {selectedApplication.resume?.filename || 'Download resume'}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Cover letter</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">{selectedApplication.coverLetter || '—'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={() => setIsViewModalOpen(false)}>Close</SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Status editor modal (backend PATCH honors status only) */}
      {isStatusModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsStatusModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-900" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Update status">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update status</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedApplication.name} · {selectedApplication.position}</p>
            <div className="mt-4">
              <FieldLabel htmlFor="career-status">Status</FieldLabel>
              <AdminSelect id="career-status" value={statusDraft} onChange={(e) => setStatusDraft(e.target.value as CareerApplication['status'])}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                ))}
              </AdminSelect>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <SecondaryButton onClick={() => setIsStatusModalOpen(false)}>Cancel</SecondaryButton>
              <SecondaryButton
                onClick={() => { handleStatusUpdate(selectedApplication._id, statusDraft); setIsStatusModalOpen(false); }}
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
        title="Delete application?"
        body={`Are you sure you want to delete the application from ${deleteTarget?.name || 'this candidate'}?`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CareerTable;
