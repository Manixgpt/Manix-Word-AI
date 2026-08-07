import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, PageOrientation } from 'docx';
import { WordDocument } from '../types';

/**
 * Parses and converts color formats like hex (#ff0000), rgb(255, 0, 0), or named colors into docx Hex strings (e.g., FF0000).
 */
function colorToHex(color: string): string | undefined {
  if (!color) return undefined;
  color = color.trim().toLowerCase();
  
  if (color.startsWith('#')) {
    let hex = color.substring(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return hex.toUpperCase();
  }
  
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
      const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
      const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
      return (r + g + b).toUpperCase();
    }
  }

  const colorMap: Record<string, string> = {
    red: 'FF0000',
    blue: '0000FF',
    green: '008000',
    black: '000000',
    white: 'FFFFFF',
    gray: '808080',
    grey: '808080',
    purple: '800080',
    yellow: 'FFFF00',
    navy: '000080',
    silver: 'C0C0C0',
    gold: 'D4AF37'
  };

  return colorMap[color] || undefined;
}

/**
 * Parses an inline style string into key-value pairs.
 */
function parseInlineStyle(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleStr) return styles;
  
  styleStr.split(';').forEach((pair) => {
    const idx = pair.indexOf(':');
    if (idx > -1) {
      const key = pair.substring(0, idx).trim().toLowerCase();
      const val = pair.substring(idx + 1).trim();
      styles[key] = val;
    }
  });
  return styles;
}

/**
 * Maps alignment keywords to docx AlignmentType.
 */
function getAlignment(textAlign?: string): any {
  if (!textAlign) return undefined;
  const align = textAlign.trim().toLowerCase();
  if (align === 'center') return AlignmentType.CENTER;
  if (align === 'right') return AlignmentType.END;
  if (align === 'justify') return AlignmentType.BOTH;
  return AlignmentType.START;
}

interface RunState {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  color?: string;
  shading?: string;
  size?: number;
  fontFamily?: string;
}

/**
 * Recursively parses HTML inline nodes (strong, u, em, span, text, br) into docx TextRuns.
 */
function parseHTMLToRuns(parentNode: Node, state: RunState = {}, rootFont?: string, rootSize?: number): TextRun[] {
  const runs: TextRun[] = [];

  parentNode.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) {
        runs.push(
          new TextRun({
            text: text,
            bold: state.bold,
            italics: state.italics,
            underline: state.underline ? {} : undefined,
            color: state.color,
            shading: state.shading ? { fill: state.shading } : undefined,
            font: state.fontFamily ? { name: state.fontFamily } : (rootFont ? { name: rootFont } : undefined),
            size: state.size || (rootSize ? rootSize * 2 : 22),
          })
        );
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      
      const elStyles = parseInlineStyle(el.getAttribute('style') || '');
      const elColorHex = colorToHex(elStyles['color'] || '');
      const elBgHex = colorToHex(elStyles['background-color'] || '');
      let elSize: number | undefined = undefined;
      
      if (elStyles['font-size']) {
        const sizePx = parseInt(elStyles['font-size'], 10);
        if (!isNaN(sizePx)) {
          elSize = Math.round(sizePx * 1.5); // Convert px to half-points
        }
      }

      // Handle breaks explicitly
      if (tagName === 'br') {
        runs.push(new TextRun({ break: 1 }));
        return;
      }

      // Inherit or override styling properties recursively
      const nextState: RunState = {
        bold: state.bold || tagName === 'strong' || tagName === 'b' || elStyles['font-weight'] === 'bold',
        italics: state.italics || tagName === 'em' || tagName === 'i' || elStyles['font-style'] === 'italic',
        underline: state.underline || tagName === 'u' || elStyles['text-decoration']?.includes('underline'),
        color: elColorHex || state.color,
        shading: elBgHex || state.shading,
        size: elSize || state.size,
        fontFamily: elStyles['font-family']?.replace(/['"]/g, '') || state.fontFamily,
      };

      runs.push(...parseHTMLToRuns(el, nextState, rootFont, rootSize));
    }
  });

  return runs;
}

/**
 * Core top-level blocks builder (Headers, Paragraphs, Lists, and styled Tables).
 */
function parseHTMLToBlocks(htmlContent: string, rootFont: string, rootSize: number): any[] {
  const blocks: any[] = [];
  const parser = new DOMParser();
  const parsed = parser.parseFromString(htmlContent, 'text/html');
  const body = parsed.body;

  let nextParaPageBreak = false;

  body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      const styleAttr = el.getAttribute('style') || '';
      const elStyles = parseInlineStyle(styleAttr);
      const alignment = getAlignment(elStyles['text-align'] || elStyles['justify-content']);

      // Track if it's a page break divider inserted by the repaginator
      if (el.getAttribute('data-page-break') === 'true' || el.classList.contains('page-break-divider')) {
        nextParaPageBreak = true;
        return;
      }

      if (['p', 'h1', 'h2', 'h3', 'h4', 'div', 'li', 'blockquote'].includes(tagName)) {
        let spacingProps: any = { after: 120 };
        let runOverrides: RunState = {};

        // Emulate headings styles precisely for Microsoft Word
        if (tagName === 'h1') {
          spacingProps = { before: 240, after: 120 };
          runOverrides = { bold: true, size: 36, color: '2B579A' }; // Word heading color fallback
        } else if (tagName === 'h2') {
          spacingProps = { before: 180, after: 80 };
          runOverrides = { bold: true, size: 28, color: '1E3A8A' };
        } else if (tagName === 'h3') {
          spacingProps = { before: 140, after: 60 };
          runOverrides = { bold: true, size: 22, color: '334155' };
        } else if (tagName === 'blockquote') {
          spacingProps = { before: 120, after: 120, left: 360 };
          runOverrides = { italics: true };
        }

        const runs = parseHTMLToRuns(el, runOverrides, rootFont, rootSize);
        if (runs.length === 0 && !el.textContent?.trim() && !nextParaPageBreak) {
          // Empty spacing line
          blocks.push(new Paragraph({
            spacing: { after: 120 }
          }));
          return;
        }

        const paragraphProps: any = {
          spacing: spacingProps,
          alignment: alignment,
          children: runs,
          pageBreakBefore: nextParaPageBreak ? true : undefined
        };

        if (tagName === 'li') {
          paragraphProps.bullet = { level: 0 };
        }

        blocks.push(new Paragraph(paragraphProps));
        nextParaPageBreak = false; // Reset page break flag after consumption
      } else if (tagName === 'table') {
        const rows: TableRow[] = [];
        const trs = el.querySelectorAll('tr');

        trs.forEach((tr) => {
          const cells: TableCell[] = [];
          const tds = tr.querySelectorAll('td, th');

          tds.forEach((td) => {
            const cellEl = td as HTMLElement;
            const cellStyleAttr = cellEl.getAttribute('style') || '';
            const cellStyles = parseInlineStyle(cellStyleAttr);
            const cellFillHex = colorToHex(cellStyles['background-color'] || '');

            const runs = parseHTMLToRuns(cellEl, {}, rootFont, rootSize);
            const cellParas = [new Paragraph({ children: runs })];

            cells.push(
              new TableCell({
                children: cellParas,
                shading: cellFillHex ? { fill: cellFillHex } : undefined,
                margins: {
                  top: 100,
                  bottom: 100,
                  left: 150,
                  right: 150
                }
              })
            );
          });

          if (cells.length > 0) {
            rows.push(new TableRow({ children: cells }));
          }
        });

        if (rows.length > 0) {
          blocks.push(new Table({ rows }));
        }
      } else if (tagName === 'ul' || tagName === 'ol') {
        el.childNodes.forEach((liNode) => {
          if (liNode.nodeType === Node.ELEMENT_NODE && (liNode as HTMLElement).tagName.toLowerCase() === 'li') {
            const liEl = liNode as HTMLElement;
            const liStyleAttr = liEl.getAttribute('style') || '';
            const liStyles = parseInlineStyle(liStyleAttr);
            const liAlign = getAlignment(liStyles['text-align']);
            const runs = parseHTMLToRuns(liEl, {}, rootFont, rootSize);

            blocks.push(new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 80 },
              alignment: liAlign,
              children: runs,
              pageBreakBefore: nextParaPageBreak ? true : undefined
            }));
            nextParaPageBreak = false;
          }
        });
      }
    }
  });

  // Handle ultimate empty doc fallback robustly
  if (blocks.length === 0) {
    blocks.push(new Paragraph({
      children: [new TextRun({ text: "Document Office", font: { name: rootFont }, size: rootSize * 2 })]
    }));
  }

  return blocks;
}

/**
 * Packs the custom document content structure and style into a real, compliant .docx file blob.
 */
export async function exportToDocx(docData: WordDocument): Promise<Blob> {
  const content = docData.content || "";
  const rootFont = docData.style.fontFamily || "Calibri";
  const rootSize = docData.style.fontSize || 11;

  // Real layout blocks with fonts, text formatting runs, lists, alignments, and shaded tables
  const docChildren = parseHTMLToBlocks(content, rootFont, rootSize);

  // Append visual watermark indicator if requested
  if (docData.watermark) {
    docChildren.unshift(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `[ FILIGRANE DE CONFIDENTIALITÉ : ${docData.watermark.toUpperCase()} ]`,
            bold: true,
            color: 'FF4500',
            size: 18,
            font: { name: rootFont }
          })
        ]
      })
    );
  }

  // Re-assemble the Microsoft Word document
  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: docData.style.margin === 'narrow' ? 720 : 1440,
              bottom: docData.style.margin === 'narrow' ? 720 : 1440,
              left: docData.style.margin === 'narrow' ? 720 : 1440,
              right: docData.style.margin === 'narrow' ? 720 : 1440,
            },
            size: {
              width: docData.style.orientation === 'portrait' ? 11906 : 16838,
              height: docData.style.orientation === 'portrait' ? 16838 : 11906,
              orientation: docData.style.orientation === 'portrait' ? PageOrientation.PORTRAIT : PageOrientation.LANDSCAPE,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(wordDoc);
}
