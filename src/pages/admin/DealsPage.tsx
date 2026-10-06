import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import { authFetch } from '../../utils/api';
import { formatLeadDate } from '../../types/lead';
import { formatDealDate, type Deal, type DealListResponse } from '../../types/deal';
import {
  PageHeader,
  SecondaryButton,
  IconButton,
  AdminInput,
  AdminSelect,
  StatusBadge,
  AdminTableShell,
  TableHead,
  Th,
  SkeletonRows,
  EmptyState,
  ErrorState,
  ConfirmDialog,
} from '../../components/admin/ui';
import DealViewModal from '../../components/deals/DealViewModal';

const LIMITS = [25, 50, 100, 200];

const SORTS = [
  { value: 'newest', label: 'Newest first', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'oldest', label: 'Oldest first', sortBy: 'createdAt', sortOrder: 'asc' },
  { value: 'received-new', label: 'Recently received', sortBy: 'projectReceivedDate', sortOrder: 'desc' },
  { value: 'received-old', label: 'Oldest received', sortBy: 'projectReceivedDate', sortOrder: 'asc' },
  { value: 'updated', label: 'Recently active', sortBy: 'updatedAt', sortOrder: 'desc' },
];

const DealsPage: React.FC = () => {
  const [items, setItems] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [city, setCity] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Deep link from lead conversion feedback: /admin/deals?open=<dealId>
  useEffect(() => {
    const open = searchParams.get('open');
    if (open) {
      setViewId(open);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(t);
  }, [search]);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (city.trim()) params.set('city', city.trim());
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    const s = SORTS.find((o) => o.value === sort) || SORTS[0];
    params.set('sortBy', s.sortBy);
    params.set('sortOrder', s.sortOrder);
    return params.toString();
  }, [page, limit, debouncedSearch, city, dateFrom, dateTo, sort]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals?${buildParams()}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data: DealListResponse = await res.json();
      if (!data.success) throw new Error('Failed to load deals');
      setItems(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deals.');
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCity('');
    setDateFrom('');
    setDateTo('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Deals"
        subtitle="Converted leads with project workspace — reports, requirements and evidence"
      />

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss notification" className="shrink-0 rounded-md px-1 font-bold hover:opacity-70">
            ×
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <AdminInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search business, client, city, category…"
          aria-label="Search deals"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 [&>*]:min-w-0">
          <AdminInput value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} placeholder="City" aria-label="Filter by city" />
          <AdminInput type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} aria-label="Received from date" />
          <AdminInput type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} aria-label="Received to date" />
          <AdminSelect value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} aria-label="Sort deals">
            {SORTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} aria-label="Rows per page">
            {LIMITS.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </AdminSelect>
          <SecondaryButton type="button" onClick={clearFilters}>
            Clear
          </SecondaryButton>
        </div>
      </div>

      {error && items.length === 0 && <ErrorState title="Failed to load deals" body={error} onRetry={fetchItems} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No deals found"
          body="Converted leads will appear here automatically. Change a lead's status to Converted to create its deal workspace."
          action={
            <Link to="/admin/leads">
              <SecondaryButton type="button">Go to Leads</SecondaryButton>
            </Link>
          }
        />
      )}

      {(loading || items.length > 0) && (
        <>
          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {loading && items.length === 0
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                ))
              : items.map((deal) => (
              <div key={deal._id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-gray-900 dark:text-white">
                      {deal.leadSnapshot.title || deal.client.name || '(No title)'}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {[deal.client.name || null, deal.leadSnapshot.city || deal.client.city].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                  <StatusBadge label="Converted" tone="gray" />
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Received {formatDealDate(deal.projectReceivedDate)} · Updated {formatLeadDate(deal.updatedAt)}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {deal.requirements.length} requirements · {deal.reports.length} reports
                  </span>
                  <div className="flex gap-1">
                    <SecondaryButton type="button" onClick={() => setViewId(deal._id)}>
                      <Eye className="mr-1 h-4 w-4" /> View
                    </SecondaryButton>
                    <IconButton label="Delete" onClick={() => setDeleteId(deal._id)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
                ))}
          </div>

          {/* Desktop table */}
          <div className="relative hidden sm:block">
            <AdminTableShell fixed>
              <colgroup>
                <col style={{ width: '24%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '130px' }} />
              </colgroup>
              <TableHead>
                <Th>Business</Th>
                <Th>Client</Th>
                <Th>Mobile</Th>
                <Th>City</Th>
                <Th>Received</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </TableHead>
              {loading && items.length === 0 ? (
                <SkeletonRows rows={8} cols={7} />
              ) : (
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((deal) => {
                  const mobile = deal.client.mobileNumber1 || deal.leadSnapshot.phoneUnformatted || deal.leadSnapshot.phone;
                  return (
                  <tr key={deal._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-3 py-2.5">
                      <p className="truncate font-semibold text-gray-900 dark:text-white" title={deal.leadSnapshot.title}>
                        {deal.leadSnapshot.title || '(No title)'}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400" title={deal.leadSnapshot.categoryName}>
                        {deal.leadSnapshot.categoryName || '—'}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="block truncate text-gray-700 dark:text-gray-300" title={deal.client.name}>
                        {deal.client.name || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {mobile ? (
                        <a href={`tel:${mobile.replace(/\s/g, '')}`} className="block truncate text-primary-600 dark:text-primary-400" title={mobile}>
                          {mobile}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="block truncate text-gray-700 dark:text-gray-300" title={deal.leadSnapshot.city || deal.client.city}>
                        {deal.leadSnapshot.city || deal.client.city || '—'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-500 dark:text-gray-400">{formatDealDate(deal.projectReceivedDate)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <StatusBadge label="Converted" tone="gray" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <div className="flex gap-1">
                        <SecondaryButton type="button" onClick={() => setViewId(deal._id)}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </SecondaryButton>
                        <IconButton label="Delete" onClick={() => setDeleteId(deal._id)}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
              )}
            </AdminTableShell>
            {loading && items.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 dark:bg-gray-900/60" role="status" aria-label="Refreshing deals">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            )}
          </div>

          {items.length > 0 && totalPages > 1 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalItems)} of {totalItems.toLocaleString()} · Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <SecondaryButton type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </SecondaryButton>
                <SecondaryButton type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </SecondaryButton>
              </div>
            </div>
          )}
        </>
      )}

      {viewId && (
        <DealViewModal
          dealId={viewId}
          onClose={() => setViewId(null)}
          onDeleted={() => {
            setViewId(null);
            fetchItems();
          }}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete deal?"
        body="Delete this deal workspace? The source lead is kept."
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          setDeleting(true);
          try {
            const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deleteId}`, { method: 'DELETE' });
            const data = await res.json().catch(() => null);
            if (res.ok && data && data.success) {
              setFeedback({ type: 'success', message: 'Deal deleted successfully. The source lead was kept.' });
              if (items.length === 1 && page > 1) setPage(page - 1);
              else fetchItems();
            } else {
              setFeedback({ type: 'error', message: (data && data.message) || 'Unable to delete deal.' });
            }
          } catch {
            setFeedback({ type: 'error', message: 'Unable to delete deal.' });
          } finally {
            setDeleting(false);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
};

export default DealsPage;
