export interface FormattedStream {
  embedUrl: string;
  directUrl?: string;
  isIframe: boolean;
  isDirectVideo: boolean;
}

export function getDirectDownloadUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Convert Google Drive view link to direct download link
  if (trimmed.includes('drive.google.com/file/d/')) {
    const parts = trimmed.split('drive.google.com/file/d/');
    if (parts[1]) {
      const fileId = parts[1].split('/')[0];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  // Convert Dropbox share link to direct download link
  if (trimmed.includes('dropbox.com/') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'dl=1');
  }

  // Clean up Pixeldrain download parameter if present for direct link
  if (trimmed.includes('pixeldrain.com')) {
    const pdMatch = trimmed.match(/pixeldrain\.com\/(?:api\/file\/|u\/)([a-zA-Z0-9_-]+)/i);
    if (pdMatch && pdMatch[1]) {
      return `https://pixeldrain.com/api/file/${pdMatch[1]}`;
    }
  }

  return trimmed;
}

export function formatStreamUrl(url: string | undefined | null): FormattedStream {
  if (!url) {
    return { embedUrl: '', isIframe: false, isDirectVideo: false };
  }

  const trimmed = url.trim();

  // Pixeldrain links (e.g., https://pixeldrain.com/api/file/oNhYjVmP or https://pixeldrain.com/u/oNhYjVmP)
  if (trimmed.includes('pixeldrain.com')) {
    const pdMatch = trimmed.match(/pixeldrain\.com\/(?:api\/file\/|u\/)([a-zA-Z0-9_-]+)/i);
    if (pdMatch && pdMatch[1]) {
      const fileId = pdMatch[1];
      return {
        embedUrl: `https://pixeldrain.com/u/${fileId}?embed`,
        directUrl: `https://pixeldrain.com/api/file/${fileId}`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // Sinhalasub DLServer Links
  if (trimmed.includes('sinhalasub.lk')) {
    return {
      embedUrl: trimmed,
      directUrl: trimmed,
      isIframe: true,
      isDirectVideo: false
    };
  }

  // YouTube Links
  if (trimmed.includes('youtube.com/watch') || trimmed.includes('youtu.be/')) {
    let videoId = '';
    if (trimmed.includes('youtu.be/')) {
      videoId = trimmed.split('youtu.be/')[1]?.split('?')[0] || '';
    } else {
      try {
        const urlObj = new URL(trimmed);
        videoId = urlObj.searchParams.get('v') || '';
      } catch {
        videoId = '';
      }
    }
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`,
      directUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`,
      isIframe: true,
      isDirectVideo: false
    };
  }

  // Google Drive
  if (trimmed.includes('drive.google.com/file/d/')) {
    const parts = trimmed.split('drive.google.com/file/d/');
    if (parts[1]) {
      const fileId = parts[1].split('/')[0];
      return {
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        directUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // Direct MP4 / WEBM / MKV Video Files
  if (/\.(mp4|webm|mkv|mov|m3u8)(\?.*)?$/i.test(trimmed) || trimmed.includes('cdn.sinhalacartoons.com') || trimmed.includes('dl.sinhalacartoons.com')) {
    return {
      embedUrl: trimmed,
      directUrl: trimmed,
      isIframe: false,
      isDirectVideo: true
    };
  }

  // Default Iframe embed fallback
  return {
    embedUrl: trimmed,
    directUrl: trimmed,
    isIframe: true,
    isDirectVideo: false
  };
}

