import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/api';
import { PageHeader, ContentCard, LoadingState } from '../../components/admin/ui';
import CaseStudyForm, {
  emptyFormValues, CaseStudySubmitPayload
} from './CaseStudyForm';

const CaseStudyNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/categories`);
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        if (Array.isArray(data.data)) setCategories(data.data);
      } catch {
        // suggestions fall back to built-in list
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (payload: CaseStudySubmitPayload) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data?._id) {
        navigate(`/admin/case-studies/${data.data._id}`, { replace: true });
      } else {
        setServerError(data.message || 'Failed to create case study.');
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="New case study" subtitle="Create a client success story" />
        <ContentCard><LoadingState message="Preparing form…" /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="New case study" subtitle="Create a client success story" />
      <CaseStudyForm
        initial={emptyFormValues()}
        categories={categories}
        submitting={submitting}
        submitLabel="Create case study"
        serverError={serverError}
        onCancel={() => navigate('/admin/case-studies')}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CaseStudyNewPage;
