export interface FormattedStream {
  embedUrl: string;
  isIframe: boolean;
  isDirectVideo: boolean;
}

export function formatStreamUrl(url: string | undefined | null): FormattedStream {
  if (!url) {
    return { embedUrl: '', isIframe: false, isDirectVideo: false };
  }

  const trimmed = url.trim();

  // 1. YouTube watch link (https://www.youtube.com/watch?v=XXXXX)
  if (trimmed.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(trimmed);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return {
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
          isIframe: true,
          isDirectVideo: false
        };
      }
    } catch (e) {
      const match = trimmed.match(/v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return {
          embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`,
          isIframe: true,
          isDirectVideo: false
        };
      }
    }
  }

  // 2. YouTube short link (https://youtu.be/XXXXX)
  if (trimmed.includes('youtu.be/')) {
    const parts = trimmed.split('youtu.be/');
    if (parts[1]) {
      const videoId = parts[1].split('?')[0].split('/')[0];
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // 3. YouTube Shorts (https://www.youtube.com/shorts/XXXXX)
  if (trimmed.includes('youtube.com/shorts/')) {
    const parts = trimmed.split('youtube.com/shorts/');
    if (parts[1]) {
      const videoId = parts[1].split('?')[0].split('/')[0];
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // 4. Google Drive View/Share Link (https://drive.google.com/file/d/FILE_ID/view)
  if (trimmed.includes('drive.google.com/file/d/')) {
    const parts = trimmed.split('drive.google.com/file/d/');
    if (parts[1]) {
      const fileId = parts[1].split('/')[0];
      return {
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // 5. Vimeo
  if (trimmed.includes('vimeo.com/') && !trimmed.includes('player.vimeo.com')) {
    const parts = trimmed.split('vimeo.com/');
    if (parts[1]) {
      const videoId = parts[1].split('?')[0].split('/')[0];
      return {
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // 6. OK.ru
  if (trimmed.includes('ok.ru/video/') && !trimmed.includes('ok.ru/videoembed/')) {
    const parts = trimmed.split('ok.ru/video/');
    if (parts[1]) {
      const videoId = parts[1].split('?')[0].split('/')[0];
      return {
        embedUrl: `https://ok.ru/videoembed/${videoId}`,
        isIframe: true,
        isDirectVideo: false
      };
    }
  }

  // 7. General Iframe embed links
  if (
    trimmed.includes('/embed/') ||
    trimmed.includes('/preview') ||
    trimmed.includes('player.') ||
    trimmed.includes('vidsrc.') ||
    trimmed.includes('embed')
  ) {
    return {
      embedUrl: trimmed,
      isIframe: true,
      isDirectVideo: false
    };
  }

  // 8. Direct Video files (.mp4, .webm, .mkv, .m3u8, etc)
  return {
    embedUrl: trimmed,
    isIframe: false,
    isDirectVideo: true
  };
}
