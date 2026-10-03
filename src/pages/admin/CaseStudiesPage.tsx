import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, Search, RefreshCw } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  ContentCard, PageHeader, SecondaryButton,
  AdminInput, AdminSelect, AdminTableShell, TableHead, Th,
  StatusBadge, LoadingState, EmptyState, ErrorState, ConfirmDialog
} from '../../components/admin/ui';
import { CaseStudy, CaseStudyListResponse } from '../../types/caseStudy';
import { caseStudyIcon } from '../../types/caseStudy';

const LIMIT = 20;

const CaseStudiesPage: React.FC = () => {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [published, setPublished] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) setCategories(data.data);
      }
    } catch {
      // filter simply stays unpopulated
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
      if (category !== 'all') params.set('category', category);
      if (published !== 'all') params.set('published', published);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data: CaseStudyListResponse = await res.json();
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
        setError(null);
      } else {
        throw new Error((data as unknown as { message?: string }).message || 'Failed to load case studies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case studies');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, published]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const togglePublished = async (item: CaseStudy) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published })
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.map((p) => (p._id === item._id ? { ...p, published: !item.published } : p)));
      }
    } catch {
      // silent; row keeps old state
    }
  };

  const confirmDelete = async () => {
    const target = items.find((i) => i._id === deleteId);
    if (!target) {
      setDeleteId(null);
      return;
    }
    try {
      setDeleting(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/${target._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');
      const remaining = items.filter((i) => i._id !== target._id);
      if (remaining.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        setItems(remaining);
        setTotalItems((t) => Math.max(0, t - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete case study');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div>
        <PageHeader title="Case Studies" subtitle="Manage client success stories" />
        <ContentCard><LoadingState message="Loading case studies…" /></ContentCard>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div>
        <PageHeader title="Case Studies" subtitle="Manage client success stories" />
        <ContentCard><ErrorState title="Unable to load case studies" body={error} onRetry={fetchItems} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Case Studies"
        subtitle="Manage client success stories"
        actions={
          <>
            <SecondaryButton onClick={() => { fetchItems(); fetchCategories(); }} aria-label="Refresh case studies">
              <RefreshCw className="h-4 w-4" /> Refresh
            </SecondaryButton>
            <Link
              to="/admin/case-studies/new"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" /> New case study
            </Link>
          </>
        }
      />

      <ContentCard>
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 lg:flex-row">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <AdminInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, client, category…" aria-label="Search case studies" className="pl-9" />
          </div>
          <AdminSelect value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Filter by category" className="lg:w-52">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </AdminSelect>
          <AdminSelect value={published} onChange={(e) => { setPublished(e.target.value as typeof published); setPage(1); }} aria-label="Filter by publish state" className="lg:w-44">
            <option value="all">All states</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </AdminSelect>
          {(search || category !== 'all' || published !== 'all') && (
            <SecondaryButton onClick={() => { setSearch(''); setCategory('all'); setPublished('all'); setPage(1); }}>
              Clear filters
            </SecondaryButton>
          )}
        </div>

        <div className="space-y-3 p-4 sm:hidden">
          {items.map((item) => {
            const Icon = caseStudyIcon(item.icon);
            return (
              <div key={item._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="truncate text-sm text-gray-500">{item.client} · {item.category}</p>
                  </div>
                  <StatusBadge label={item.published ? 'Published' : 'Draft'} tone={item.published ? 'green' : 'gray'} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                  <button onClick={() => togglePublished(item)} className="text-xs font-semibold text-primary-600 hover:underline">
                    {item.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <div className="flex gap-1">
                    <Link to={`/admin/case-studies/${item._id}`} aria-label={`View ${item.title}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link to={`/admin/case-studies/${item._id}/edit`} aria-label={`Edit ${item.title}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setDeleteId(item._id)} aria-label={`Delete ${item.title}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <EmptyState
              title="No case studies found"
              body={search || category !== 'all' || published !== 'all' ? 'No case studies match your filters.' : 'Create your first case study to get started.'}
              action={<Link to="/admin/case-studies/new" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 min-h-[40px] inline-flex items-center">New case study</Link>}
            />
          )}
        </div>

        <div className="hidden sm:block">
          <AdminTableShell>
            <TableHead>
              <Th>Case study</Th>
              <Th>Client</Th>
              <Th>Category</Th>
              <Th>Duration</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th className="text-right">Actions</Th>
            </TableHead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnailImageUrl} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <Link to={`/admin/case-studies/${item._id}`} className="block max-w-[240px] truncate text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-white">
                          {item.title}
                        </Link>
                        <span className="text-xs text-gray-400">/{item.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.client}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.category}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.duration}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublished(item)} title={item.published ? 'Unpublish' : 'Publish'}>
                      <StatusBadge label={item.published ? 'Published' : 'Draft'} tone={item.published ? 'green' : 'gray'} />
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/case-studies/${item._id}`} aria-label={`View ${item.title}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/admin/case-studies/${item._id}/edit`} aria-label={`Edit ${item.title}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setDeleteId(item._id)} aria-label={`Delete ${item.title}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableShell>
          {items.length === 0 && (
            <EmptyState
              title="No case studies found"
              body={search || category !== 'all' || published !== 'all' ? 'No case studies match your filters.' : 'Create your first case study to get started.'}
              action={<Link to="/admin/case-studies/new" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 min-h-[40px] inline-flex items-center">New case study</Link>}
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

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete case study?"
        body={`Are you sure you want to delete “${items.find((i) => i._id === deleteId)?.title || 'this case study'}”?`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CaseStudiesPage;
