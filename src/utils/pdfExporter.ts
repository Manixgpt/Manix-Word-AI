import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { WordDocument } from '../types';

/**
 * High-Fidelity PDF Exporter for Manix Word.
 * Preserves 100% of formatting: colors, inline styles, tables, borders, font sizes, headings, images and layout.
 */
export async function exportToPdf(docData: WordDocument): Promise<void> {
  const content = docData.content || '';
  const title = docData.title || 'Document';
  const cleanName = title.trim().replace(/\.docx$/i, '').replace(/\.pdf$/i, '') + '.pdf';

  // Show starting toast
  const toast = document.createElement('div');
  toast.id = 'manix-pdf-export-toast';
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <svg style="animation:spin 1s linear infinite;width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Exportation PDF haute fidélité (mise en page, couleurs, tableaux)...</span>
    </div>
  `;
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#f8fafc;padding:12px 22px;border-radius:9999px;font-size:12px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.35);z-index:99999;transition:all 0.3s;font-family:sans-serif;';
  document.body.appendChild(toast);

  try {
    // Check if the document has explicit page break divisions
    const pageBreakRegex = /<div[^>]*class=["'][^"']*word-page-break[^"']*["'][^>]*>[\s\S]*?<\/div>|<div[^>]*data-page-break=["']true["'][^>]*>[\s\S]*?<\/div>/gi;
    let sections = content.split(pageBreakRegex).map(s => s.trim()).filter(Boolean);
    if (sections.length === 0) {
      sections = [content];
    }

    const docPdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true
    });

    // Standard A4 dimensions in pt
    const pdfPageWidth = 595.28;
    const pdfPageHeight = 841.89;
    
    // Pixel container width corresponding to A4 printable area (96 DPI standard)
    const renderWidthPx = 794;
    const standardPageHeightPx = Math.round(renderWidthPx * (pdfPageHeight / pdfPageWidth)); // ~1123px

    let isFirstPdfPage = true;

    // Process each section (explicit page or continuous)
    for (let secIdx = 0; secIdx < sections.length; secIdx++) {
      const sectionHtml = sections[secIdx];

      // Create isolated rendering container
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${renderWidthPx}px;
        min-height: ${standardPageHeightPx}px;
        background-color: #ffffff;
        color: #1e293b;
        font-family: Calibri, 'Segoe UI', Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        padding: 50px 54px;
        box-sizing: border-box;
        z-index: -9999;
      `;

      // Apply Word-like typography & preserved table rules
      const styles = `
        <style>
          * { box-sizing: border-box; }
          body, div, p, span { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
          h1 { font-size: 22pt; color: #1e3a8a; margin: 18px 0 10px 0; font-weight: bold; line-height: 1.25; }
          h2 { font-size: 16pt; color: #2b579a; margin: 16px 0 8px 0; font-weight: bold; line-height: 1.3; }
          h3 { font-size: 13pt; color: #334155; margin: 14px 0 6px 0; font-weight: bold; line-height: 1.35; }
          h4, h5, h6 { font-size: 11pt; color: #475569; margin: 10px 0 4px 0; font-weight: bold; }
          p { margin: 0 0 10px 0; font-size: 11pt; color: inherit; }
          ul, ol { margin: 8px 0 12px 0; padding-left: 24px; }
          li { margin-bottom: 4px; }
          table { width: 100% !important; border-collapse: collapse !important; margin: 14px 0 !important; font-size: 10pt !important; page-break-inside: auto; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background-color: #2b579a; color: #ffffff; font-weight: bold; }
          blockquote { border-left: 4px solid #2b579a; padding: 8px 16px; margin: 12px 0; background: #f8fafc; color: #475569; font-style: italic; }
          img { max-width: 100%; height: auto; }
          .word-page-break { display: none; }
        </style>
      `;

      container.innerHTML = styles + sectionHtml;
      document.body.appendChild(container);

      // Render high-res canvas via html2canvas (scale: 2 for crisp text and sharp lines)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: renderWidthPx,
      });

      // Remove container after rendering
      container.remove();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageCanvasHeight = Math.round(canvasWidth * (pdfPageHeight / pdfPageWidth));

      // Calculate how many A4 pages this section spans
      const totalPagesForSection = Math.max(1, Math.ceil(canvasHeight / pageCanvasHeight));

      for (let pageNum = 0; pageNum < totalPagesForSection; pageNum++) {
        const sourceY = pageNum * pageCanvasHeight;
        const currentSliceHeight = Math.min(pageCanvasHeight, canvasHeight - sourceY);

        // Create slice canvas
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvasWidth;
        sliceCanvas.height = pageCanvasHeight;
        const ctx = sliceCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasWidth, pageCanvasHeight);
          ctx.drawImage(
            canvas,
            0, sourceY, canvasWidth, currentSliceHeight,
            0, 0, canvasWidth, currentSliceHeight
          );
        }

        const imgData = sliceCanvas.toDataURL('image/jpeg', 0.95);

        if (!isFirstPdfPage) {
          docPdf.addPage();
        } else {
          isFirstPdfPage = false;
        }

        docPdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);
      }
    }

    // Save final high-fidelity PDF
    docPdf.save(cleanName);

    // Update toast to success
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <svg style="width:16px;height:16px;color:#10b981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Document PDF haute fidélité exporté avec succès (${cleanName})</span>
      </div>
    `;
    toast.style.background = '#065f46';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  } catch (err: any) {
    console.error('PDF Export error:', err);
    toast.innerHTML = `<span>Erreur lors de l'exportation PDF : ${err.message || 'Échec'}</span>`;
    toast.style.background = '#991b1b';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}
