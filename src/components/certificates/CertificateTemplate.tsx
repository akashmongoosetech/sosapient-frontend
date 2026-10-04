import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { formatName } from '../../utils/certificate';

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

const NAVY = '#202B68';
const PURPLE = '#6A1BCE';
const INK = '#2c3560';

const SignatureBlock: React.FC<{ name: string; designation: string; signature: string }> = ({
  name, designation, signature
}) => (
  <div style={{ textAlign: 'center', width: 240 }}>
    <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {signature ? (
        <img src={signature} alt={`${name} signature`} style={{ maxHeight: 60, maxWidth: 210, objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: '"Great Vibes", cursive', fontSize: 36, color: NAVY, lineHeight: 1 }}>
          {name}
        </span>
      )}
    </div>
    <div style={{ borderTop: `2px solid ${NAVY}`, marginTop: 8, paddingTop: 8 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, letterSpacing: 0.3 }}>{name}</div>
      <div style={{ fontSize: 10.5, letterSpacing: 3, color: PURPLE, fontWeight: 700, marginTop: 2 }}>{designation}</div>
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

  const fullName = formatName(data.firstName, data.lastName);
  // Auto-fit long names so they never overflow or clip.
  const nameSize = fullName.length > 30 ? 46 : fullName.length > 22 ? 54 : 64;

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
            backgroundImage:
              'radial-gradient(circle at 50% 42%, #f4f1fb 0%, #ffffff 55%), radial-gradient(rgba(106,27,206,0.055) 1.2px, transparent 1.3px)',
            backgroundSize: '100% 100%, 26px 26px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
            color: NAVY
          }}
        >
          {/* Elegant layered corner ornaments */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: 250, height: 190 }} viewBox="0 0 250 190">
            <polygon points="0,0 250,0 0,190" fill={NAVY} />
            <polygon points="0,0 196,0 0,150" fill={PURPLE} opacity="0.9" />
            <polygon points="0,0 150,0 0,114" fill="#ffffff" opacity="0.14" />
            <circle cx="34" cy="34" r="5" fill="#ffffff" opacity="0.85" />
            <circle cx="58" cy="34" r="2.6" fill="#ffffff" opacity="0.6" />
            <circle cx="34" cy="58" r="2.6" fill="#ffffff" opacity="0.6" />
          </svg>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 250, height: 190, transform: 'rotate(180deg)' }} viewBox="0 0 250 190">
            <polygon points="0,0 250,0 0,190" fill={NAVY} />
            <polygon points="0,0 196,0 0,150" fill={PURPLE} opacity="0.9" />
            <polygon points="0,0 150,0 0,114" fill="#ffffff" opacity="0.14" />
            <circle cx="34" cy="34" r="5" fill="#ffffff" opacity="0.85" />
            <circle cx="58" cy="34" r="2.6" fill="#ffffff" opacity="0.6" />
            <circle cx="34" cy="58" r="2.6" fill="#ffffff" opacity="0.6" />
          </svg>
          {/* Layered frame: hairline + navy rule */}
          <div style={{ position: 'absolute', inset: 22, border: `2px solid ${NAVY}`, opacity: 0.9, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 30, border: '1px solid #c9bdf0', pointerEvents: 'none' }} />

          {/* Certificate ID top-left */}
          <div style={{ position: 'absolute', top: 48, left: 64, fontSize: 13, letterSpacing: 1.2, background: '#ffffff', padding: '5px 12px', border: '1px solid #ddd3f5', borderRadius: 20 }}>
            <span style={{ color: PURPLE, fontWeight: 700 }}>Certificate ID: </span>
            <span style={{ color: NAVY, fontWeight: 700 }}>{data.certificateId}</span>
          </div>

          {/* Logo top-center on a clean white medallion for guaranteed contrast */}
          <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              background: '#ffffff',
              border: '1px solid #e7e1f8',
              borderRadius: 18,
              padding: '10px 34px',
              boxShadow: '0 10px 30px rgba(32,43,104,0.14), 0 0 0 8px rgba(255,255,255,0.65)'
            }}>
              <img
                src="https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723"
                alt="SoSapient logo"
                style={{ height: 62, objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

          {/* Headings */}
          <div style={{ position: 'absolute', top: 172, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 54, fontWeight: 700, letterSpacing: 12, color: NAVY, marginLeft: 12 }}>
              CERTIFICATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 6 }}>
              <div style={{ width: 90, height: 1.5, background: PURPLE, opacity: 0.55 }} />
              <div style={{ fontSize: 13.5, letterSpacing: 5, color: PURPLE, fontWeight: 700 }}>
                OF COMPLETION
              </div>
              <div style={{ width: 90, height: 1.5, background: PURPLE, opacity: 0.55 }} />
            </div>
            <div style={{ fontSize: 12, letterSpacing: 4, color: '#8a86a8', fontWeight: 600, marginTop: 8 }}>
              PROUDLY PRESENTED TO
            </div>
          </div>

          {/* Candidate name — visual focal point */}
          <div style={{ position: 'absolute', top: 318, left: 0, right: 0, textAlign: 'center', padding: '0 80px' }}>
            <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: nameSize, color: NAVY, lineHeight: 1.15 }}>
              {fullName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4 }}>
              <div style={{ width: 60, height: 1.5, background: PURPLE, opacity: 0.55 }} />
              <div style={{ width: 10, height: 10, background: PURPLE, opacity: 0.55, transform: 'rotate(45deg)' }} />
              <div style={{ width: 300, height: 1.5, background: PURPLE, opacity: 0.55 }} />
              <div style={{ width: 10, height: 10, background: PURPLE, opacity: 0.55, transform: 'rotate(45deg)' }} />
              <div style={{ width: 60, height: 1.5, background: PURPLE, opacity: 0.55 }} />
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              position: 'absolute',
              top: 446,
              left: 0,
              right: 0,
              textAlign: 'center',
              padding: '0 120px',
              fontSize: 15,
              lineHeight: 1.65,
              color: INK,
            }}
          >
            <span style={{ fontStyle: 'italic' }}>
              This is to certify that the candidate has successfully completed{' '}
              <strong
                style={{
                  fontStyle: 'normal',
                  color: NAVY,
                  whiteSpace: 'nowrap',
                }}
              >
                {sentenceDuration(data.durationText)}
              </strong>{' '}
              of internship training as a{' '}
              <strong
                style={{
                  fontStyle: 'normal',
                  color: NAVY,
                  whiteSpace: 'nowrap',
                }}
              >
                {data.course}
              </strong>{' '}
              at{' '}
              <strong
                style={{
                  fontStyle: 'normal',
                  color: NAVY,
                }}
              >
                SOSAPIENT
              </strong>{' '}
              from{' '}
              <strong style={{ fontStyle: 'normal', color: NAVY }}>
                {formatDate(data.startDate)}
              </strong>{' '}
              to{' '}
              <strong style={{ fontStyle: 'normal', color: NAVY }}>
                {formatDate(data.endDate)}
              </strong>
              . During the internship, the candidate gained practical knowledge and
              hands-on experience in the respective field, demonstrated strong
              problem-solving skills, and contributed effectively to assigned tasks and
              projects. The candidate displayed professionalism, dedication, and a
              strong willingness to learn throughout the training period. We appreciate
              the candidate's valuable contribution and wish them continued success in
              their future career.
            </span>

            {data.college && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 13.5,
                  fontStyle: 'normal',
                  color: '#6d6890',
                  letterSpacing: 0.4,
                }}
              >
                {data.college}
              </div>
            )}
          </div>

          {/* Signatures */}
          <div style={{ position: 'absolute', bottom: 100, left: 150, right: 150, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <SignatureBlock name={data.hrHeadName} designation={data.hrHeadDesignation} signature={data.hrHeadSignature} />
            <SignatureBlock name={data.managerName} designation={data.managerDesignation} signature={data.managerSignature} />
          </div>

          {/* Verification URL + QR */}
          <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {data.qrDataUrl && (
              <span style={{ display: 'inline-block', background: '#ffffff', border: '1px solid #ddd3f5', borderRadius: 8, padding: 4 }}>
                <img src={data.qrDataUrl} alt="Verification QR code" style={{ width: 48, height: 48, display: 'block' }} />
              </span>
            )}
            <div style={{ fontSize: 12.5, color: PURPLE }}>
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
