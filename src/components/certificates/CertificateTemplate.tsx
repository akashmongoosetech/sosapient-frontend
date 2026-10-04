import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export interface CertificateTemplateData {
  certificateId: string;
  firstName: string;
  lastName: string;
  college: string;
  course: string;
  durationText: string;
  startDate: string;
  endDate: string;
  hrHeadName: string;
  hrHeadDesignation: string;
  hrHeadSignature: string;
  managerName: string;
  managerDesignation: string;
  managerSignature: string;
  verificationUrl: string;
  qrDataUrl?: string;
}

// Fixed A4-landscape design surface (1123 x 794 @96dpi). The wrapper scales
// it to fit any container, so preview and PNG/JPEG/PDF exports are identical.
export const CERT_WIDTH = 1123;
export const CERT_HEIGHT = 794;

export interface CertificateTemplateHandle {
  node: HTMLDivElement | null;
}

interface Props {
  data: CertificateTemplateData;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

// "2 Months 23 Days" -> "2 months and 23 days"; "3 Months" stays "3 months".
function sentenceDuration(durationText: string): string {
  const lower = String(durationText || '').toLowerCase().trim();
  if (!lower) return '';
  const parts = lower.split(/\s+/);
  if (parts.length <= 2) return lower;
  const head = parts.slice(0, parts.length - 2).join(' ');
  const tail = parts.slice(parts.length - 2).join(' ');
  return head ? `${head} and ${tail}` : tail;
}

const SignatureBlock: React.FC<{ name: string; designation: string; signature: string }> = ({
  name, designation, signature
}) => (
  <div style={{ textAlign: 'center', width: 220 }}>
    <div style={{ height: 56, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {signature ? (
        <img src={signature} alt={`${name} signature`} style={{ maxHeight: 56, maxWidth: 200, objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: '"Great Vibes", cursive', fontSize: 34, color: '#202B68', lineHeight: 1 }}>
          {name}
        </span>
      )}
    </div>
    <div style={{ borderTop: '2px solid #202B68', marginTop: 6, paddingTop: 6 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#202B68' }}>{name}</div>
      <div style={{ fontSize: 11, letterSpacing: 2, color: '#6A1BCE', fontWeight: 600 }}>{designation}</div>
    </div>
  </div>
);

const CertificateTemplate = forwardRef<CertificateTemplateHandle, Props>(({ data }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useImperativeHandle(ref, () => ({ node: innerRef.current }), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / CERT_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fullName = `${data.firstName} ${data.lastName}`.trim();

  return (
    <div ref={wrapRef} style={{ width: '100%', overflow: 'hidden', height: CERT_HEIGHT * scale }}>
      <div
        style={{
          width: CERT_WIDTH,
          height: CERT_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: CERT_WIDTH,
            height: CERT_HEIGHT,
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
            color: '#202B68'
          }}
        >
          {/* Geometric corner decorations */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: 300, height: 220 }} viewBox="0 0 300 220">
            <polygon points="0,0 300,0 0,220" fill="#202B68" />
            <polygon points="0,0 210,0 0,154" fill="#6A1BCE" opacity="0.85" />
            <polygon points="0,0 120,0 0,88" fill="#ffffff" opacity="0.12" />
          </svg>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 300, height: 220, transform: 'rotate(180deg)' }} viewBox="0 0 300 220">
            <polygon points="0,0 300,0 0,220" fill="#202B68" />
            <polygon points="0,0 210,0 0,154" fill="#6A1BCE" opacity="0.85" />
            <polygon points="0,0 120,0 0,88" fill="#ffffff" opacity="0.12" />
          </svg>
          {/* Thin inner frame */}
          <div style={{ position: 'absolute', inset: 26, border: '2px solid #e3dcf5', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 34, border: '1px solid #202B68', opacity: 0.25, pointerEvents: 'none' }} />

          {/* Certificate ID top-left */}
          <div style={{ position: 'absolute', top: 52, left: 230, fontSize: 13, letterSpacing: 1 }}>
            <span style={{ color: '#6A1BCE', fontWeight: 700 }}>Certificate ID: </span>
            <span style={{ color: '#202B68', fontWeight: 700 }}>{data.certificateId}</span>
          </div>

          {/* Logo top-center */}
          <div style={{ position: 'absolute', top: 44, left: 0, right: 0, textAlign: 'center' }}>
            <img
              src="https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723"
              alt="SoSapient logo"
              style={{ height: 64, objectFit: 'contain' }}
            />
          </div>

          {/* Headings */}
          <div style={{ position: 'absolute', top: 128, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 56, fontWeight: 700, letterSpacing: 10, color: '#202B68', marginLeft: 10 }}>
              CERTIFICATE
            </div>
            <div style={{ fontSize: 15, letterSpacing: 6, color: '#6A1BCE', fontWeight: 600, marginTop: 2 }}>
              OF COMPLETION&nbsp;&nbsp;•&nbsp;&nbsp;PROUDLY PRESENTED TO
            </div>
          </div>

          {/* Candidate name */}
          <div style={{ position: 'absolute', top: 252, left: 0, right: 0, textAlign: 'center', padding: '0 90px' }}>
            <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: 64, color: '#202B68', lineHeight: 1.1 }}>
              {fullName}
            </div>
            <div style={{ width: 420, height: 2, background: '#6A1BCE', opacity: 0.4, margin: '2px auto 0' }} />
          </div>

          {/* Body */}
          <div style={{ position: 'absolute', top: 372, left: 0, right: 0, textAlign: 'center', padding: '0 110px', fontSize: 16.5, lineHeight: 1.75, color: '#333a5e', fontStyle: 'italic' }}>
            has successfully completed <strong>{sentenceDuration(data.durationText)}</strong> of an internship training program in{' '}
            <strong>{data.course}</strong> with wonderful remarks at SOSAPIENT from{' '}
            <strong>{formatDate(data.startDate)}</strong> to <strong>{formatDate(data.endDate)}</strong>.
            The candidate demonstrated valuable skills and made meaningful contributions to the
            tasks and projects throughout the internship.
          </div>

          {/* Signatures */}
          <div style={{ position: 'absolute', bottom: 96, left: 130, right: 130, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <SignatureBlock name={data.hrHeadName} designation={data.hrHeadDesignation} signature={data.hrHeadSignature} />
            <SignatureBlock name={data.managerName} designation={data.managerDesignation} signature={data.managerSignature} />
          </div>

          {/* Verification URL + QR */}
          <div style={{ position: 'absolute', bottom: 46, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {data.qrDataUrl && (
              <img src={data.qrDataUrl} alt="Verification QR code" style={{ width: 52, height: 52 }} />
            )}
            <div style={{ fontSize: 12.5, color: '#6A1BCE' }}>
              Verify at: <strong style={{ letterSpacing: 0.5 }}>{data.verificationUrl}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
