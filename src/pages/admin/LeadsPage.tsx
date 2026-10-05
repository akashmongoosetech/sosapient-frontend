import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, Upload, Phone, Globe, Users, Inbox, CheckCircle2, Copy, Check } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  LEAD_STATUSES,
  leadStatusTone,
  leadWebsiteUrl,
  formatLeadDate,
  type Lead,
  type LeadListResponse,
  type LeadStats,
  type LeadStatus,
} from '../../types/lead';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  AdminInput,
  AdminSelect,
  StatusBadge,
  StatCard,
  AdminTableShell,
  TableHead,
  Th,
  SkeletonRows,
  EmptyState,
  ErrorState,
  ConfirmDialog,
} from '../../components/admin/ui';

const LIMITS = [25, 50, 100, 200];

type ContactFilter = 'all' | 'mobile' | 'no-mobile' | 'website' | 'no-website' | 'both' | 'neither';

const CONTACT_OPTIONS: { value: ContactFilter; label: string }[] = [
  { value: 'all', label: 'All contacts' },
  { value: 'mobile', label: 'Has mobile' },
  { value: 'no-mobile', label: 'No mobile' },
  { value: 'website', label: 'Has website' },
  { value: 'no-website', label: 'No website' },
  { value: 'both', label: 'Mobile + site' },
  { value: 'neither', label: 'Neither' },
];

const SORTS = [
  { value: 'newest', label: 'Newest first', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'oldest', label: 'Oldest first', sortBy: 'createdAt', sortOrder: 'asc' },
  { value: 'az', label: 'Name A–Z', sortBy: 'title', sortOrder: 'asc' },
  { value: 'za', label: 'Name Z–A', sortBy: 'title', sortOrder: 'desc' },
  { value: 'city', label: 'City', sortBy: 'city', sortOrder: 'asc' },
  { value: 'status', label: 'Status', sortBy: 'status', sortOrder: 'asc' },
];

const STATUS_TEXT: Record<LeadStatus, string> = {
  New: 'text-blue-700 dark:text-blue-300',
  Message: 'text-purple-700 dark:text-purple-300',
  WhatsApp: 'text-green-700 dark:text-green-300',
  Call: 'text-yellow-700 dark:text-yellow-300',
  Converted: 'text-gray-700 dark:text-gray-300',
};

const LeadsPage: React.FC = () => {
  const [items, setItems] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [city, setCity] = useState('all');
  const [category, setCategory] = useState('all');
  const [contact, setContact] = useState<ContactFilter>('all');
  const [sort, setSort] = useState('newest');
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusBusy, setStatusBusy] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(t);
  }, [search]);

  const resetPage = () => setPage(1);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (status !== 'all') params.set('status', status);
    if (city !== 'all') params.set('city', city);
    if (category !== 'all') params.set('category', category);
    if (contact === 'mobile' || contact === 'both') params.set('hasMobile', 'true');
    if (contact === 'no-mobile' || contact === 'neither') params.set('hasMobile', 'false');
    if (contact === 'website' || contact === 'both') params.set('hasWebsite', 'true');
    if (contact === 'no-website' || contact === 'neither') params.set('hasWebsite', 'false');
    const s = SORTS.find((o) => o.value === sort) || SORTS[0];
    params.set('sortBy', s.sortBy);
    params.set('sortOrder', s.sortOrder);
    return params.toString();
  }, [page, limit, debouncedSearch, status, city, category, contact, sort]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads?${buildParams()}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data: LeadListResponse = await res.json();
      if (!data.success) throw new Error('Failed to load leads');
      setItems(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  const fetchMeta = useCallback(async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/filter-options`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCities(data.data.cities || []);
          setCategories(data.data.categories || []);
        }
      }
      const sres = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/stats`);
      if (sres.ok) {
        const sdata = await sres.json();
        if (sdata.success) setStats(sdata.data);
      }
    } catch {
      // meta is non-critical; table still works
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  const refreshAll = () => {
    fetchItems();
    fetchMeta();
  };

  const changeStatus = async (lead: Lead, next: LeadStatus) => {
    if (next === lead.status || statusBusy) return;
    setStatusBusy(lead._id);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${lead._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setItems((prev) => prev.map((p) => (p._id === lead._id ? data.data : p)));
        fetchMeta();
      }
    } catch {
      // keep old status on failure
    } finally {
      setStatusBusy(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${deleteId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        if (items.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          refreshAll();
        }
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const copyBtn = (text: string, key: string, label: string) => {
    const done = copiedKey === key;
    return (
      <button
        type="button"
        onClick={() => copyText(text, key)}
        title={done ? 'Copied!' : `Copy ${label}`}
        aria-label={done ? `${label} copied` : `Copy ${label}`}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
      >
        {done ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    );
  };

  const statusSelect = (lead: Lead) => (
    <select
      aria-label={`Change status for ${lead.title || 'lead'}`}
      value={lead.status}
      disabled={statusBusy === lead._id}
      onChange={(e) => changeStatus(lead, e.target.value as LeadStatus)}
      className={`min-h-[36px] w-[124px] truncate rounded-md border border-gray-200 bg-transparent px-1.5 py-1 text-xs font-bold dark:border-gray-700 ${STATUS_TEXT[lead.status]} disabled:opacity-50`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Manage your sales leads"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/leads/import">
              <SecondaryButton type="button">
                <Upload className="mr-1.5 h-4 w-4" /> Import JSON
              </SecondaryButton>
            </Link>
            <Link to="/admin/leads/new">
              <PrimaryButton type="button">
                <Plus className="mr-1.5 h-4 w-4" /> Add Lead
              </PrimaryButton>
            </Link>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" aria-live="polite">
        <StatCard label="Total Leads" value={stats ? stats.total.toLocaleString() : ''} loading={!stats} icon={<Users className="h-5 w-5" />} />
        <StatCard label="New" value={stats ? String(stats.byStatus.New || 0) : ''} loading={!stats} icon={<Inbox className="h-5 w-5" />} />
        <StatCard label="Converted" value={stats ? String(stats.byStatus.Converted || 0) : ''} loading={!stats} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="With Mobile" value={stats ? String(stats.withMobile) : ''} loading={!stats} icon={<Phone className="h-5 w-5" />} />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <AdminInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, city, category, phone, website…"
          aria-label="Search leads"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 [&>*]:min-w-0">
          <AdminSelect value={status} onChange={(e) => { setStatus(e.target.value); resetPage(); }} aria-label="Filter by status">
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={city} onChange={(e) => { setCity(e.target.value); resetPage(); }} aria-label="Filter by city">
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={category} onChange={(e) => { setCategory(e.target.value); resetPage(); }} aria-label="Filter by category">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={contact} onChange={(e) => { setContact(e.target.value as ContactFilter); resetPage(); }} aria-label="Filter by contact availability">
            {CONTACT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={sort} onChange={(e) => { setSort(e.target.value); resetPage(); }} aria-label="Sort leads">
            {SORTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); resetPage(); }} aria-label="Rows per page">
            {LIMITS.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </AdminSelect>
        </div>
      </div>

      {error && items.length === 0 && <ErrorState title="Failed to load leads" body={error} onRetry={refreshAll} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No leads found"
          body="Try changing your search or filters, import a JSON file, or create a new lead."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/admin/leads/import">
                <SecondaryButton type="button">Import JSON</SecondaryButton>
              </Link>
              <Link to="/admin/leads/new">
                <PrimaryButton type="button">Add Lead</PrimaryButton>
              </Link>
            </div>
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
              : items.map((lead) => (
              <div key={lead._id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900 dark:text-white">{lead.title || '(No title)'}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {[lead.categoryName, lead.city].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                  <StatusBadge label={lead.status} tone={leadStatusTone(lead.status)} />
                </div>
                <div className="mt-2 flex flex-col gap-1 text-sm">
                  {lead.phoneUnformatted || lead.phone ? (
                    <span className="flex items-center gap-1.5">
                      <a href={`tel:${(lead.phoneUnformatted || lead.phone).replace(/\s/g, '')}`} className="inline-flex min-w-0 items-center gap-1.5 truncate text-primary-600 dark:text-primary-400">
                        <Phone className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{lead.phoneUnformatted || lead.phone}</span>
                      </a>
                      {copyBtn(lead.phoneUnformatted || lead.phone, `${lead._id}-phone`, 'phone number')}
                    </span>
                  ) : null}
                  {lead.website ? (
                    <span className="flex items-center gap-1.5">
                      <a href={leadWebsiteUrl(lead.website)} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-1.5 truncate text-primary-600 dark:text-primary-400">
                        <Globe className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{lead.website}</span>
                      </a>
                      {copyBtn(lead.website, `${lead._id}-web`, 'website')}
                    </span>
                  ) : null}
                  <p className="text-xs text-gray-400 dark:text-gray-500">Added {formatLeadDate(lead.createdAt)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {statusSelect(lead)}
                  <div className="flex gap-1">
                    <Link to={`/admin/leads/${lead._id}`} aria-label={`View ${lead.title || 'lead'}`}>
                      <IconButton label="View"><Eye className="h-4 w-4" /></IconButton>
                    </Link>
                    <Link to={`/admin/leads/${lead._id}/edit`} aria-label={`Edit ${lead.title || 'lead'}`}>
                      <IconButton label="Edit"><Pencil className="h-4 w-4" /></IconButton>
                    </Link>
                    <IconButton label="Delete" onClick={() => setDeleteId(lead._id)}>
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
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '124px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '132px' }} />
                </colgroup>
                <TableHead>
                  <Th>Lead</Th>
                  <Th>City</Th>
                  <Th>Phone</Th>
                  <Th>Website</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </TableHead>
                {loading && items.length === 0 ? (
                  <SkeletonRows rows={8} cols={7} />
                ) : (
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-3 py-2.5">
                        <p className="truncate font-semibold text-gray-900 dark:text-white" title={lead.title}>
                          {lead.title || '(No title)'}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400" title={lead.categoryName}>
                          {lead.categoryName || '—'}
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="block truncate text-gray-700 dark:text-gray-300" title={lead.city}>
                          {lead.city || '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {lead.phoneUnformatted || lead.phone ? (
                          <span className="flex items-center gap-1">
                            <a
                              href={`tel:${(lead.phoneUnformatted || lead.phone).replace(/\s/g, '')}`}
                              className="block min-w-0 flex-1 truncate text-primary-600 dark:text-primary-400"
                              title={lead.phoneUnformatted || lead.phone}
                            >
                              {lead.phoneUnformatted || lead.phone}
                            </a>
                            {copyBtn(lead.phoneUnformatted || lead.phone, `${lead._id}-phone`, 'phone number')}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {lead.website ? (
                          <span className="flex items-center gap-1">
                            <a href={leadWebsiteUrl(lead.website)} target="_blank" rel="noopener noreferrer" className="block min-w-0 flex-1 truncate text-primary-600 dark:text-primary-400" title={lead.website}>
                              {lead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </a>
                            {copyBtn(lead.website, `${lead._id}-web`, 'website')}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">{statusSelect(lead)}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-gray-500 dark:text-gray-400">{formatLeadDate(lead.createdAt)}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <div className="flex gap-1">
                          <Link to={`/admin/leads/${lead._id}`} aria-label={`View ${lead.title || 'lead'}`}>
                            <IconButton label="View"><Eye className="h-4 w-4" /></IconButton>
                          </Link>
                          <Link to={`/admin/leads/${lead._id}/edit`} aria-label={`Edit ${lead.title || 'lead'}`}>
                            <IconButton label="Edit"><Pencil className="h-4 w-4" /></IconButton>
                          </Link>
                          <IconButton label="Delete" onClick={() => setDeleteId(lead._id)}>
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                )}
            </AdminTableShell>
            {loading && items.length > 0 && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 dark:bg-gray-900/60"
                role="status"
                aria-label="Refreshing leads"
              >
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

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete lead?"
        body={`Delete this lead? This action cannot be undone.`}
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default LeadsPage;
