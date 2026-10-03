import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/api';
import { PageHeader, ContentCard, LoadingState, ErrorState } from '../../components/admin/ui';
import CaseStudyForm, {
  emptyFormValues, toFormValues, CaseStudyFormValues, CaseStudySubmitPayload
} from './CaseStudyForm';

const CaseStudyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<CaseStudyFormValues | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [docRes, catRes] = await Promise.all([
        authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/${id}`),
        authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/categories`)
      ]);
      if (docRes.status === 401 || catRes.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await docRes.json();
      if (data.success) {
        const merged = { ...emptyFormValues(), ...toFormValues(data.data) };
        setInitial(merged);
        setError(null);
      } else {
        throw new Error(data.message || 'Case study not found');
      }
      try {
        const cats = await catRes.json();
        if (Array.isArray(cats.data)) setCategories(cats.data);
      } catch {
        // suggestions fall back to built-in list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case study');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSubmit = async (payload: CaseStudySubmitPayload) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/admin/case-studies/${id}`, { replace: true });
      } else {
        setServerError(data.message || 'Failed to update case study.');
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
        <PageHeader title="Edit case study" subtitle="Update the client success story" />
        <ContentCard><LoadingState message="Loading case study…" /></ContentCard>
      </div>
    );
  }

  if (error || !initial) {
    return (
      <div>
        <PageHeader title="Edit case study" subtitle="Update the client success story" />
        <ContentCard><ErrorState title="Unable to load case study" body={error || 'Case study not found.'} onRetry={fetchAll} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit case study" subtitle={initial.title} />
      <CaseStudyForm
        initial={initial}
        categories={categories}
        submitting={submitting}
        submitLabel="Save changes"
        serverError={serverError}
        onCancel={() => navigate(`/admin/case-studies/${id}`)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CaseStudyEditPage;
