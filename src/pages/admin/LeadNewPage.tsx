import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/api';
import LeadForm, { emptyLeadForm, type LeadFormValues } from '../../components/leads/LeadForm';
import { PageHeader } from '../../components/admin/ui';

const LeadNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (values: LeadFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads`, {
        method: 'POST',
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
        setServerError(data.message || 'Failed to create lead.');
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to create lead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Lead" subtitle="Create a new sales lead manually" />
      <LeadForm
        initial={emptyLeadForm()}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Create Lead"
        requireIdentity
        onCancel={() => navigate('/admin/leads')}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default LeadNewPage;
