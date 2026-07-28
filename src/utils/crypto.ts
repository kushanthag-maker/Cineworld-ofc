// Encryption & Obfuscation Utility for CINEWORLD Streaming & Download URLs

const SECRET_SALT = 'CINEWORLD_2026_STREAM_SECURE_ENCRYPTION_KEY_v2';

// Simple fast XOR cipher + URL safe Base64 encoding
export function encryptUrl(url: string, secretKey = SECRET_SALT): string {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('enc:')) return url; // Already encrypted

  try {
    let result = '';
    for (let i = 0; i < url.length; i++) {
      const charCode = url.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    // Convert to Base64
    const base64 = typeof btoa !== 'undefined' 
      ? btoa(result) 
      : Buffer.from(result, 'binary').toString('base64');
    
    // Replace standard base64 chars for URL safety
    const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `enc:${urlSafe}`;
  } catch (err) {
    console.warn('URL encryption fallback:', err);
    return url;
  }
}

export function decryptUrl(encryptedStr: string, secretKey = SECRET_SALT): string {
  if (!encryptedStr || typeof encryptedStr !== 'string') return '';
  if (!encryptedStr.startsWith('enc:')) return encryptedStr; // Plain URL

  try {
    const rawEnc = encryptedStr.slice(4);
    // Restore base64 standard chars
    let base64 = rawEnc.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const decoded = typeof atob !== 'undefined'
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString('binary');

    let originalUrl = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      originalUrl += String.fromCharCode(charCode);
    }
    return originalUrl;
  } catch (err) {
    console.warn('URL decryption error:', err);
    return encryptedStr;
  }
}

// Encrypt all sensitive streaming & download links on a movie object
export function encryptMovieData(movie: any): any {
  if (!movie) return movie;
  const clone = { ...movie };

  if (clone.streamUrl) {
    clone.streamUrl = encryptUrl(clone.streamUrl);
  }

  if (Array.isArray(clone.downloadOptions)) {
    clone.downloadOptions = clone.downloadOptions.map((opt: any) => ({
      ...opt,
      downloadUrl: opt.downloadUrl ? encryptUrl(opt.downloadUrl) : '',
      server2Url: opt.server2Url ? encryptUrl(opt.server2Url) : ''
    }));
  }

  if (Array.isArray(clone.episodes)) {
    clone.episodes = clone.episodes.map((ep: any) => ({
      ...ep,
      stream_url: ep.stream_url ? encryptUrl(ep.stream_url) : ''
    }));
  }

  return clone;
}

// Decrypt all sensitive streaming & download links on a movie object for client playback
export function decryptMovieData(movie: any): any {
  if (!movie) return movie;
  const clone = { ...movie };

  if (clone.streamUrl) {
    clone.streamUrl = decryptUrl(clone.streamUrl);
  }

  if (Array.isArray(clone.downloadOptions)) {
    clone.downloadOptions = clone.downloadOptions.map((opt: any) => ({
      ...opt,
      downloadUrl: opt.downloadUrl ? decryptUrl(opt.downloadUrl) : '',
      server2Url: opt.server2Url ? decryptUrl(opt.server2Url) : ''
    }));
  }

  if (Array.isArray(clone.episodes)) {
    clone.episodes = clone.episodes.map((ep: any) => ({
      ...ep,
      stream_url: ep.stream_url ? decryptUrl(ep.stream_url) : ''
    }));
  }

  return clone;
}
