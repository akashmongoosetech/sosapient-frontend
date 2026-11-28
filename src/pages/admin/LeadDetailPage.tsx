import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Pencil,
  Trash2,
  Phone,
  Globe,
  MessageCircle,
  Copy,
  Check,
  Building2,
  MapPin,
  Clock,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  LEAD_STATUSES,
  leadStatusTone,
  leadDigits,
  leadWebsiteUrl,
  formatLeadDate,
  type Lead,
  type LeadStatus,
} from '../../types/lead';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  AdminSelect,
  StatusBadge,
  ContentCard,
  LoadingState,
  ErrorState,
  ConfirmDialog,
} from '../../components/admin/ui';

function Row({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-gray-200/70 bg-gray-50/80 p-3.5 sm:p-4 dark:border-gray-800 dark:bg-gray-800/40 ${className}`}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-medium text-gray-900 dark:text-white">{children}</dd>
    </div>
  );
}

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<'phone' | 'web' | null>(null);

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
          setDoc(data.data);
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

  const [convertMsg, setConvertMsg] = useState<{ type: 'success' | 'error'; text: string; dealId?: string } | null>(null);
  const [linkedDealId, setLinkedDealId] = useState<string | null>(null);

  // For already-converted leads, resolve the linked deal for a View link.
  useEffect(() => {
    if (!doc || doc.status !== 'Converted') {
      setLinkedDealId(null);
      return;
    }
    let live = true;
    (async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/by-lead/${doc._id}`);
        const data = await res.json().catch(() => null);
        if (live && res.ok && data && data.success && data.data) {
          setLinkedDealId(data.data._id);
        }
      } catch {
        // link simply stays hidden
      }
    })();
    return () => {
      live = false;
    };
  }, [doc]);

  const changeStatus = async (next: LeadStatus) => {
    if (!doc || next === doc.status || statusBusy) return;
    setStatusBusy(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${doc._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDoc(data.data);
        if (next === 'Converted') {
          if (data.deal && data.deal._id) {
            setConvertMsg({ type: 'success', text: 'Lead converted successfully. Deal created.', dealId: data.deal._id });
          } else {
            setConvertMsg({
              type: 'error',
              text: (data.dealError as string) || 'Lead converted, but the deal could not be created. Please retry conversion.',
            });
          }
        }
      }
    } finally {
      setStatusBusy(false);
    }
  };

  const retryConvert = async () => {
    if (!doc || statusBusy) return;
    setStatusBusy(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${doc._id}/convert`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success && data.deal) {
        setConvertMsg({ type: 'success', text: 'Deal created successfully.', dealId: data.deal._id });
      } else {
        setConvertMsg({ type: 'error', text: (data && data.message) || 'Deal could not be created. Please try again.' });
      }
    } finally {
      setStatusBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!doc) return;
    setDeleting(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/${doc._id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        navigate('/admin/leads', { replace: true });
      }
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const copyPhone = async () => {
    if (!doc) return;
    try {
      await navigator.clipboard.writeText(doc.phoneUnformatted || doc.phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const copyText = async (text: string, field: 'phone' | 'web') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 1500);
    } catch {
      // clipboard unavailable
    }
  };

  if (loading) return <LoadingState message="Loading lead…" />;
  if (loadError || !doc) {
    return (
      <div className="space-y-4">
        <PageHeader title="Lead Details" subtitle="Could not load this lead" />
        <ErrorState title="Could not load lead" body={loadError || 'Lead not found.'} onRetry={() => navigate('/admin/leads')} />
      </div>
    );
  }

  const digits = leadDigits(doc);
  const waUrl = digits ? `https://wa.me/${digits}` : null;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Page Header */}
      <div className="space-y-3">
        <Link
          to="/admin/leads"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Leads
        </Link>

        <PageHeader
          title={doc.title || '(No title)'}
          subtitle={`Lead details · ${doc.status}`}
          actions={
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="w-full sm:w-auto">
                <AdminSelect
                  aria-label="Change lead status"
                  value={doc.status}
                  disabled={statusBusy}
                  onChange={(e) => changeStatus(e.target.value as LeadStatus)}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </AdminSelect>
              </div>
              <Link to={`/admin/leads/${doc._id}/edit`} className="flex-1 sm:flex-initial">
                <PrimaryButton type="button" className="w-full justify-center sm:w-auto">
                  <Pencil className="mr-1.5 h-4 w-4" /> Edit
                </PrimaryButton>
              </Link>
              <DangerButton
                type="button"
                onClick={() => setConfirming(true)}
                className="flex-1 justify-center sm:flex-initial sm:w-auto"
              >
                <Trash2 className="mr-1.5 h-4 w-4" /> Delete
              </DangerButton>
            </div>
          }
        />
      </div>

      {/* Conversion Alert Banner */}
      {convertMsg && (
        <div
          role={convertMsg.type === 'error' ? 'alert' : 'status'}
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium shadow-xs ${
            convertMsg.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          <span className="flex-1">{convertMsg.text}</span>
          {convertMsg.type === 'success' && convertMsg.dealId && (
            <Link
              to={`/admin/deals?open=${convertMsg.dealId}`}
              className="inline-flex items-center gap-1 font-bold underline hover:no-underline shrink-0"
            >
              View Deal →
            </Link>
          )}
          {convertMsg.type === 'error' && (
            <SecondaryButton type="button" onClick={retryConvert} disabled={statusBusy} className="w-full sm:w-auto justify-center">
              Retry Conversion
            </SecondaryButton>
          )}
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / Primary Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Business & Location Card */}
          <ContentCard className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary-50 p-1.5 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    Lead Overview
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={doc.status} tone={leadStatusTone(doc.status)} />
                {doc.categoryName && (
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {doc.categoryName}
                  </span>
                )}
                {linkedDealId && (
                  <Link
                    to={`/admin/deals?open=${linkedDealId}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
                  >
                    View Deal →
                  </Link>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Row label="Business / Lead Title" className="sm:col-span-2">
                <span className="text-base font-semibold">{doc.title || '—'}</span>
              </Row>

              <Row label="Category">{doc.categoryName || '—'}</Row>

              <Row label="City">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  <span>{doc.city || '—'}</span>
                </span>
              </Row>

              <Row label="Address" className="sm:col-span-2">
                {doc.address || '—'}
              </Row>
            </dl>
          </ContentCard>

          {/* Contact & Digital Presence Card */}
          <ContentCard className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="rounded-lg bg-primary-50 p-1.5 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Contact &amp; Web
              </h2>
            </div>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Row label="Phone" className="sm:col-span-2">
                {doc.phoneUnformatted || doc.phone ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${(doc.phoneUnformatted || doc.phone).replace(/\s/g, '')}`}
                      className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {doc.phoneUnformatted || doc.phone}
                    </a>
                    <button
                      type="button"
                      onClick={copyPhone}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    )}
                  </div>
                ) : (
                  '—'
                )}
              </Row>

              <Row label="Phone (unformatted)">
                <span className="font-mono text-xs sm:text-sm">{doc.phoneUnformatted || '—'}</span>
              </Row>

              <Row label="Status">
                <StatusBadge label={doc.status} tone={leadStatusTone(doc.status)} />
              </Row>

              <Row label="Website" className="sm:col-span-2">
                {doc.website ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={leadWebsiteUrl(doc.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 break-all text-primary-600 hover:underline dark:text-primary-400"
                    >
                      <span>{doc.website}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copyText(doc.website, 'web')}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {copiedField === 'web' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === 'web' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  '—'
                )}
              </Row>
            </dl>
          </ContentCard>
        </div>

        {/* Right / Secondary Column */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <ContentCard className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
            <h2 className="mb-4 border-b border-gray-200 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:text-white">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-2.5">
              {(doc.phoneUnformatted || doc.phone) && (
                <a href={`tel:${(doc.phoneUnformatted || doc.phone).replace(/\s/g, '')}`} className="w-full">
                  <SecondaryButton type="button" className="w-full justify-center">
                    <Phone className="mr-1.5 h-4 w-4" /> Call Now
                  </SecondaryButton>
                </a>
              )}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                  <SecondaryButton
                    type="button"
                    className="w-full justify-center border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900/60 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    <MessageCircle className="mr-1.5 h-4 w-4" /> Message on WhatsApp
                  </SecondaryButton>
                </a>
              )}
              {doc.website && (
                <a href={doc.website} target="_blank" rel="noopener noreferrer" className="w-full">
                  <SecondaryButton type="button" className="w-full justify-center">
                    <Globe className="mr-1.5 h-4 w-4" /> Open Website
                  </SecondaryButton>
                </a>
              )}
              <Link to="/admin/leads" className="w-full">
                <SecondaryButton type="button" className="w-full justify-center">
                  Back to Leads
                </SecondaryButton>
              </Link>
            </div>
          </ContentCard>

          {/* Activity & Timestamps Card */}
          <ContentCard className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
              <div className="rounded-lg bg-primary-50 p-1.5 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <Clock className="h-4 w-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Timeline
              </h2>
            </div>

            <dl className="space-y-3">
              <Row label="Created">{formatLeadDate(doc.createdAt)}</Row>
              <Row label="Last Updated">{formatLeadDate(doc.updatedAt)}</Row>
            </dl>
          </ContentCard>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete lead?"
        body={`Delete "${doc.title || 'this lead'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default LeadDetailPage;