import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  AlertCircle,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileDown,
  Fingerprint,
  Home,
  Image as ImageIcon,
  Link2,
  Mail,
  Phone,
  QrCode,
  Search,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';
import CertificateTemplate from '../components/certificates/CertificateTemplate';
import { Certificate } from '../types/certificate';
import { formatName } from '../utils/certificate';
import { verificationBaseUrl } from '../config/certificate';
import { downloadCertificatePdf, downloadCertificatePng, downloadCertificateJpeg, qrForUrl } from '../utils/certificateExport';

type VerifyState =
  | { status: 'loading' }
  | { status: 'verified'; doc: Certificate }
  | { status: 'revoked' }
  | { status: 'not-found' }
  | { status: 'error' };

const ID_PATTERN = /^[A-Z0-9-]{4,32}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* ------------------------------------------------------------------ */
/* Small presentational pieces (no logic, no side effects)             */
/* ------------------------------------------------------------------ */

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string; mono?: boolean }> = ({
  icon,
  label,
  value,
  mono,
}) => (
  <div className="flex items-start gap-3 py-3">
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
      {icon}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
      <p
        className={`mt-0.5 break-words text-sm font-semibold text-gray-900 dark:text-white ${mono ? 'font-mono' : ''}`}
        title={value}
      >
        {value}
      </p>
    </div>
  </div>
);

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
      <span className="h-px w-5 bg-primary-300 dark:bg-primary-700" aria-hidden="true" />
      {title}
    </h3>
    <div className="mt-1 divide-y divide-gray-100 dark:divide-gray-800">{children}</div>
  </section>
);

const StateShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-gray-50 dark:bg-gray-900">
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const CertificateVerify: React.FC = () => {
  const { candidateSlug, certificateId } = useParams<{ candidateSlug: string; certificateId: string }>();
  const [state, setState] = useState<VerifyState>({ status: 'loading' });
  const [exporting, setExporting] = useState<string | null>(null);
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const templateRef = useRef<{ node: HTMLDivElement | null }>(null);

  useEffect(() => {
    if (!candidateSlug || !SLUG_PATTERN.test(candidateSlug) || !certificateId || !ID_PATTERN.test(certificateId)) {
      setState({ status: 'not-found' });
      return;
    }
    (async () => {
      try {
        setState({ status: 'loading' });
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`
        );
        if (res.status === 410) {
          setState({ status: 'revoked' });
          return;
        }
        const data = await res.json();
        if (data.success && data.verified && data.data) {
          setState({ status: 'verified', doc: data.data as Certificate });
        } else {
          setState({ status: 'not-found' });
        }
      } catch {
        setState({ status: 'error' });
      }
    })();
  }, [candidateSlug, certificateId]);

  useEffect(() => {
    if (state.status === 'verified' && candidateSlug && certificateId) {
      qrForUrl(`${verificationBaseUrl()}/${candidateSlug}/${certificateId.toUpperCase()}`)
        .then(setQr)
        .catch(() => setQr(''));
    }
  }, [state, candidateSlug, certificateId]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const copyUrl = () => copyText(window.location.href);

  const runExport = async (kind: string, fn: (n: HTMLElement) => Promise<void>) => {
    const n = templateRef.current?.node;
    if (!n) return;
    try {
      setExporting(kind);
      await fn(n);
    } finally {
      setExporting(null);
    }
  };

  /* ------------------------------ states ------------------------------ */

  if (state.status === 'loading') {
    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading certificate">
          <div className="h-56 animate-pulse rounded-3xl bg-gradient-to-r from-secondary-800 via-primary-700 to-secondary-800 sm:h-64" />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="aspect-[1123/794] w-full animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="space-y-4">
              <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">Verifying certificate…</p>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <StateShell>
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertCircle className="h-9 w-9 text-amber-600 dark:text-amber-400" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-white">Unable to verify certificate</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Something went wrong on our side. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            Try again
          </button>
        </div>
      </StateShell>
    );
  }

  if (state.status === 'not-found') {
    return (
      <StateShell>
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Search className="h-8 w-8 text-gray-400 dark:text-gray-300" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-white">Certificate Not Found</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            We could not verify this certificate. Please check the Certificate ID in the URL and try again.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </StateShell>
    );
  }

  if (state.status === 'revoked') {
    return (
      <StateShell>
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-gray-800">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-white">Certificate Revoked</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            This certificate has been revoked by SoSapient and is no longer considered valid.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700 dark:bg-red-900/40 dark:text-red-300">
            <ShieldCheck className="h-4 w-4" /> Status: Revoked
          </span>
          <div>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </div>
        </div>
      </StateShell>
    );
  }

  /* ---------------------------- verified view ---------------------------- */

  const doc = state.doc;
  const url = `${verificationBaseUrl()}/${doc.verificationSlug}/${doc.certificateId}`;
  const canonical = url;
  const fileBase = `${doc.verificationSlug}-${doc.certificateId}`;
  const displayName = formatName(doc.firstName, doc.lastName);
  const busy = exporting !== null;

  const downloadButtons = [
    { kind: 'pdf', label: 'PDF Document', icon: <FileDown className="h-4 w-4" />, run: (n: HTMLElement) => downloadCertificatePdf(n, fileBase) },
    { kind: 'png', label: 'PNG Image', icon: <ImageIcon className="h-4 w-4" />, run: (n: HTMLElement) => downloadCertificatePng(n, fileBase) },
    { kind: 'jpeg', label: 'JPEG Image', icon: <ImageIcon className="h-4 w-4" />, run: (n: HTMLElement) => downloadCertificateJpeg(n, fileBase, 'jpeg') },
    { kind: 'jpg', label: 'JPG Image', icon: <ImageIcon className="h-4 w-4" />, run: (n: HTMLElement) => downloadCertificateJpeg(n, fileBase, 'jpg') },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Certificate Verification - {displayName} | SoSapient</title>
        <meta name="description" content={`Verify the internship certificate issued by SoSapient for ${displayName}.`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Certificate Verification - ${displayName} | SoSapient`} />
        <meta property="og:description" content={`Verify the internship certificate issued by SoSapient for ${displayName}.`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Certificate Verification - ${displayName} | SoSapient`} />
        <meta name="twitter:description" content={`Verify the internship certificate issued by SoSapient for ${displayName}.`} />
      </Helmet>

      {/* ------------------------------- Hero ------------------------------- */}
      <div
        className="relative overflow-hidden bg-secondary-900"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(127,95,168,0.45) 0, transparent 45%), radial-gradient(circle at 85% 80%, rgba(57,38,155,0.6) 0, transparent 50%), linear-gradient(135deg, #16103d 0%, #2e1f7c 55%, #6d4d94 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          aria-hidden="true"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-white/60">
            <Link to="/" className="inline-flex items-center gap-1 transition hover:text-white">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Verify</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="max-w-[180px] truncate font-mono text-white/90 sm:max-w-none">{doc.certificateId}</span>
          </nav>

          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Animated verified badge */}
            <span className="relative flex h-20 w-20 shrink-0 items-center justify-center" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-25 [animation-duration:2s]" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/40 ring-4 ring-white/20">
                <CheckCircle className="h-10 w-10 text-white" />
              </span>
            </span>
            <div className="min-w-0 animate-slide-up">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-300/30">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified · Valid
              </p>
              <h1 className="mt-2 truncate font-display text-3xl font-bold text-white sm:text-4xl" title={displayName}>
                {displayName}
              </h1>
              <p className="mt-1 truncate text-sm text-white/70 sm:text-base" title={doc.internshipTrainingCourse}>
                {doc.internshipTrainingCourse} · {doc.durationText}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => copyText(doc.certificateId)}
                  className="group inline-flex min-h-[36px] items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
                  title="Copy Certificate ID"
                >
                  <Fingerprint className="h-3.5 w-3.5 text-white/70" />
                  {doc.certificateId}
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5 text-white/50 transition group-hover:text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* curved divider into page body */}
        <svg className="relative block h-6 w-full text-gray-50 dark:text-gray-900 sm:h-8" viewBox="0 0 1440 32" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 L0,20 C360,0 1080,0 1440,20 L1440,32 Z" fill="currentColor" />
        </svg>
      </div>

      {/* ---------------------------- Main content ---------------------------- */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Certificate preview */}
          <div className="animate-fade-in lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-secondary-900/5 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/30">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Official Certificate
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <BadgeCheck className="h-3.5 w-3.5" /> Authentic
                </span>
              </div>
              {/* Export-safe: no transforms, filters or clipping tricks on this subtree */}
              <CertificateTemplate
                ref={templateRef}
                data={{
                  certificateId: doc.certificateId,
                  firstName: doc.firstName,
                  lastName: doc.lastName,
                  college: doc.college,
                  course: doc.internshipTrainingCourse,
                  durationText: doc.durationText,
                  startDate: doc.startDate,
                  endDate: doc.endDate,
                  hrHeadName: doc.hrHeadName,
                  hrHeadDesignation: doc.hrHeadDesignation,
                  hrHeadSignature: doc.hrHeadSignature,
                  managerName: doc.managerName,
                  managerDesignation: doc.managerDesignation,
                  managerSignature: doc.managerSignature,
                  verificationUrl: url,
                  qrDataUrl: qr || undefined
                }}
              />
            </div>

            {/* Trust strip */}
            <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <h2 className="font-display text-base font-bold text-gray-900 dark:text-white">How verification works</h2>
              <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: <QrCode className="h-5 w-5" />, title: 'Scan the QR', text: 'Every certificate carries a unique QR code linked to this page.' },
                  { icon: <Search className="h-5 w-5" />, title: 'Match the ID', text: 'The Certificate ID in the URL must match the printed ID exactly.' },
                  { icon: <ShieldCheck className="h-5 w-5" />, title: 'Confirm the issuer', text: 'A green Verified badge means SoSapient issued this certificate.' },
                ].map((step, i) => (
                  <li key={step.title} className="relative rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                    <span className="absolute right-3 top-3 font-display text-2xl font-bold text-gray-200 dark:text-gray-700" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                      {step.icon}
                    </span>
                    <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sticky side rail */}
          <aside className="animate-slide-up space-y-6 lg:sticky lg:top-6">
            {/* Details */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Certificate details</h2>
              <div className="mt-4 space-y-5">
                <DetailSection title="Candidate">
                  <DetailItem icon={<User className="h-4 w-4" />} label="Full Name" value={displayName} />
                  <DetailItem icon={<Building2 className="h-4 w-4" />} label="College" value={doc.college || '—'} />
                  <DetailItem icon={<Mail className="h-4 w-4" />} label="Email" value={doc.email || '—'} />
                  <DetailItem icon={<Phone className="h-4 w-4" />} label="Mobile Number" value={doc.mobileNumber || '—'} />
                </DetailSection>
                <DetailSection title="Program">
                  <DetailItem icon={<BookOpen className="h-4 w-4" />} label="Course" value={doc.course || '—'} />
                  <DetailItem icon={<Award className="h-4 w-4" />} label="Internship Training" value={doc.internshipTrainingCourse} />
                  <DetailItem icon={<Clock className="h-4 w-4" />} label="Duration" value={doc.durationText} />
                  <DetailItem icon={<CalendarDays className="h-4 w-4" />} label="Start Date" value={formatDate(doc.startDate)} />
                  <DetailItem icon={<CalendarDays className="h-4 w-4" />} label="End Date" value={formatDate(doc.endDate)} />
                </DetailSection>
                <DetailSection title="Issued By">
                  <DetailItem
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="HR Head"
                    value={`${doc.hrHeadName} (${doc.hrHeadDesignation})`}
                  />
                  <DetailItem
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="Manager"
                    value={`${doc.managerName} (${doc.managerDesignation})`}
                  />
                  <DetailItem icon={<Fingerprint className="h-4 w-4" />} label="Certificate ID" value={doc.certificateId} mono />
                  <DetailItem icon={<ShieldCheck className="h-4 w-4" />} label="Status" value="Verified" />
                </DetailSection>
              </div>
            </div>

            {/* Downloads */}
            <div className="overflow-hidden rounded-3xl bg-secondary-900 shadow-lg">
              <div className="p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                  <Download className="h-5 w-5" /> Download certificate
                </h2>
                <p className="mt-1 text-xs text-white/60">Exports render at full 1123 × 794 print resolution.</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={copyUrl}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
                  >
                    <Link2 className="h-4 w-4" /> {copied ? 'Verification URL copied' : 'Copy verification URL'}
                  </button>
                  {downloadButtons.map((b) => (
                    <button
                      key={b.kind}
                      onClick={() => runExport(b.kind, b.run)}
                      disabled={busy}
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-secondary-900 shadow-sm transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {b.icon} {exporting === b.kind ? 'Exporting…' : `Download ${b.label}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );

  function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }
};

export default CertificateVerify;
