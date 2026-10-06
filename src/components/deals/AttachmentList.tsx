import React, { useEffect, useState } from 'react';
import { FileText, Download, Trash2, X } from 'lucide-react';
import { authFetch } from '../../utils/api';
import { attachmentUrl, isImageAttachment, formatFileSize, type DealAttachmentMeta } from '../../types/deal';

// Fetches an attachment as a blob (endpoint requires JWT, so plain <img>
// tags cannot be used) and exposes an object URL for preview/download.
// Status is surfaced (never swallowed) so preview failures are visible and
// retryable. A sequence counter ignores superseded responses when attId
// changes rapidly, so a stale fetch can never blank a newer thumbnail.
export interface AttachmentPreview {
  url: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useAttachmentUrl(attId: string | null): AttachmentPreview {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const seqRef = React.useRef(0);

  useEffect(() => {
    if (!attId) {
      setUrl(null);
      setLoading(false);
      setError(null);
      return;
    }
    const seq = ++seqRef.current;
    let objectUrl: string | null = null;
    setLoading(true);
    setError(null);
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    (async () => {
      try {
        const res = await authFetch(attachmentUrl(attId));
        if (seq !== seqRef.current) return;
        if (!res.ok) {
          setLoading(false);
          setError(`Preview failed (HTTP ${res.status})`);
          return;
        }
        const blob = await res.blob();
        if (seq !== seqRef.current) return;
        if (!blob || blob.size === 0) {
          setLoading(false);
          setError('Preview failed (empty file)');
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
        setLoading(false);
      } catch {
        if (seq !== seqRef.current) return;
        setLoading(false);
        setError('Preview failed (network error)');
      }
    })();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attId, attempt]);

  return { url, loading, error, retry: () => setAttempt((a) => a + 1) };
}

function AttachmentThumb({ att }: { att: DealAttachmentMeta }) {
  const preview = useAttachmentUrl(isImageAttachment(att.contentType) ? att._id : null);
  if (!isImageAttachment(att.contentType)) return null;
  return (
    <span className="block h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
      {preview.url ? (
        <img src={preview.url} alt={att.filename} loading="lazy" className="h-full w-full object-cover" />
      ) : preview.error ? (
        <button
          type="button"
          onClick={preview.retry}
          title={`${preview.error} — click to retry`}
          aria-label={`Retry preview of ${att.filename}: ${preview.error}`}
          className="flex h-full w-full flex-col items-center justify-center gap-0.5 px-1 text-center text-[10px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <span>Failed</span>
          <span className="underline">Retry</span>
        </button>
      ) : (
        <span className="flex h-full w-full items-center justify-center" aria-label="Loading preview">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500" />
        </span>
      )}
    </span>
  );
}

interface AttachmentListProps {
  attachments: DealAttachmentMeta[];
  onDelete?: (attId: string) => void;
  deletingId?: string | null;
}

const AttachmentList: React.FC<AttachmentListProps> = ({ attachments, onDelete, deletingId }) => {
  const [zoom, setZoom] = useState<DealAttachmentMeta | null>(null);
  const zoomPreview = useAttachmentUrl(zoom && isImageAttachment(zoom.contentType) ? zoom._id : null);

  const downloadById = async (att: DealAttachmentMeta) => {
    try {
      const res = await authFetch(attachmentUrl(att._id));
      if (!res.ok) return false;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = att.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!attachments || attachments.length === 0) return null;

  const download = async (att: DealAttachmentMeta) => {
    await downloadById(att);
  };

  return (
    <div>
      <ul className="mt-2 flex flex-col gap-2">
        {attachments.map((att) => (
          <li
            key={att._id}
            className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 dark:border-gray-700 dark:bg-gray-800/60"
          >
            {isImageAttachment(att.contentType) ? (
              <button
                type="button"
                onClick={() => setZoom(att)}
                aria-label={`Preview ${att.filename}`}
                className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <AttachmentThumb att={att} />
              </button>
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-gray-900 dark:text-white" title={att.filename}>
                {att.filename}
              </span>
              <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                {formatFileSize(att.size)} · {att.contentType}
              </span>
            </span>
            <button
              type="button"
              onClick={() => download(att)}
              aria-label={`Download ${att.filename}`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(att._id)}
                disabled={deletingId === att._id}
                aria-label={`Remove ${att.filename}`}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {zoom && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${zoom.filename}`}
        >
          <button
            type="button"
            onClick={() => setZoom(null)}
            aria-label="Close preview"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {zoomPreview.url ? (
            <img src={zoomPreview.url} alt={zoom.filename} className="max-h-[85vh] max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          ) : zoomPreview.error ? (
            <div className="flex flex-col items-center gap-3 text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-white">{zoomPreview.error}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={zoomPreview.retry}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => zoom && downloadById(zoom)}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  Download Instead
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white">Loading preview…</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentList;
