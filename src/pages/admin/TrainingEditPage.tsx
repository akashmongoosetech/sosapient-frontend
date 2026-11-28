import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, ContentCard } from '../../components/admin/ui';
import { TrainingForm } from '../../components/training/TrainingForm';
import { Training } from '../../types/training';
import { authFetch } from '../../utils/api';

const TrainingEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = useCallback(async (values: any) => {
    setBusy(true);
    try {
      const payload = {
        title: values.title,
        slug: values.slug || undefined,
        shortDescription: values.shortDescription,
        description: values.description,
        featuredImage: values.featuredImage || undefined,
        category: values.category,
        duration: values.duration,
        trainingMode: values.trainingMode,
        level: values.level,
        technologies: values.technologiesCsv.split(',').map((s: string) => s.trim()).filter(Boolean),
        paymentType: values.paymentType,
        amount: values.paymentType === 'Paid' ? Number(values.amount) : 0,
        price: values.paymentType === 'Paid' ? Number(values.amount) : 0,
        currency: values.currency || 'INR',
        isFree: values.paymentType === 'Free',
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        curriculum: (values.curriculum || [])
          .filter((m: any) => m.title.trim())
          .map((m: any) => ({ title: m.title.trim(), description: m.description.trim(), hours: Number(m.hours) || 0 })),
        faqs: (values.faqs || [])
          .filter((f: any) => f.question.trim() && f.answer.trim())
          .map((f: any) => ({ question: f.question.trim(), answer: f.answer.trim() })),
        prerequisites: values.prerequisitesCsv.split(',').map((s: string) => s.trim()).filter(Boolean),
        targetAudience: values.targetAudienceCsv.split(',').map((s: string) => s.trim()).filter(Boolean),
        learningOutcomes: values.learningOutcomesCsv.split(',').map((s: string) => s.trim()).filter(Boolean),
        status: values.status,
        isFeatured: values.isFeatured,
        displayOrder: Number(values.displayOrder),
        trainer: {
          name: values.trainerName,
          designation: values.trainerDesignation,
          image: values.trainerImage || undefined,
          bio: values.trainerBio
        },
        certification: {
          provided: values.certProvided,
          name: values.certName,
          description: values.certDescription
        },
        seo: {
          metaTitle: values.seoTitle,
          metaDescription: values.seoDescription,
          metaKeywords: values.seoKeywords
        }
      };
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update training');
      navigate(`/admin/trainings/${id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update training');
    } finally {
      setBusy(false);
    }
  }, [id, navigate]);

  if (loading && !training) {
    return (
      <div>
        <PageHeader title="Edit Training" subtitle="Update training program" />
        <ContentCard className="p-4"><div className="py-16 text-center text-gray-500 dark:text-gray-400">Loading…</div></ContentCard>
      </div>
    );
  }
  if (error || !training) {
    return (
      <div>
        <PageHeader title="Edit Training" subtitle="Update training program" />
        <ContentCard className="p-4">
          <div className="py-16 text-center text-red-600 dark:text-red-400">{error || 'Training not found'}</div>
          <div className="text-center mt-4">
            <a href="/admin/trainings" className="text-primary-600 hover:underline">Back to list</a>
          </div>
        </ContentCard>
      </div>
    );
  }

  const initialValues = {
    title: training.title,
    slug: training.slug,
    slugCustomized: true,
    shortDescription: training.shortDescription,
    description: training.description,
    featuredImage: training.featuredImage || '',
    category: training.category,
    duration: training.duration,
    trainingMode: training.trainingMode,
    level: training.level,
    technologiesCsv: (training.technologies || []).join(', '),
    paymentType: training.paymentType || (training.isFree ? 'Free' : 'Paid'),
    amount: String(training.amount ?? training.price ?? 0),
    currency: training.currency || 'INR',
    startDate: training.startDate ? String(training.startDate).slice(0, 10) : '',
    endDate: training.endDate ? String(training.endDate).slice(0, 10) : '',
    curriculum: (training.curriculum || []).map((m) => ({
      title: m.title || '',
      description: m.description || '',
      hours: String(m.hours ?? 0)
    })),
    faqs: (training.faqs || []).map((f) => ({ question: f.question || '', answer: f.answer || '' })),
    prerequisitesCsv: (training.prerequisites || []).join(', '),
    targetAudienceCsv: (training.targetAudience || []).join(', '),
    learningOutcomesCsv: (training.learningOutcomes || []).join(', '),
    status: training.status,
    isFeatured: training.isFeatured,
    displayOrder: String(training.displayOrder),
    trainerName: training.trainer?.name || '',
    trainerDesignation: training.trainer?.designation || '',
    trainerImage: training.trainer?.image || '',
    trainerBio: training.trainer?.bio || '',
    certProvided: training.certification?.provided || false,
    certName: training.certification?.name || '',
    certDescription: training.certification?.description || '',
    seoTitle: training.seo?.metaTitle || '',
    seoDescription: training.seo?.metaDescription || '',
    seoKeywords: training.seo?.metaKeywords || ''
  };

  return (
    <div>
      <PageHeader
        title="Edit Training"
        subtitle="Update training program"
        actions={
          <>
            <a
              href={`/admin/trainings/${id}`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              View
            </a>
            <a
              href="/admin/trainings"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Back to list
            </a>
          </>
        }
      />
      <ContentCard className="p-0">
        <TrainingForm onSave={handleSave} initialValues={initialValues} busy={busy} />
      </ContentCard>
    </div>
  );
};

export default TrainingEditPage;
