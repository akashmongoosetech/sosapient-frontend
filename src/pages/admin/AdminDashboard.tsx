import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Contact, Briefcase, Users, FileText, ClipboardList, Plus, ArrowRight, Eye } from 'lucide-react';
import { authFetch } from '../../utils/api';
import { ContentCard, StatCard, EmptyState, ErrorState } from '../../components/admin/ui';

interface CountResult {
  items: unknown[];
  total: number | null;
  failed: boolean;
}

async function fetchPaged(path: string, limit = 100, maxPages = 5): Promise<CountResult> {
  const items: unknown[] = [];
  try {
    for (let page = 1; page <= maxPages; page++) {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}${path}?limit=${limit}&page=${page}`);
      if (!res.ok) return { items, total: null, failed: true };
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data.data || []);
      items.push(...arr);
      if (arr.length < limit) return { items, total: items.length, failed: false };
    }
    return { items, total: null, failed: false };
  } catch {
    return { items, total: null, failed: true };
  }
}

function fmtTotal(r: CountResult): string {
  if (r.failed) return '—';
  if (r.total === null) return `${r.items.length}+`;
  return String(r.total);
}

function fmtSub(r: CountResult): string {
  if (r.failed) return 'Failed to load';
  if (r.total === null) return `Showing recent ${r.items.length} (more exist)`;
  return r.total === 1 ? '1 record total' : `${r.total} records total`;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [contacts, setContacts] = useState<CountResult>({ items: [], total: 0, failed: false });
  const [careers, setCareers] = useState<CountResult>({ items: [], total: 0, failed: false });
  const [subs, setSubs] = useState<CountResult>({ items: [], total: 0, failed: false });
  const [blogStats, setBlogStats] = useState<{ totalBlogs: number; totalViews: number; categoryStats: { _id: string; count: number }[] } | null>(null);
  const [blogFailed, setBlogFailed] = useState(false);
  const [jobs, setJobs] = useState<{ title: string; status: string; createdAt?: string }[]>([]);
  const [jobsFailed, setJobsFailed] = useState(false);
  const [recentBlogs, setRecentBlogs] = useState<{ _id?: string; title: string; status: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const [c, a, s] = await Promise.all([
        fetchPaged('/api/contact'),
        fetchPaged('/api/career'),
        fetchPaged('/api/subscribers')
      ]);
      setContacts(c);
      setCareers(a);
      setSubs(s);

      try {
        const bs = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/blogs/stats`);
        if (!bs.ok) throw new Error();
        const bd = await bs.json();
        setBlogStats(bd.data);
        setBlogFailed(false);
      } catch {
        setBlogStats(null);
        setBlogFailed(true);
      }

      try {
        const jr = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/jobs?limit=100`);
        if (!jr.ok) throw new Error();
        const jd = await jr.json();
        setJobs(Array.isArray(jd.data) ? jd.data : []);
        setJobsFailed(false);
      } catch {
        setJobs([]);
        setJobsFailed(true);
      }

      try {
        const br = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/blogs/admin?limit=5`);
        if (br.ok) {
          const bdata = await br.json();
          setRecentBlogs(Array.isArray(bdata.data) ? bdata.data : []);
        }
      } catch {
        // recent blogs optional
      }

      if (c.failed && a.failed && s.failed) setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!loading && failed && !blogStats && jobs.length === 0) {
    return <ErrorState title="Unable to load dashboard" body="Something went wrong while fetching admin data." onRetry={load} />;
  }

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;
  const published = blogStats?.totalBlogs ?? 0;

  const recentContacts = (contacts.items as { _id: string; name: string; subject: string; createdAt: string }[]).slice(0, 5);
  const recentCareers = (careers.items as { _id: string; name: string; position: string; createdAt: string }[]).slice(0, 5);
  const recentSubs = (subs.items as { _id: string; email: string; subscribedAt: string }[]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Contacts" value={fmtTotal(contacts)} sub={fmtSub(contacts)} loading={loading} icon={<Contact className="h-5 w-5" />} />
        <StatCard label="Career Applications" value={fmtTotal(careers)} sub={fmtSub(careers)} loading={loading} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard label="Subscribers" value={fmtTotal(subs)} sub={fmtSub(subs)} loading={loading} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Published Blogs" value={loading ? '' : blogFailed ? '—' : String(published)} sub={blogFailed ? 'Failed to load' : `${blogStats?.totalViews ?? 0} total views`} loading={loading} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Open Jobs" value={loading ? '' : jobsFailed ? '—' : String(openJobs)} sub={jobsFailed ? 'Failed to load' : `${closedJobs} closed`} loading={loading} icon={<ClipboardList className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ContentCard className="p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Link to="/admin/blog-admin?new=1" className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
              <Plus className="h-4 w-4" /> New blog post
            </Link>
            <Link to="/admin/job-admin" className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
              <Plus className="h-4 w-4" /> New job
            </Link>
            <Link to="/admin/contact-table" className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
              View contacts <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/admin/career-table" className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
              View applications <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {(blogStats?.categoryStats?.length ?? 0) > 0 && (
            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Posts by category</h3>
              <ul className="mt-2 space-y-1.5">
                {blogStats!.categoryStats.map((c) => (
                  <li key={c._id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{c._id}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ContentCard>

        <ContentCard className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent contacts</h2>
            <Link to="/admin/contact-table" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
              <Eye className="h-4 w-4" /> All
            </Link>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}</div>
          ) : recentContacts.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">No contact submissions yet.</div>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
              {recentContacts.map((c) => (
                <li key={c._id} className="py-2.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{c.subject} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent subscribers</h2>
              <Link to="/admin/subscriber-table" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
                <Eye className="h-4 w-4" /> All
              </Link>
            </div>
            {loading ? (
              <div className="mt-4 space-y-2">{[0, 1].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}</div>
            ) : recentSubs.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">No subscribers yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                {recentSubs.map((s) => (
                  <li key={s._id} className="py-2 text-sm text-gray-700 dark:text-gray-300">
                    {s.email}
                    <span className="block text-xs text-gray-400">{s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ContentCard>

        <ContentCard className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent applications</h2>
            <Link to="/admin/career-table" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
              <Eye className="h-4 w-4" /> All
            </Link>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}</div>
          ) : recentCareers.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">No applications yet.</div>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
              {recentCareers.map((a) => (
                <li key={a._id} className="py-2.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{a.position} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent posts</h2>
              <Link to="/admin/blog-admin" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
                <Eye className="h-4 w-4" /> All
              </Link>
            </div>
            {recentBlogs.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">No posts yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                {recentBlogs.map((b, i) => (
                  <li key={b._id || i} className="py-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{b.title}</span>
                    <span className="ml-2 text-xs text-gray-400">· {b.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ContentCard>
      </div>

      {(contacts.failed || careers.failed || subs.failed) && (
        <EmptyState
          title="Some sections failed to load"
          body="One or more data sources could not be reached. The numbers above show what loaded successfully."
          action={<button onClick={load} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 min-h-[40px]">Retry</button>}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
