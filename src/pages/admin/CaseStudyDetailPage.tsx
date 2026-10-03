import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { authFetch } from '../../utils/api';
import BlogRichContent from '../../components/Blog/BlogRichContent';
import {
  ContentCard, PageHeader, SecondaryButton, DangerButton,
  StatusBadge, LoadingState, ErrorState, ConfirmDialog
} from '../../components/admin/ui';
import { CaseStudy, caseStudyIcon } from '../../types/caseStudy';

const CaseStudyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDoc = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/${id}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setDoc(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Case study not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case study');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  const confirmDelete = async () => {
    if (!doc) return;
    try {
      setDeleting(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/${doc._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');
      navigate('/admin/case-studies', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete case study');
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Case study" subtitle="View details" />
        <ContentCard><LoadingState message="Loading case study…" /></ContentCard>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div>
        <PageHeader title="Case study" subtitle="View details" />
        <ContentCard>
          <ErrorState
            title="Unable to load case study"
            body={error || 'Case study not found.'}
            onRetry={fetchDoc}
          />
          <div className="flex justify-center pb-6">
            <Link to="/admin/case-studies" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Link>
          </div>
        </ContentCard>
      </div>
    );
  }

  const Icon = caseStudyIcon(doc.icon);

  return (
    <div>
      <PageHeader
        title={doc.title}
        subtitle={`${doc.client} · ${doc.category}`}
        actions={
          <>
            <Link
              to={`/admin/case-studies/${doc._id}/edit`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <DangerButton onClick={() => setConfirming(true)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DangerButton>
          </>
        }
      />

      <ContentCard className="overflow-hidden">
        <div className="relative">
          <img
            src={doc.thumbnailImageUrl}
            alt={doc.title}
            className="max-h-80 w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="absolute left-4 top-4">
            <StatusBadge label={doc.published ? 'Published' : 'Draft'} tone={doc.published ? 'green' : 'gray'} />
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2">
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r ${doc.color} text-white`}>
                <Icon className="h-4 w-4" />
              </span>
              {doc.category}
            </span>
            <span>Duration: {doc.duration}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '—'}
            </span>
            <span className="font-mono text-xs">/{doc.slug}</span>
          </div>

          <div className="mt-6 space-y-6">
            <section>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Overview</h2>
              <div className="mt-2"><BlogRichContent html={doc.overview} label="Case study overview" /></div>
            </section>
            {doc.challenge && (
              <section>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Challenge</h2>
                <div className="mt-2"><BlogRichContent html={doc.challenge} label="Case study challenge" /></div>
              </section>
            )}
            {doc.solution && (
              <section>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Solution</h2>
                <div className="mt-2"><BlogRichContent html={doc.solution} label="Case study solution" /></div>
              </section>
            )}
          </div>

          {doc.results.length > 0 && (
            <section className="mt-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Results</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {doc.results.map((r, i) => {
                  const RIcon = caseStudyIcon(r.icon);
                  return (
                    <div key={i} className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700">
                      <RIcon className="mx-auto h-6 w-6 text-primary-600" />
                      <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{r.value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{r.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {doc.technologies.length > 0 && (
            <section className="mt-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Technologies</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {doc.technologies.map((t) => (
                  <span key={t} className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-800/30 dark:text-primary-300">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">SEO settings</h2>
            <dl className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div><dt className="inline font-medium">Meta title: </dt><dd className="inline">{doc.seo?.metaTitle || '—'}</dd></div>
              <div><dt className="inline font-medium">Meta description: </dt><dd className="inline">{doc.seo?.metaDescription || '—'}</dd></div>
              <div><dt className="inline font-medium">Keywords: </dt><dd className="inline">{(doc.seo?.keywords || []).join(', ') || '—'}</dd></div>
            </dl>
          </section>

          <div className="mt-6 flex justify-start">
            <SecondaryButton onClick={() => navigate('/admin/case-studies')}>
              <span className="inline-flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to list</span>
            </SecondaryButton>
          </div>
        </div>
      </ContentCard>

      <ConfirmDialog
        open={confirming}
        title="Delete case study?"
        body={`Are you sure you want to delete “${doc.title}”?`}
        busy={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CaseStudyDetailPage;
