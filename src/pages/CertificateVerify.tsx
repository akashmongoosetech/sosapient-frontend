import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, XCircle, AlertCircle, FileDown, Image as ImageIcon, Link2 } from 'lucide-react';
import CertificateTemplate from '../components/certificates/CertificateTemplate';
import { Certificate, fullName } from '../types/certificate';
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

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

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

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" role="status" aria-label="Loading certificate" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading certificate…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Unable to verify certificate</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Please try again later.</p>
        <button onClick={() => window.location.reload()} className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
          Try again
        </button>
      </div>
    );
  }

  if (state.status === 'not-found') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <XCircle className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Certificate Not Found</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">We could not verify this certificate. Please check the Certificate ID and try again.</p>
        <Link to="/" className="mt-6 inline-block min-h-[44px] rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
          Back to Home
        </Link>
      </div>
    );
  }

  if (state.status === 'revoked') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="h-9 w-9 text-red-600" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Certificate Revoked</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">This certificate has been revoked and is no longer considered valid.</p>
        <Link to="/" className="mt-6 inline-block min-h-[44px] rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
          Back to Home
        </Link>
      </div>
    );
  }

  const doc = state.doc;
  const url = `${verificationBaseUrl()}/${doc.verificationSlug}/${doc.certificateId}`;
  const canonical = url;
  const fileBase = `${doc.verificationSlug}-${doc.certificateId}`;
  const detailRows: [string, string, boolean][] = [
    ['Certificate ID', doc.certificateId, true],
    ['Candidate Name', fullName(doc), false],
    ['College', doc.college || '—', false],
    ['Email', doc.email || '—', false],
    ['Mobile Number', doc.mobileNumber || '—', false],
    ['Course', doc.course || '—', false],
    ['Internship Training Course', doc.internshipTrainingCourse, false],
    ['Internship Duration', doc.durationText, false],
    ['Start Date', formatDate(doc.startDate), false],
    ['End Date', formatDate(doc.endDate), false],
    ['HR Head', `${doc.hrHeadName} (${doc.hrHeadDesignation})`, false],
    ['Manager', `${doc.managerName} (${doc.managerDesignation})`, false],
    ['Status', 'Verified', false],
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Certificate Verification - {fullName(doc)} | SoSapient</title>
        <meta name="description" content={`Verify the internship certificate issued by SoSapient for ${fullName(doc)}.`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Certificate Verification - ${fullName(doc)} | SoSapient`} />
        <meta property="og:description" content={`Verify the internship certificate issued by SoSapient for ${fullName(doc)}.`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Certificate Verification - ${fullName(doc)} | SoSapient`} />
        <meta name="twitter:description" content={`Verify the internship certificate issued by SoSapient for ${fullName(doc)}.`} />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Verified banner */}
        <div className="flex flex-col items-center rounded-2xl border border-green-200 bg-green-50 px-6 py-6 text-center dark:border-green-900 dark:bg-green-900/20">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
            <CheckCircle className="h-8 w-8 text-white" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-green-800 dark:text-green-300 sm:text-3xl">
            Certificate Verified
          </h1>
          <p className="mt-2 max-w-xl text-sm text-green-700 dark:text-green-200 sm:text-base">
            This certificate has been successfully verified and was issued by SoSapient.
          </p>
          <p className="mt-2 font-mono text-sm font-semibold text-green-800 dark:text-green-300">
            Certificate ID: {doc.certificateId} · Status: Valid
          </p>
        </div>

        {/* Certificate preview */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
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

        {/* Candidate details */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detailRows.map(([label, value, mono]) => (
            <div key={label} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
              <p className={`mt-1 text-sm font-semibold text-gray-900 dark:text-white ${mono ? 'font-mono' : ''}`}>
                {value as string}
              </p>
            </div>
          ))}
        </div>

        {/* Downloads */}
        <div className="mt-8 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Download certificate</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={copyUrl}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200"
            >
              <Link2 className="h-4 w-4" /> {copied ? 'Verification URL copied' : 'Copy URL'}
            </button>
            <button
              onClick={() => runExport('pdf', (n) => downloadCertificatePdf(n, fileBase))}
              disabled={exporting !== null}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" /> {exporting === 'pdf' ? 'Exporting…' : 'Download PDF'}
            </button>
            <button
              onClick={() => runExport('png', (n) => downloadCertificatePng(n, fileBase))}
              disabled={exporting !== null}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4" /> {exporting === 'png' ? 'Exporting…' : 'Download PNG'}
            </button>
            <button
              onClick={() => runExport('jpeg', (n) => downloadCertificateJpeg(n, fileBase, 'jpeg'))}
              disabled={exporting !== null}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4" /> {exporting === 'jpeg' ? 'Exporting…' : 'Download JPEG'}
            </button>
            <button
              onClick={() => runExport('jpg', (n) => downloadCertificateJpeg(n, fileBase, 'jpg'))}
              disabled={exporting !== null}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4" /> {exporting === 'jpg' ? 'Exporting…' : 'Download JPG'}
            </button>
          </div>
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
