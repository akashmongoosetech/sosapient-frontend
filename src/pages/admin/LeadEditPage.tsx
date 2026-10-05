import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../../utils/api';
import LeadForm, { emptyLeadForm, type LeadFormValues } from '../../components/leads/LeadForm';
import { PageHeader, LoadingState, ErrorState } from '../../components/admin/ui';
import type { Lead } from '../../types/lead';

function toFormValues(doc: Lead): LeadFormValues {
  const base = emptyLeadForm();
  return {
    title: doc.title || base.title,
    categoryName: doc.categoryName || base.categoryName,
    address: doc.address || base.address,
    city: doc.city || base.city,
    website: doc.website || base.website,
    phone: doc.phone || base.phone,
    phoneUnformatted: doc.phoneUnformatted || base.phoneUnformatted,
    status: doc.status || base.status,
  };
}

const LeadEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<LeadFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${encodeURIComponent(id || '')}`);
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setInitial(toFormValues(data.data));
        } else {
          setLoadError(data.message || 'Lead not found.');
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load lead.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (values: LeadFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${encodeURIComponent(id || '')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        navigate(`/admin/leads/${data.data._id}`, { replace: true });
      } else {
        setServerError(data.message || 'Failed to update lead.');
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to update lead.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Loading lead…" />;
  if (loadError || !initial) {
    return (
      <div>
        <PageHeader title="Edit Lead" subtitle="Could not load this lead" />
        <ErrorState title="Could not load lead" body={loadError || 'Lead not found.'} onRetry={() => navigate('/admin/leads')} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Lead" subtitle={initial.title || 'Update lead details'} />
      <LeadForm
        initial={initial}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Save Changes"
        requireIdentity={false}
        onCancel={() => navigate(`/admin/leads/${id}`)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default LeadEditPage;
