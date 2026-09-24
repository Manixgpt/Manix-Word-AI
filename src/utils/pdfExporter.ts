import { jsPDF } from 'jspdf';
import { WordDocument } from '../types';

/**
 * Parses and generates a real, high-quality styled A4 PDF document from the rich text editor's content on the client-side.
 */
export function exportToPdf(docData: WordDocument): void {
  try {
    const docPdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const content = docData.content || "";
    const title = docData.title || "Document";

    // Standard A4 dimensions in pt: 595.28 x 841.89
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const marginX = 54; // A standard 0.75-inch/54pt margin
    const maxLineWidth = pageWidth - marginX * 2;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const textLines: string[] = [];
    // Selecting all block-level elements
    const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, li, tr, blockquote, div');

    const sanitize = (str: string) => {
      return str
        .replace(/[\u2018\u2019\u02BC]/g, "'")
        .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u00A0\u202F]/g, ' ')
        .replace(/[\u2026]/g, '...');
    };

    if (elements.length === 0) {
      const text = sanitize(tempDiv.innerText || tempDiv.textContent || '');
      textLines.push(...text.split('\n'));
    } else {
      elements.forEach((el) => {
        const tagName = el.tagName.toLowerCase();
        
        // Skip divs that contain other visual tags to prevent duplicate texts
        if (tagName === 'div' && el.querySelector('p, h1, h2, h3, h4, h5, li, tr, blockquote')) {
          return;
        }

        const rawText = el.textContent?.trim() || '';
        const text = sanitize(rawText);
        if (!text && tagName !== 'tr') return;

        if (tagName === 'h1') {
          textLines.push(`TITLE: ${text}`);
        } else if (tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5') {
          textLines.push(`SUBTITLE: ${text}`);
        } else if (tagName === 'li') {
          textLines.push(`LIST_ITEM: ${text}`);
        } else if (tagName === 'tr') {
          const cells = Array.from(el.querySelectorAll('td, th')).map(c => sanitize(c.textContent?.trim() || ''));
          if (cells.length > 0) {
            textLines.push(`TABLE: | ${cells.join(' | ')} |`);
          }
        } else if (tagName === 'blockquote') {
          textLines.push(`QUOTE: ${text}`);
        } else {
          // Avoid duplicating li element text inside parent UL
          if (el.parentElement?.tagName.toLowerCase() === 'li') return;
          textLines.push(text);
        }
      });
    }

    let y = 70;

    // Helper to draw clean corporate headers
    const drawHeader = () => {
      // Background Accent (very subtle top bar)
      docPdf.setFillColor(43, 87, 154); // Microsoft Word Blue (#2b579a)
      docPdf.rect(marginX, 25, maxLineWidth, 2, 'F');

      // Title header
      docPdf.setFont('Helvetica', 'bold');
      docPdf.setFontSize(8.5);
      docPdf.setTextColor(100, 116, 139); // slate-500
      
      const headerTitle = title.toUpperCase().replace(/\.DOCX$/i, '').substring(0, 50);
      docPdf.text(headerTitle, marginX, 39);

      // Accent right-aligned subtitle
      docPdf.setFont('Helvetica', 'normal');
      docPdf.setTextColor(148, 163, 184); // slate-400
      docPdf.text("MANIXGPT OFFICE EXPORT", pageWidth - marginX - 110, 39);
    };

    drawHeader();

    textLines.forEach((line) => {
      // Guard page height limit
      if (y > pageHeight - 75) {
        docPdf.addPage();
        y = 70;
        drawHeader();
      }

      if (line.startsWith('TITLE: ')) {
        const titleText = line.replace('TITLE: ', '');
        docPdf.setFont('Helvetica', 'bold');
        docPdf.setFontSize(20);
        docPdf.setTextColor(43, 87, 154); // Blue color (#2b579a)
        y += 12;

        const splitText = docPdf.splitTextToSize(titleText, maxLineWidth);
        docPdf.text(splitText, marginX, y);
        y += splitText.length * 24 + 12;
      } else if (line.startsWith('SUBTITLE: ')) {
        const subText = line.replace('SUBTITLE: ', '');
        docPdf.setFont('Helvetica', 'bold');
        docPdf.setFontSize(14);
        docPdf.setTextColor(71, 85, 105); // Slate-600
        y += 8;

        const splitText = docPdf.splitTextToSize(subText, maxLineWidth);
        docPdf.text(splitText, marginX, y);
        y += splitText.length * 18 + 10;
      } else if (line.startsWith('LIST_ITEM: ')) {
        const itemText = line.replace('LIST_ITEM: ', '');
        docPdf.setFont('Helvetica', 'normal');
        docPdf.setFontSize(10.5);
        docPdf.setTextColor(51, 65, 85); // Slate-700
        
        // Custom elegant bullet drawing
        docPdf.setFillColor(43, 87, 154);
        docPdf.circle(marginX + 5, y - 3, 2, 'F');

        const splitText = docPdf.splitTextToSize(itemText, maxLineWidth - 15);
        docPdf.text(splitText, marginX + 15, y);
        y += splitText.length * 15 + 6;
      } else if (line.startsWith('QUOTE: ')) {
        const quoteText = line.replace('QUOTE: ', '');
        docPdf.setFont('Helvetica', 'italic');
        docPdf.setFontSize(10.5);
        docPdf.setTextColor(100, 116, 139); // Slate-500

        // Subtle quote bar
        docPdf.setFillColor(203, 213, 225); // slate-300
        const splitText = docPdf.splitTextToSize(quoteText, maxLineWidth - 20);
        docPdf.rect(marginX, y - 9, 3, splitText.length * 15, 'F');
        docPdf.text(splitText, marginX + 15, y);
        y += splitText.length * 15 + 10;
      } else if (line.startsWith('TABLE: ')) {
        const tableText = line.replace('TABLE: ', '');
        docPdf.setFont('Courier', 'bold');
        docPdf.setFontSize(9);
        docPdf.setTextColor(30, 41, 59); // Slate-800
        y += 4;

        const splitText = docPdf.splitTextToSize(tableText, maxLineWidth);
        docPdf.text(splitText, marginX, y);
        y += splitText.length * 13 + 8;
      } else {
        // Standard normal text paragraph
        docPdf.setFont('Helvetica', 'normal');
        docPdf.setFontSize(10.5);
        docPdf.setTextColor(51, 65, 85); // Slate-700

        const splitText = docPdf.splitTextToSize(line, maxLineWidth);
        docPdf.text(splitText, marginX, y);
        y += splitText.length * 15 + 8;
      }
    });

    // Compute and draw total page numbers dynamically at the end using public method API
    const totalPages = docPdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      docPdf.setPage(i);
      docPdf.setFont('Helvetica', 'normal');
      docPdf.setFontSize(8);
      docPdf.setTextColor(148, 163, 184); // Slate-400
      
      // Footer text line
      docPdf.text(`Page ${i} sur ${totalPages}`, pageWidth - marginX - 65, pageHeight - 25);
      docPdf.text("Rapport généré par ManixGPT Office", marginX, pageHeight - 25);
    }

    const cleanName = title.trim().replace(/\.docx$/i, '').replace(/\.pdf$/i, '') + '.pdf';
    docPdf.save(cleanName);

    // Show temporary visual feedback
    const toast = document.createElement('div');
    toast.textContent = `Document PDF exporté avec succès : ${cleanName}`;
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#f8fafc;padding:10px 20px;border-radius:9999px;font-size:12px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.3);z-index:99999;transition:opacity 0.3s;';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  } catch (err: any) {
    console.error("PDF Export error:", err);
    alert('Erreur lors du téléchargement PDF : ' + err.message);
  }
}
