import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, Search, RefreshCw, Link2, Ban, CheckCircle } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton, IconButton,
  AdminInput, AdminSelect, AdminTableShell, TableHead, Th,
  StatusBadge, LoadingState, EmptyState, ErrorState, ConfirmDialog
} from '../../components/admin/ui';
import { Certificate, CertificateListResponse, fullName, formatCertDate } from '../../types/certificate';
import { verificationUrl } from '../../config/certificate';

const LIMIT = 20;

const CertificatesPage: React.FC = () => {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'valid' | 'revoked'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (status !== 'all') params.set('status', status);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data: CertificateListResponse = await res.json();
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
        setError(null);
      } else {
        throw new Error((data as unknown as { message?: string }).message || 'Failed to load certificates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const copyUrl = async (cert: Certificate) => {
    const url = verificationUrl(cert.verificationSlug, cert.certificateId);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(cert.certificateId);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const toggleStatus = async (cert: Certificate) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${cert.certificateId}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: cert.status === 'valid' ? 'revoked' : 'valid' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setItems((prev) => prev.map((p) => (p.certificateId === cert.certificateId ? data.data : p)));
      }
    } catch {
      // silent; row keeps old state
    }
  };

  if (loading && items.length === 0) {
    return (
      <div>
        <PageHeader title="Certificate Generation" subtitle="Create and manage internship certificates" />
        <ContentCard><LoadingState message="Loading certificates…" /></ContentCard>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div>
        <PageHeader title="Certificate Generation" subtitle="Create and manage internship certificates" />
        <ContentCard><ErrorState title="Unable to load certificates" body={error} onRetry={fetchItems} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Certificate Generation"
        subtitle="Create and manage internship certificates"
        actions={
          <>
            <SecondaryButton onClick={fetchItems} aria-label="Refresh certificates">
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
            <Link
              to="/admin/certificates/new"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" /> Generate Certificate
            </Link>
          </>
        }
      />

      <ContentCard>
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <AdminInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, ID, email…" aria-label="Search certificates" className="pl-9" />
          </div>
          <AdminSelect value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} aria-label="Filter by status" className="sm:w-44">
            <option value="all">All statuses</option>
            <option value="valid">Valid</option>
            <option value="revoked">Revoked</option>
          </AdminSelect>
          {(search || status !== 'all') && (
            <SecondaryButton onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}>
              Clear filters
            </SecondaryButton>
          )}
        </div>

        <div className="space-y-3 p-4 sm:hidden">
          {items.map((c) => (
            <div key={c.certificateId} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900 dark:text-white">{fullName(c)}</p>
                  <p className="font-mono text-xs text-gray-500">{c.certificateId}</p>
                  <p className="truncate text-sm text-gray-500">{c.course} · {c.durationText}</p>
                </div>
                <StatusBadge label={c.status === 'valid' ? 'Valid' : 'Revoked'} tone={c.status === 'valid' ? 'green' : 'red'} />
              </div>
              <div className="mt-3 flex items-center justify-end gap-1 border-t border-gray-100 pt-3 dark:border-gray-800">
                <IconButton label="Copy verification URL" onClick={() => copyUrl(c)}>
                  <Link2 className="h-4 w-4" />
                </IconButton>
                <Link to={`/admin/certificates/${c.certificateId}`} aria-label={`View ${c.certificateId}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                  <Eye className="h-4 w-4" />
                </Link>
                <Link to={`/admin/certificates/${c.certificateId}/edit`} aria-label={`Edit ${c.certificateId}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                  <Pencil className="h-4 w-4" />
                </Link>
                <IconButton label={c.status === 'valid' ? 'Revoke' : 'Restore'} onClick={() => toggleStatus(c)}>
                  {c.status === 'valid' ? <Ban className="h-4 w-4 text-amber-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                </IconButton>
                <IconButton label="Delete" onClick={() => setDeleteId(c.certificateId)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </IconButton>
              </div>
              {copied === c.certificateId && <p className="mt-1 text-xs text-green-600">Verification URL copied</p>}
            </div>
          ))}
          {items.length === 0 && (
            <EmptyState title="No certificates found" body={search || status !== 'all' ? 'No certificates match your filters.' : 'Generate your first internship certificate to get started.'} />
          )}
        </div>

        <div className="hidden sm:block">
          <AdminTableShell>
            <TableHead>
              <Th>Certificate ID</Th>
              <Th>Candidate</Th>
              <Th>College</Th>
              <Th>Course</Th>
              <Th>Duration</Th>
              <Th>Dates</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </TableHead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {items.map((c) => (
                <tr key={c.certificateId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-semibold text-gray-900 dark:text-white">{c.certificateId}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{fullName(c)}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{c.college}</td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{c.course}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{c.durationText}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {formatCertDate(c.startDate)} → {formatCertDate(c.endDate)}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(c)} title={c.status === 'valid' ? 'Revoke' : 'Restore'}>
                      <StatusBadge label={c.status === 'valid' ? 'Valid' : 'Revoked'} tone={c.status === 'valid' ? 'green' : 'red'} />
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <IconButton label="Copy verification URL" onClick={() => copyUrl(c)}>
                        <Link2 className="h-4 w-4" />
                      </IconButton>
                      <Link to={`/admin/certificates/${c.certificateId}`} aria-label={`View ${c.certificateId}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/admin/certificates/${c.certificateId}/edit`} aria-label={`Edit ${c.certificateId}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <IconButton label="Delete" onClick={() => setDeleteId(c.certificateId)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableShell>
          {items.length === 0 && (
            <EmptyState title="No certificates found" body={search || status !== 'all' ? 'No certificates match your filters.' : 'Generate your first internship certificate to get started.'} />
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <span>Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, totalItems)} of {totalItems}</span>
              <span>{page} / {totalPages}</span>
              <div className="flex gap-2">
                <SecondaryButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</SecondaryButton>
                <SecondaryButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</SecondaryButton>
              </div>
            </div>
          )}
        </div>
      </ContentCard>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete certificate?"
        body={`Are you sure you want to permanently delete certificate ${deleteId}?`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            setDeleting(true);
            const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${deleteId}`, { method: 'DELETE' });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Delete failed');
            const remaining = items.filter((i) => i.certificateId !== deleteId);
            if (remaining.length === 0 && page > 1) setPage(page - 1);
            else {
              setItems(remaining);
              setTotalItems((t) => Math.max(0, t - 1));
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete certificate');
          } finally {
            setDeleting(false);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
};

export default CertificatesPage;
