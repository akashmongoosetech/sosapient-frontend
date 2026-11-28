import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Download, Eye } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton, AdminInput, AdminSelect,
  AdminTableShell, TableHead, Th, StatusBadge, LoadingState, EmptyState, ErrorState
} from '../../components/admin/ui';
import { CandidateDetailsModal } from '../../components/admin/CandidateDetailsModal';
import { CandidateListItem, CandidatesResponse, CandidateDetail } from '../../types/training';

const LIMIT = 20;

const paymentTone = (s: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  switch (s) {
    case 'paid': return 'green';
    case 'pending': return 'yellow';
    case 'failed': return 'red';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};

const CandidatePage: React.FC = () => {
  const [items, setItems] = useState<CandidateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'all' | 'pending' | 'paid' | 'failed' | 'cancelled'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [courses, setCourses] = useState<Array<{ _id: string; title: string }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetail | null>(null);
  const [modalBusy, setModalBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch distinct courses for the course filter dropdown
  const fetchCourses = useCallback(async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/public?limit=100`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data.map((t: any) => ({ _id: t._id, title: t.title })));
        }
      }
    } catch {
      // courses are optional; filter stays empty
    }
  }, []);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT)
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus);
      if (courseFilter !== 'all') params.set('trainingId', courseFilter);

      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/admin/candidates?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data: CandidatesResponse = await res.json();
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
        setError(null);
      } else {
        throw new Error((data as unknown as { message?: string }).message || 'Failed to load candidates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, paymentStatus, courseFilter, refreshKey]);

  useEffect(() => {
    fetchCourses();
    fetchCandidates();
  }, [fetchCourses, fetchCandidates]);

  const counts = {
    total: items.length,
    paid: items.filter((i) => i.paymentStatus === 'paid').length,
    pending: items.filter((i) => i.paymentStatus === 'pending').length,
    failed: items.filter((i) => i.paymentStatus === 'failed').length,
    revenue: items
      .filter((i) => i.paymentStatus === 'paid' && i.paymentType === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0)
  };

  const handleView = async (id: string) => {
    setModalBusy(true);
    setSelectedCandidate(null);
    setModalOpen(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/admin/candidates/${id}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedCandidate(data.data as CandidateDetail);
      } else {
        setError(data.message || 'Failed to load candidate details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidate details');
    } finally {
      setModalBusy(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus);
      if (courseFilter !== 'all') params.set('trainingId', courseFilter);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/training/admin/enrollments/export?${params.toString()}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'candidates.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const hasFilters = debouncedSearch !== '' || paymentStatus !== 'all' || courseFilter !== 'all';

  if (loading && items.length === 0) {
    return (
      <div>
        <PageHeader title="Candidates Management" subtitle="Manage enrolled candidates, course registrations, and payment records." />
        <ContentCard className="p-4"><LoadingState message="Loading candidates…" /></ContentCard>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div>
        <PageHeader title="Candidates Management" subtitle="Manage enrolled candidates, course registrations, and payment records." />
        <ContentCard className="p-4"><ErrorState title="Unable to load candidates" body={error} onRetry={() => { setRefreshKey((k) => k + 1); }} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Candidates Management"
        subtitle="Manage enrolled candidates, course registrations, and payment records."
        actions={
          <>
            <SecondaryButton onClick={() => { setRefreshKey((k) => k + 1); }} aria-label="Refresh candidates">
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
            <button
              onClick={handleExport}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <ContentCard className="p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Candidates</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid</p>
          <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">{counts.paid}</p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
          <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">{counts.pending}</p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</p>
          <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">{counts.failed}</p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (Paid)</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">₹{counts.revenue.toLocaleString()}</p>
        </ContentCard>
      </div>

      <ContentCard>
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 lg:flex-row">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <AdminInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or mobile…"
              aria-label="Search candidates"
              className="pl-9"
            />
          </div>
          <AdminSelect
            value={paymentStatus}
            onChange={(e) => { setPaymentStatus(e.target.value as typeof paymentStatus); setPage(1); }}
            aria-label="Filter by payment status"
            className="lg:w-52"
          >
            <option value="all">All Candidates</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </AdminSelect>
          <AdminSelect
            value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
            aria-label="Filter by course"
            className="lg:w-64"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </AdminSelect>
          {hasFilters && (
            <SecondaryButton onClick={() => { setSearch(''); setDebouncedSearch(''); setPaymentStatus('all'); setCourseFilter('all'); setPage(1); }}>
              Reset filters
            </SecondaryButton>
          )}
        </div>

        <div className="space-y-3 p-4 sm:hidden">
          {items.map((item) => (
            <div key={item._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">{item.candidateName}</p>
                  <p className="truncate text-sm text-gray-500">{item.email}</p>
                  <p className="truncate text-sm text-gray-500">{item.mobile}</p>
                  <p className="truncate text-sm text-gray-500">{item.courseTitleSnapshot}</p>
                  <p className="truncate text-sm text-gray-500">{item.paymentType === 'Paid' ? `₹${item.amount}` : 'Free'}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge label={item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)} tone={paymentTone(item.paymentStatus)} />
                  <button
                    onClick={() => handleView(item._id)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white"
                    aria-label={`View details for ${item.candidateName}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <EmptyState
              title="No candidates found"
              body={hasFilters ? 'No candidates match your filters.' : 'No candidates have enrolled yet.'}
            />
          )}
        </div>

        <div className="hidden sm:block">
          <AdminTableShell>
            <TableHead>
              <Th>Candidate</Th>
              <Th>Email</Th>
              <Th>Mobile</Th>
              <Th>Course</Th>
              <Th>Amount</Th>
              <Th>Payment Status</Th>
              <Th>Enrolled</Th>
              <Th className="text-right">Actions</Th>
            </TableHead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{item.candidateName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.mobile}</p>
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.email}</td>
                  <td className="max-w-[150px] truncate px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.mobile}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.courseTitleSnapshot}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {item.paymentType === 'Paid' ? `₹${item.amount}` : 'Free'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)} tone={paymentTone(item.paymentStatus)} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleView(item._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableShell>
          {items.length === 0 && (
            <EmptyState
              title="No candidates found"
              body={hasFilters ? 'No candidates match your filters.' : 'No candidates have enrolled yet.'}
            />
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

      <CandidateDetailsModal
        open={modalOpen}
        candidate={selectedCandidate}
        onClose={() => { setModalOpen(false); setSelectedCandidate(null); }}
        busy={modalBusy}
      />
    </div>
  );
};

export default CandidatePage;
