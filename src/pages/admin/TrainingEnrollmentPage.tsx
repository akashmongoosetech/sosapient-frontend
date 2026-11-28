import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, RefreshCw } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton, AdminInput, AdminSelect,
  AdminTableShell, TableHead, Th, StatusBadge, LoadingState, EmptyState, ErrorState
} from '../../components/admin/ui';
import { AdminEnrollment, EnrollmentStats } from '../../types/training';

const LIMIT = 20;

const paymentTone = (s: string) => {
  switch (s) {
    case 'paid': return 'green';
    case 'pending': return 'yellow';
    case 'failed': return 'red';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};

const enrollmentTone = (s: string) => {
  switch (s) {
    case 'confirmed': return 'green';
    case 'pending': return 'yellow';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};

const TrainingEnrollmentPage: React.FC = () => {
  const [items, setItems] = useState<AdminEnrollment[]>([]);
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'all' | 'pending' | 'paid' | 'failed' | 'cancelled'>('all');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [paymentType, setPaymentType] = useState<'all' | 'Free' | 'Paid'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/training/admin/enrollments/stats`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setStats(data.data);
      }
    } catch {
      // stats are optional
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT)
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus);
      if (enrollmentStatus !== 'all') params.set('enrollmentStatus', enrollmentStatus);
      if (paymentType !== 'all') params.set('paymentType', paymentType);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/training/admin/enrollments?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
        setError(null);
      } else {
        throw new Error((data as unknown as { message?: string }).message || 'Failed to load enrollments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, paymentStatus, enrollmentStatus, paymentType]);

  useEffect(() => {
    fetchStats();
    fetchItems();
  }, [fetchStats, fetchItems]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus);
      if (enrollmentStatus !== 'all') params.set('enrollmentStatus', enrollmentStatus);
      if (paymentType !== 'all') params.set('paymentType', paymentType);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/training/admin/enrollments/export?${params.toString()}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enrollments.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div>
        <PageHeader title="Enrollments" subtitle="Manage course enrollments and payments" />
        <ContentCard className="p-4"><LoadingState message="Loading enrollments…" /></ContentCard>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div>
        <PageHeader title="Enrollments" subtitle="Manage course enrollments and payments" />
        <ContentCard className="p-4"><ErrorState title="Unable to load enrollments" body={error} onRetry={fetchItems} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Enrollments"
        subtitle="Manage course enrollments and payments"
        actions={
          <>
            <SecondaryButton onClick={() => { fetchItems(); fetchStats(); }} aria-label="Refresh enrollments" disabled={exporting}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </>
        }
      />

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ContentCard className="p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollments</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEnrollments}</p>
          </ContentCard>
          <ContentCard className="p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</p>
          </ContentCard>
          <ContentCard className="p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Successful Payments</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSuccessfulPayments}</p>
          </ContentCard>
          <ContentCard className="p-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPendingPayments}</p>
          </ContentCard>
        </div>
      )}

      <ContentCard>
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 lg:flex-row">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <AdminInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate, email, course…" aria-label="Search enrollments" className="pl-9" />
          </div>
          <AdminSelect value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value as typeof paymentStatus); setPage(1); }} aria-label="Filter by payment status" className="lg:w-52">
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </AdminSelect>
          <AdminSelect value={enrollmentStatus} onChange={(e) => { setEnrollmentStatus(e.target.value as typeof enrollmentStatus); setPage(1); }} aria-label="Filter by enrollment status" className="lg:w-52">
            <option value="all">All enrollments</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </AdminSelect>
          <AdminSelect value={paymentType} onChange={(e) => { setPaymentType(e.target.value as typeof paymentType); setPage(1); }} aria-label="Filter by payment type" className="lg:w-44">
            <option value="all">All types</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </AdminSelect>
          {(search || paymentStatus !== 'all' || enrollmentStatus !== 'all' || paymentType !== 'all') && (
            <SecondaryButton onClick={() => { setSearch(''); setPaymentStatus('all'); setEnrollmentStatus('all'); setPaymentType('all'); setPage(1); }}>
              Clear filters
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
                  <p className="truncate text-sm text-gray-500">{item.courseTitleSnapshot}</p>
                  {item.message && <p className="truncate text-xs text-gray-500">“{item.message}”</p>}
                  <p className="truncate text-sm text-gray-500">{item.paymentType === 'Paid' ? `₹${item.amount}` : 'Free'}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge label={item.paymentStatus} tone={paymentTone(item.paymentStatus)} />
                  <StatusBadge label={item.enrollmentStatus} tone={enrollmentTone(item.enrollmentStatus)} />
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <EmptyState
              title="No enrollments found"
              body={search || paymentStatus !== 'all' || enrollmentStatus !== 'all' || paymentType !== 'all' ? 'No enrollments match your filters.' : 'No enrollments yet.'}
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
              <Th>Type</Th>
              <Th>Razorpay Order ID</Th>
              <Th>Razorpay Payment ID</Th>
              <Th>Payment Status</Th>
              <Th>Enrollment Status</Th>
              <Th>Enrolled</Th>
              <Th className="text-right">Transaction</Th>
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
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.paymentType}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] block">
                    {item.razorpayOrderId || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] block">
                    {item.razorpayPaymentId || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={item.paymentStatus} tone={paymentTone(item.paymentStatus)} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={item.enrollmentStatus} tone={enrollmentTone(item.enrollmentStatus)} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] block">{item.transactionId || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableShell>
          {items.length === 0 && (
            <EmptyState
              title="No enrollments found"
              body={search || paymentStatus !== 'all' || enrollmentStatus !== 'all' || paymentType !== 'all' ? 'No enrollments match your filters.' : 'No enrollments yet.'}
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
    </div>
  );
};

export default TrainingEnrollmentPage;
