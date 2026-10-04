import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/api';
import { PageHeader, ContentCard, LoadingState, ErrorState } from '../../components/admin/ui';
import CertificateForm, {
  toFormValues, CertificateFormValues
} from '../../components/certificates/CertificateForm';

const CertificateEditPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<CertificateFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const fetchDoc = useCallback(async () => {
    if (!certificateId) return;
    try {
      setLoading(true);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${encodeURIComponent(certificateId)}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setInitial(toFormValues(data.data));
        setError(null);
      } else {
        throw new Error(data.message || 'Certificate not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  const handleSubmit = async (values: CertificateFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/certificates/${encodeURIComponent(certificateId || '')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/admin/certificates/${encodeURIComponent(certificateId || '')}`, { replace: true });
      } else {
        setServerError(data.message || 'Failed to update certificate.');
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
        <PageHeader title="Edit certificate" subtitle="Update certificate details" />
        <ContentCard><LoadingState message="Loading certificate…" /></ContentCard>
      </div>
    );
  }

  if (error || !initial) {
    return (
      <div>
        <PageHeader title="Edit certificate" subtitle="Update certificate details" />
        <ContentCard><ErrorState title="Unable to load certificate" body={error || 'Certificate not found.'} onRetry={fetchDoc} /></ContentCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`Edit certificate ${certificateId}`} subtitle="Update certificate details" />
      <CertificateForm
        initial={initial}
        submitting={submitting}
        submitLabel="Save changes"
        serverError={serverError}
        previewIdLabel={certificateId || ''}
        onCancel={() => navigate(`/admin/certificates/${encodeURIComponent(certificateId || '')}`)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CertificateEditPage;
