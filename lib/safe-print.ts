'use client';

/**
 * Safely invokes browser printing or triggers a clean document download
 * when running inside an embedded iframe with modal restrictions.
 */
export function safePrintOrDownload(
  fileName: string,
  getTextContent: () => string
): void {
  const textContent = getTextContent();
  const htmlContent = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; white-space: pre-wrap; padding: 20px; line-height: 1.5; color: #1B2A4A; background: #fff; }
  </style>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 350); };</script>
</head>
<body>${textContent}</body>
</html>`;

  executePrintWithFallback(fileName.replace(/\\.txt$/, '.html'), htmlContent, textContent);
}

/**
 * Generates an in-memory plain text file download without opening popups or triggering browser lockers.
 */
export function downloadTextFile(fileName: string, textContent: string): void {
  if (typeof window === 'undefined') return;
  try {
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  } catch (err) {
    console.error('Failed to trigger file download', err);
  }
}

/**
 * Downloads a self-contained, print-ready HTML card that auto-invokes the native print dialog
 * when opened in a full browser tab.
 */
export function downloadHtmlFile(fileName: string, htmlContent: string): void {
  if (typeof window === 'undefined') return;
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  } catch (err) {
    console.error('Failed to trigger HTML card download', err);
  }
}

/**
 * Attempts to trigger the browser's native print menu via hidden iframe and window.print(),
 * while handling sandboxed iframe restrictions cleanly.
 */
export function executePrintWithFallback(
  fileName: string,
  htmlContent: string,
  textContent: string,
  onNotify?: (method: 'native' | 'download') => void
): void {
  if (typeof window === 'undefined') return;

  let printInvoked = false;

  // 1. Attempt printing via an isolated hidden iframe
  try {
    const existing = document.getElementById('udss-print-frame');
    if (existing) {
      document.body.removeChild(existing);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'udss-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          printInvoked = true;
          onNotify?.('native');
        } catch (iframeErr) {
          console.warn('Iframe print invocation restricted:', iframeErr);
        }
      }, 250);
    }
  } catch (e) {
    console.warn('Iframe setup restricted by sandbox:', e);
  }

  // 2. Also try direct window.print() if iframe didn't fire
  if (!printInvoked) {
    try {
      if (typeof window.print === 'function') {
        window.print();
        printInvoked = true;
        onNotify?.('native');
      }
    } catch (e) {
      console.warn('window.print() restricted by environment sandbox/locker:', e);
    }
  }

  // 3. In sandboxed iframe environments where modal print dialogs are silently ignored or blocked,
  // ensure the user receives the printable HTML document immediately so their print request succeeds!
  setTimeout(() => {
    downloadHtmlFile(fileName, htmlContent);
    onNotify?.('download');
  }, 350);
}

/**
 * Formats a physical emergency or utility card into a clean, standalone, printable HTML document.
 */
export function buildCardHtml(params: {
  title: string;
  category: string;
  prepId: string;
  fields: { label: string; value: string; hint?: string }[];
}): string {
  const fieldsHtml = params.fields
    .map(
      (f) => `
    <div style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed #d0d0d0;">
      <div style="font-family: monospace; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #1B2A4A; margin-bottom: 4px;">
        ${f.label}
      </div>
      <div style="font-size: 14px; font-weight: 600; color: #111; line-height: 1.4; background: #fafaf8; padding: 8px 10px; border-left: 3px solid #1B2A4A;">
        ${f.value || 'Not specified'}
      </div>
      ${f.hint ? `<div style="font-size: 11px; color: #666; margin-top: 3px; font-style: italic;">${f.hint}</div>` : ''}
    </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>${params.title} - UDSS</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111;
      margin: 0;
      padding: 16px;
      background: #fff;
    }
    .card-wrap {
      max-width: 650px;
      margin: 0 auto;
      border: 3px solid #1B2A4A;
      padding: 24px;
      background: #fff;
    }
    .header-bar {
      border-bottom: 3px solid #8B1A1A;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .badge {
      display: inline-block;
      font-family: monospace;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #8B1A1A;
    }
    h1 {
      font-family: "Georgia", serif;
      font-size: 22px;
      color: #1B2A4A;
      margin: 6px 0 4px 0;
      line-height: 1.2;
    }
    .sub {
      font-size: 12px;
      color: #555;
      font-family: monospace;
    }
    .print-tip {
      background: #F5F5F0;
      border: 1px solid #D0D0D0;
      padding: 8px 12px;
      font-size: 11px;
      color: #333;
      margin-bottom: 16px;
      font-family: monospace;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 2px solid #1B2A4A;
      display: flex;
      justify-content: space-between;
      font-family: monospace;
      font-size: 10px;
      color: #555;
    }
    @media print {
      body { padding: 0; }
      .print-tip { display: none !important; }
    }
  </style>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try { window.print(); } catch (e) {}
      }, 350);
    });
  </script>
</head>
<body>
  <div class="card-wrap">
    <div class="print-tip">
      OFFICIAL UDSS PRINTABLE CARD • Press Ctrl+P (or Cmd+P) to print • If possible laminate cards
    </div>
    <div class="header-bar">
      <img src="/assets/aistudio/Logo_6a1e58a5.webp" alt="Universal Defence &amp; Security Solutions" style="height: 36px; width: auto; margin-bottom: 8px; display: block;" />
      <div class="badge">Universal Defence and Security Solutions (UDSS) • ${params.category}</div>
      <h1>${params.title}</h1>
      <div class="sub">Household Prep ID: ${params.prepId} • Issued from 33 Cannon St, London EC4M 5SB</div>
    </div>
    <div class="content">
      ${fieldsHtml}
    </div>
    <div style="margin-top: 14px; padding: 8px 12px; background: #FAF9F5; border: 1px dashed #1B2A4A; font-family: monospace; font-size: 11px; color: #1B2A4A; text-align: center;">
      <strong>DURABILITY ADVISORY:</strong> If possible laminate cards to protect against damp, water ingress, and wallet wear.
    </div>
    <div class="footer">
      <span>UDSS Domestic Civil Contingency Programme</span>
      <span>33 Cannon St, London EC4M 5SB</span>
    </div>
  </div>
</body>
</html>`;
}
