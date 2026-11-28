import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { PageHeader, ContentCard, StatusBadge, SecondaryButton, ConfirmDialog, LoadingState, ErrorState } from '../../components/admin/ui';
import { Training } from '../../types/training';
import { authFetch } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const TrainingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchTraining = async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/${id}`);
        const data = await res.json();
        if (!cancelled) {
          if (data.success) setTraining(data.data);
          else setError(data.message || 'Training not found');
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load training');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTraining();
    return () => { cancelled = true; };
  }, [id]);

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');
      navigate('/admin/trainings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete training');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const statusTone = (s: string) => {
    switch (s) {
      case 'published': return 'green';
      case 'draft': return 'yellow';
      case 'inactive': return 'red';
      default: return 'gray';
    }
  };

  if (loading && !training) {
    return (
      <div>
        <PageHeader title="Training Details" subtitle="View training program" />
        <ContentCard className="p-4"><LoadingState message="Loading training…" /></ContentCard>
      </div>
    );
  }
  if (error || !training) {
    return (
      <div>
        <PageHeader title="Training Details" subtitle="View training program" />
        <ContentCard className="p-4">
          <ErrorState title="Unable to load training" body={error || 'Training not found'} onRetry={() => { setLoading(true); window.location.reload(); }} />
        </ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={training.title}
        subtitle={`Slug: ${training.slug}`}
        actions={
          <>
            <a
              href={`/admin/trainings/${id}/edit`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Pencil className="w-4 h-4" /> Edit
            </a>
            <a
              href={`/training/${training.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Eye className="w-4 h-4" /> View live
            </a>
            <a
              href="/admin/trainings"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" /> Back to list
            </a>
          </>
        }
      />

      <ContentCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            {training.featuredImage && (
              <div className="mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img src={resolveImageUrl(training.featuredImage)} alt={training.title} className="w-full h-48 object-cover" />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{training.title}</h2>
            <p className="text-sm text-gray-400 mb-4">/{training.slug}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-4">
              {training.shortDescription}
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{training.category}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{training.duration}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mode</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{training.trainingMode}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{training.level}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{training.paymentType === 'Paid' ? `₹${training.price}` : 'Free'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <StatusBadge label={training.status} tone={statusTone(training.status)} />
            </div>
          </div>
        </div>

        {(training.technologies || []).length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {(training.technologies as string[]).map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
          <SecondaryButton onClick={() => setDeleteId(training._id)} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </SecondaryButton>
        </div>
      </ContentCard>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete training?"
        body={`Are you sure you want to delete “${training.title}”? This cannot be undone.`}
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TrainingDetailPage;
