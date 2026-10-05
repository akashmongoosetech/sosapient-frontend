import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileJson, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authFetch } from '../../utils/api';
import {
  importVerdictLabel,
  importVerdictTone,
  type ImportPreviewRow,
  type ImportSummary,
  type ImportResult,
  type ImportVerdict,
} from '../../types/lead';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  ContentCard,
  StatusBadge,
  AdminTableShell,
  TableHead,
  Th,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';

type Step = 'upload' | 'analyzing' | 'review' | 'importing' | 'done';

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const VERDICT_FILTERS: { value: 'all' | ImportVerdict; label: string }[] = [
  { value: 'all', label: 'All rows' },
  { value: 'new', label: 'New' },
  { value: 'in-file-duplicate', label: 'Duplicates in file' },
  { value: 'exists-db', label: 'Already exists' },
  { value: 'possible', label: 'Possible duplicates' },
  { value: 'invalid', label: 'Invalid' },
];

function cellText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

const LeadImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [records, setRecords] = useState<unknown[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [rows, setRows] = useState<ImportPreviewRow[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [verdictFilter, setVerdictFilter] = useState<'all' | ImportVerdict>('all');
  const [mode, setMode] = useState<'new-only' | 'all'>('new-only');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const reset = () => {
    setStep('upload');
    setFileName('');
    setRecords([]);
    setSummary(null);
    setRows([]);
    setTruncated(false);
    setPreviewError(null);
    setVerdictFilter('all');
    setMode('new-only');
    setResult(null);
    setImportError(null);
  };

  const parseFile = async (file: File) => {
    setPreviewError(null);
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') {
      setPreviewError('Please choose a .json file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setPreviewError('File is too large. Maximum 5 MB.');
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      setPreviewError('Invalid JSON file. Please check the syntax and try again.');
      return;
    }
    const list = Array.isArray(parsed) ? parsed : [parsed];
    if (list.length === 0) {
      setPreviewError('The file contains no records.');
      return;
    }
    setRecords(list);
    setFileName(file.name);
    analyze(list);
  };

  const analyze = async (list: unknown[]) => {
    setStep('analyzing');
    setPreviewError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/import/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: list }),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Unable to analyze import file.');
      setSummary(data.summary);
      setRows(data.rows || []);
      setTruncated(Boolean(data.truncated));
      setStep('review');
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Unable to analyze import file.');
      setStep('upload');
    }
  };

  const confirmImport = async () => {
    setStep('importing');
    setImportError(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/leads/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, mode }),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Unable to complete import.');
      setResult(data as ImportResult);
      setStep('done');
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Unable to complete import.');
      setStep('review');
    }
  };

  const filteredRows = verdictFilter === 'all' ? rows : rows.filter((r) => r.verdict === verdictFilter);
  const importable = mode === 'all' && summary ? summary.total - summary.invalid : summary?.new || 0;

  return (
    <div>
      <PageHeader
        title="Import Leads"
        subtitle="Upload a JSON file, review duplicates, then confirm"
        actions={
          <SecondaryButton type="button" onClick={() => navigate('/admin/leads')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Leads
          </SecondaryButton>
        }
      />

      {/* Stepper */}
      <ol className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold" aria-label="Import progress">
        {['Upload', 'Analyze', 'Review', 'Import', 'Done'].map((label, i) => {
          const order: Step[] = ['upload', 'analyzing', 'review', 'importing', 'done'];
          const activeIdx = order.indexOf(step);
          const done = i < activeIdx || step === 'done';
          const current = i === activeIdx;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  done || current ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                }`}
                aria-current={current ? 'step' : undefined}
              >
                {i + 1}
              </span>
              <span className={current ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>{label}</span>
              {i < 4 && <span className="mx-1 h-px w-6 bg-gray-300 dark:bg-gray-700" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {step === 'upload' && (
        <ContentCard>
          <label
            htmlFor="lead-json-file"
            className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-primary-400 hover:bg-primary-50/50 dark:border-gray-600 dark:hover:bg-primary-900/20"
          >
            <FileJson className="h-10 w-10 text-primary-500" aria-hidden="true" />
            <span className="mt-3 font-semibold text-gray-900 dark:text-white">Choose a JSON file</span>
            <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Array of lead objects or a single object · max 5 MB · up to 5,000 records
            </span>
            <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white">
              <Upload className="h-4 w-4" /> Browse File
            </span>
            <input
              id="lead-json-file"
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f) parseFile(f);
                e.target.value = '';
              }}
            />
          </label>
          {previewError && (
            <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
              {previewError}
            </p>
          )}
          <details className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <summary className="cursor-pointer font-semibold text-primary-600 dark:text-primary-400">
              Expected JSON format
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
{`[
  {
    "title": "Visualeyes Hospital",
    "categoryName": "Ophthalmology clinic",
    "address": "F-1 6-10 Madhav Club Road, Ujjain",
    "city": "Ujjain",
    "website": "https://visualeyes-hospital.com/",
    "phone": "+91 89820 66690",
    "phoneUnformatted": "+918982066690"
  }
]`}
            </pre>
            <p className="mt-2">
              Only <code>title</code>, <code>categoryName</code>, <code>address</code>, <code>city</code>,{' '}
              <code>website</code>, <code>phone</code>, <code>phoneUnformatted</code> and <code>status</code> are
              imported — unknown fields are ignored. Partial records are imported as long as they contain
              usable data.
            </p>
          </details>
        </ContentCard>
      )}

      {step === 'analyzing' && <LoadingState message={`Analyzing ${fileName || 'file'} — checking duplicates…`} />}

      {step === 'review' && summary && (
        <div>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Total Records', value: summary.total, tone: 'blue' as const },
              { label: 'New Records', value: summary.new, tone: 'green' as const },
              { label: 'Duplicates in File', value: summary.inFileDuplicate, tone: 'yellow' as const },
              { label: 'Already in Database', value: summary.existsDb, tone: 'gray' as const },
              { label: 'Possible Duplicates', value: summary.possible, tone: 'purple' as const },
              { label: 'Invalid Records', value: summary.invalid, tone: 'red' as const },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                <StatusBadge label={String(s.value)} tone={s.tone} />
                <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{s.label}</p>
              </div>
            ))}
          </div>

          <ContentCard>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">
                Preview rows {truncated ? `(first ${rows.length} of ${summary.total})` : `(${rows.length})`}
              </h2>
              <div className="flex flex-wrap gap-2">
                {VERDICT_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setVerdictFilter(f.value)}
                    aria-pressed={verdictFilter === f.value}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      verdictFilter === f.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredRows.length === 0 ? (
              <EmptyState title="No rows match this filter" body="Choose a different result filter to inspect rows." />
            ) : (
              <div className="overflow-x-auto">
                <AdminTableShell>
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <TableHead>
                      <tr>
                        <Th>#</Th>
                        <Th>Business / Lead</Th>
                        <Th>Category</Th>
                        <Th>City</Th>
                        <Th>Phone</Th>
                        <Th>Website</Th>
                        <Th>Import Result</Th>
                      </tr>
                    </TableHead>
                    <tbody>
                      {filteredRows.map((row) => (
                        <tr key={row.index} className="border-t border-gray-100 dark:border-gray-800">
                          <td className="px-3 py-2 text-gray-500">{row.index + 1}</td>
                          <td className="max-w-[180px] truncate px-3 py-2 font-medium text-gray-900 dark:text-white" title={cellText(row.lead.title)}>
                            {cellText(row.lead.title) || '—'}
                          </td>
                          <td className="max-w-[140px] truncate px-3 py-2 text-gray-600 dark:text-gray-300" title={cellText(row.lead.categoryName)}>
                            {cellText(row.lead.categoryName) || '—'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-300">{cellText(row.lead.city) || '—'}</td>
                          <td className="max-w-[150px] truncate px-3 py-2 text-gray-600 dark:text-gray-300" title={cellText(row.lead.phoneUnformatted || row.lead.phone)}>
                            {cellText(row.lead.phoneUnformatted || row.lead.phone) || '—'}
                          </td>
                          <td className="max-w-[170px] truncate px-3 py-2 text-gray-600 dark:text-gray-300" title={cellText(row.lead.website)}>
                            {cellText(row.lead.website) || '—'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2" title={row.reason}>
                            <StatusBadge label={importVerdictLabel(row.verdict)} tone={importVerdictTone(row.verdict)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AdminTableShell>
              </div>
            )}

            <fieldset className="mt-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <legend className="px-2 text-sm font-bold text-gray-900 dark:text-white">Import mode</legend>
              <label className="flex cursor-pointer items-start gap-2.5 py-1.5">
                <input
                  type="radio"
                  name="import-mode"
                  checked={mode === 'new-only'}
                  onChange={() => setMode('new-only')}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Import only new records ({summary.new})
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Duplicates, existing and invalid rows are skipped.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2.5 py-1.5">
                <input type="radio" name="import-mode" checked={mode === 'all'} onChange={() => setMode('all')} className="mt-1" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Import all except invalid ({summary.total - summary.invalid})
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Duplicate rows will be created as separate leads. Use only if you intend to keep duplicates.
                  </span>
                </span>
              </label>
            </fieldset>

            {importError && (
              <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                {importError}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <SecondaryButton type="button" onClick={reset}>
                Choose Different File
              </SecondaryButton>
              <PrimaryButton type="button" onClick={confirmImport} disabled={importable === 0}>
                {importable === 0 ? 'Nothing to Import' : `Confirm Import (${importable})`}
              </PrimaryButton>
            </div>
          </ContentCard>
        </div>
      )}

      {step === 'importing' && <LoadingState message={`Importing ${importable} records…`} />}

      {step === 'done' && result && (
        <ContentCard>
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">Import Completed</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Mode: {result.mode === 'all' ? 'Import all' : 'New records only'}
            </p>
          </div>
          <dl className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Processed', value: result.processed },
              { label: 'Imported', value: result.imported },
              { label: 'Skipped', value: result.skipped },
              { label: 'Duplicates', value: result.duplicates },
              { label: 'Errors', value: result.errors },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{s.value.toLocaleString()}</dd>
              </div>
            ))}
          </dl>
          {result.errorDetails.length > 0 && (
            <details className="mx-auto mt-4 max-w-2xl">
              <summary className="cursor-pointer text-sm font-semibold text-red-600 dark:text-red-400">
                View {result.errorDetails.length} error details
              </summary>
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
                {result.errorDetails.map((e, i) => (
                  <li key={i} className="text-gray-600 dark:text-gray-300">
                    Row {e.index >= 0 ? e.index + 1 : '?'}: {e.message}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link to="/admin/leads">
              <PrimaryButton type="button">View Leads Table</PrimaryButton>
            </Link>
            <SecondaryButton type="button" onClick={reset}>
              Import Another File
            </SecondaryButton>
          </div>
        </ContentCard>
      )}
    </div>
  );
};
export default LeadImportPage;
