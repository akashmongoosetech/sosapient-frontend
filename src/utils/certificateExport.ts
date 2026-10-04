import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export async function qrForUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { width: 220, margin: 1 });
}

function saveDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function downloadCertificatePng(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
  saveDataUrl(dataUrl, filename.endsWith('.png') ? filename : `${filename}.png`);
}

export async function downloadCertificateJpeg(node: HTMLElement, filename: string, extension: 'jpeg' | 'jpg' = 'jpeg'): Promise<void> {
  const dataUrl = await toJpeg(node, { pixelRatio: 2, quality: 0.95, cacheBust: true, backgroundColor: '#ffffff' });
  saveDataUrl(dataUrl, `${filename}.${extension}`);
}

export async function downloadCertificatePdf(node: HTMLElement, filename: string): Promise<void> {
  // A4 landscape (297 x 210mm); image keeps the template's exact aspect ratio.
  const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = 297;
  const pageH = 210;
  const margin = 10;
  const imgW = pageW - margin * 2;
  const imgH = (imgW * 794) / 1123;
  const y = (pageH - imgH) / 2;
  pdf.addImage(dataUrl, 'PNG', margin, y, imgW, imgH);
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
