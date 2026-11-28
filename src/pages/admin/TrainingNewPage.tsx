import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, ContentCard } from '../../components/admin/ui';
import { TrainingForm } from '../../components/training/TrainingForm';
import { authFetch } from '../../utils/api';

const TrainingNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

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
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/trainings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to create training');
      navigate(`/admin/trainings/${data.data._id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create training');
    } finally {
      setBusy(false);
    }
  }, [navigate]);

  return (
    <div>
      <PageHeader
        title="New Training"
        subtitle="Create a new training program"
        actions={
          <a
            href="/admin/trainings"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Back to list
          </a>
        }
      />
      <ContentCard className="p-0">
        <TrainingForm onSave={handleSave} busy={busy} />
      </ContentCard>
    </div>
  );
};

export default TrainingNewPage;
