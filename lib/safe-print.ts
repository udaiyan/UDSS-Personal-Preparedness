'use client';

/**
 * Safely invokes window.print() or falls back to a clean file download if
 * the browser locker / sandboxed iframe restricts modal print dialogs.
 */
export function safePrintOrDownload(
  fileName: string,
  getTextContent: () => string
): void {
  let printed = false;
  try {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
      printed = true;
    }
  } catch (err) {
    console.warn(
      'window.print() restricted by environment locker / iframe sandbox. Falling back to document export.',
      err
    );
  }

  if (!printed) {
    downloadTextFile(fileName, getTextContent());
  }
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
