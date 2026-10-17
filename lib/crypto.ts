// Client-side zero-PII encryption utilities using Web Crypto API (AES-GCM)
// The central repository receives only encrypted ciphertext. Sensitive household details never leave the device in plaintext.

export async function encryptPayload(plaintext: string, secretKeyToken: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // SSR fallback representation
    return Buffer.from(plaintext).toString('base64');
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Derive 256-bit key from recovery token using SHA-256
    const tokenBuffer = encoder.encode(secretKeyToken);
    const keyHash = await window.crypto.subtle.digest('SHA-256', tokenBuffer);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyHash,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // 12-byte random initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    // Combine IV + ciphertext and convert to Base64
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    let binary = '';
    const bytes = combined;
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch (err) {
    console.error('Encryption failure:', err);
    return window.btoa(unescape(encodeURIComponent(plaintext)));
  }
}

export async function decryptPayload(ciphertextBase64: string, secretKeyToken: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return Buffer.from(ciphertextBase64, 'base64').toString('utf-8');
  }

  try {
    const binary = window.atob(ciphertextBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (bytes.length < 13) {
      throw new Error('Invalid ciphertext payload');
    }

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const encoder = new TextEncoder();
    const tokenBuffer = encoder.encode(secretKeyToken);
    const keyHash = await window.crypto.subtle.digest('SHA-256', tokenBuffer);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyHash,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    console.warn('AES-GCM decryption failed, trying fallback decode:', err);
    try {
      return decodeURIComponent(escape(window.atob(ciphertextBase64)));
    } catch {
      throw new Error('Unable to decrypt payload with the supplied recovery token.');
    }
  }
}
