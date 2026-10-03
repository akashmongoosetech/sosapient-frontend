import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Calendar, Trash2, FileText, Table as TableIcon, Search, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { authFetch } from '../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton, IconButton, AdminInput,
  AdminTableShell, TableHead, Th, SkeletonRows, StatusBadge,
  LoadingState, EmptyState, ErrorState, ConfirmDialog
} from './admin/ui';

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  status: string;
}

const PAGE_SIZE = 10;

const SubscriberTable: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/subscribers?limit=100`);
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const data = await response.json();
      setSubscribers(Array.isArray(data) ? data : (data.data || []));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? subscribers.filter((s) => s.email.toLowerCase().includes(q))
      : subscribers;
    return list;
  }, [subscribers, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const deleteTarget = subscribers.find((s) => s._id === deleteId) || null;

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/subscribers/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscriber');
      }

      setSubscribers(subscribers.filter(sub => sub._id !== deleteTarget._id));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber');
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Subscriber List', 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Add table
    autoTable(doc, {
      startY: 30,
      head: [['Email', 'Subscription Date', 'Status']],
      body: filtered.map(sub => [
        sub.email,
        new Date(sub.subscribedAt).toLocaleDateString(),
        sub.status
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
    doc.save('subscribers.pdf');
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const data = filtered.map(sub => ({
      Email: sub.email,
      'Subscription Date': new Date(sub.subscribedAt).toLocaleDateString(),
      Status: sub.status
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Subscribers');

    // Save the Excel file
    XLSX.writeFile(wb, 'subscribers.xlsx');
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Subscribers" subtitle="Manage newsletter subscribers" />
        <ContentCard><LoadingState message="Loading subscribers…" /></ContentCard>
      </div>
    );
  }

  if (error && subscribers.length === 0) {
    return (
      <div>
        <PageHeader title="Subscribers" subtitle="Manage newsletter subscribers" />
        <ContentCard><ErrorState title="Unable to load subscribers" body={error} onRetry={fetchSubscribers} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle="Manage newsletter subscribers"
        actions={
          <>
            <SecondaryButton onClick={fetchSubscribers} aria-label="Refresh subscribers">
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

      <ContentCard>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <AdminInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email…"
              aria-label="Search subscribers"
              className="pl-9"
            />
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 sm:hidden">
          {paged.map((subscriber) => (
            <div key={subscriber._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate text-sm font-medium text-gray-900 dark:text-white">{subscriber.email}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                {new Date(subscriber.subscribedAt).toLocaleDateString()}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <StatusBadge label={subscriber.status} tone={subscriber.status === 'active' ? 'green' : 'red'} />
                <IconButton label={`Delete ${subscriber.email}`} onClick={() => setDeleteId(subscriber._id)}>
                  <Trash2 className="h-5 w-5 text-red-600" />
                </IconButton>
              </div>
            </div>
          ))}
          {paged.length === 0 && (
            <EmptyState title="No subscribers found" body={search ? 'No subscribers match your search.' : 'There are currently no newsletter subscribers.'} />
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <AdminTableShell>
            <TableHead>
              <Th>Email</Th>
              <Th>Subscription date</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </TableHead>
            {loading ? (
              <SkeletonRows rows={5} cols={4} />
            ) : (
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {paged.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <Mail className="h-4 w-4 text-gray-400" />{subscriber.email}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={subscriber.status} tone={subscriber.status === 'active' ? 'green' : 'red'} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <IconButton label={`Delete ${subscriber.email}`} onClick={() => setDeleteId(subscriber._id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </AdminTableShell>
          {paged.length === 0 && (
            <EmptyState title="No subscribers found" body={search ? 'No subscribers match your search.' : 'There are currently no newsletter subscribers.'} />
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <span>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-2">
                <SecondaryButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</SecondaryButton>
                <SecondaryButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</SecondaryButton>
              </div>
            </div>
          )}
        </div>
      </ContentCard>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete subscriber?"
        body={`Are you sure you want to delete ${deleteTarget?.email || 'this subscriber'}?`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SubscriberTable;
