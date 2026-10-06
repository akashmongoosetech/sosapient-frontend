import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Phone, Globe, Mail, MapPin } from 'lucide-react';
import { authFetch } from '../../utils/api';
import { leadWebsiteUrl } from '../../types/lead';
import {
  emptyDealClient,
  dealSourceLeadId,
  formatDealDate,
  toDateInputValue,
  type Deal,
  type DealClient,
} from '../../types/deal';
import {
  PrimaryButton,
  DangerButton,
  AdminInput,
  AdminTextarea,
  FieldLabel,
  StatusBadge,
  LoadingState,
  ErrorState,
  ConfirmDialog,
} from '../admin/ui';
import DealRequirements from './DealRequirements';
import DealReports from './DealReports';

interface DealViewModalProps {
  dealId: string;
  onClose: () => void;
  onDeleted: () => void;
}

const CLIENT_FIELDS: { key: keyof DealClient; label: string; type?: string; span?: boolean; max: number }[] = [
  { key: 'name', label: 'Client Name', max: 200 },
  { key: 'mobileNumber1', label: 'Mobile Number 1', type: 'tel', max: 40 },
  { key: 'mobileNumber2', label: 'Mobile Number 2', type: 'tel', max: 40 },
  { key: 'email1', label: 'Email 1', type: 'email', max: 160 },
  { key: 'email2', label: 'Email 2', type: 'email', max: 160 },
  { key: 'city', label: 'City', max: 100 },
  { key: 'state', label: 'State', max: 100 },
  { key: 'pincode', label: 'Pincode', max: 20 },
];

const DealViewModal: React.FC<DealViewModalProps> = ({ dealId, onClose, onDeleted }) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [client, setClient] = useState<DealClient>(emptyDealClient());
  const [clientAddress, setClientAddress] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [savingClient, setSavingClient] = useState(false);
  const [clientMsg, setClientMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDeal = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${dealId}`);
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (!data.success || !data.data) throw new Error(data.message || 'Deal not found.');
      const d: Deal = data.data;
      setDeal(d);
      setClient({ ...emptyDealClient(), ...(d.client || {}) });
      setClientAddress(d.client?.address || '');
      setProjectDate(toDateInputValue(d.projectReceivedDate));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load deal.');
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const saveClient = async () => {
    if (!deal) return;
    setSavingClient(true);
    setClientMsg(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { ...client, address: clientAddress },
          projectReceivedDate: projectDate || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.success) {
        throw new Error((data && data.message) || 'Unable to save. Please try again.');
      }
      setDeal(data.data);
      setClientMsg({ type: 'success', text: 'Client and project details saved.' });
    } catch (err) {
      setClientMsg({ type: 'error', text: err instanceof Error ? err.message : 'Unable to save. Please try again.' });
    } finally {
      setSavingClient(false);
    }
  };

  const confirmDeleteDeal = async () => {
    if (!deal) return;
    setDeleting(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        onDeleted();
      }
    } finally {
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  const setClientField = (key: keyof DealClient, value: string) =>
    setClient((c) => ({ ...c, [key]: value }));

  const leadId = deal ? dealSourceLeadId(deal) : '';

  return (
    <>
    <AnimatePresence>
      <motion.div
        key="deal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Deal details"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-gray-900 sm:max-w-4xl sm:rounded-3xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Deal workspace
              </p>
              <h2 className="truncate font-display text-xl font-bold text-gray-900 dark:text-white">
                {deal ? deal.leadSnapshot.title || deal.client.name || 'Deal' : 'Deal'}
              </h2>
              {deal && (
                <span className="mt-1 inline-flex">
                  <StatusBadge label="Converted" tone="gray" />
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {deal && (
                <DangerButton type="button" onClick={() => setConfirmingDelete(true)}>
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </DangerButton>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close deal details"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {loading && <LoadingState message="Loading deal…" />}
            {!loading && (loadError || !deal) && (
              <ErrorState title="Could not load deal" body={loadError || 'Deal not found.'} onRetry={fetchDeal} />
            )}
            {!loading && deal && (
              <div className="flex flex-col gap-6">
                {/* Overview */}
                <section aria-label="Deal overview">
                  <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Deal ID', value: deal._id.slice(-8).toUpperCase(), mono: true },
                      { label: 'Deal Created', value: formatDealDate(deal.createdAt) },
                      { label: 'Last Updated', value: formatDealDate(deal.updatedAt) },
                      { label: 'Project Received', value: formatDealDate(deal.projectReceivedDate) },
                      { label: 'Source Category', value: deal.leadSnapshot.categoryName || '—' },
                      { label: 'Source City', value: deal.leadSnapshot.city || deal.client.city || '—' },
                    ].map((r) => (
                      <div key={r.label} className="rounded-xl bg-gray-50 px-3.5 py-3 dark:bg-gray-800/60">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          {r.label}
                        </dt>
                        <dd className={`mt-0.5 truncate text-sm font-bold text-gray-900 dark:text-white ${r.mono ? 'font-mono' : ''}`} title={r.label === 'Deal ID' ? deal._id : r.value}>
                          {r.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    {leadId && (
                      <Link
                        to={`/admin/leads/${leadId}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline dark:text-primary-400"
                      >
                        View source lead →
                      </Link>
                    )}
                    {(deal.client.mobileNumber1 || deal.leadSnapshot.phoneUnformatted || deal.leadSnapshot.phone) && (
                      <a
                        href={`tel:${(deal.client.mobileNumber1 || deal.leadSnapshot.phoneUnformatted || deal.leadSnapshot.phone).replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline dark:text-primary-400"
                      >
                        <Phone className="h-3.5 w-3.5" /> Call client
                      </a>
                    )}
                    {deal.leadSnapshot.website && (
                      <a
                        href={leadWebsiteUrl(deal.leadSnapshot.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline dark:text-primary-400"
                      >
                        <Globe className="h-3.5 w-3.5" /> Website
                      </a>
                    )}
                    {(deal.client.email1) && (
                      <a
                        href={`mailto:${deal.client.email1}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline dark:text-primary-400"
                      >
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    )}
                    {(deal.client.address || deal.client.city) && (
                      <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{[deal.client.address, deal.client.city].filter(Boolean).join(', ')}</span>
                      </span>
                    )}
                  </div>
                </section>

                {/* Client + project form */}
                <section aria-label="Client and project information" className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700 sm:p-5">
                  <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">Client & Project Information</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {CLIENT_FIELDS.map((f) => (
                      <div key={f.key}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <AdminInput
                          type={f.type || 'text'}
                          value={client[f.key]}
                          maxLength={f.max}
                          onChange={(e) => setClientField(f.key, e.target.value)}
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <FieldLabel>Client Address</FieldLabel>
                      <AdminTextarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={2} maxLength={500} placeholder="Street, area, landmark…" />
                    </div>
                    <div>
                      <FieldLabel>Project Received Date</FieldLabel>
                      <AdminInput type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} aria-label="Project received date" />
                    </div>
                  </div>
                  {clientMsg && (
                    <p role={clientMsg.type === 'error' ? 'alert' : 'status'} className={`mt-3 rounded-lg px-4 py-2.5 text-sm font-medium ${clientMsg.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
                      {clientMsg.text}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <PrimaryButton type="button" onClick={saveClient} disabled={savingClient}>
                      {savingClient ? 'Saving…' : 'Save Client & Project'}
                    </PrimaryButton>
                  </div>
                </section>

                {/* Requirements */}
                <DealRequirements
                  deal={deal}
                  onChanged={async () => {
                    const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}`);
                    const data = await res.json().catch(() => null);
                    if (res.ok && data && data.success) setDeal(data.data);
                  }}
                />

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Reports */}
                <DealReports
                  deal={deal}
                  onChanged={async () => {
                    const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/deals/${deal._id}`);
                    const data = await res.json().catch(() => null);
                    if (res.ok && data && data.success) setDeal(data.data);
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

    </AnimatePresence>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete deal?"
        body="Delete this deal workspace (requirements, reports and attachments)? The source lead is kept."
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={confirmDeleteDeal}
      />
    </>
  );
};

export default DealViewModal;
