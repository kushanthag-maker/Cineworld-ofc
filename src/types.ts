export type Quality = '4K Ultra HD' | '1080p Full HD' | '720p HD' | '480p SD' | 'CAM / HD-CAM';

export type LanguageOption = 'Sinhala Subtitles' | 'Sinhala Dubbed' | 'English' | 'Tamil' | 'Hindi' | 'Malayalam' | 'Korean';

export interface DownloadOption {
  id: string;
  quality: Quality;
  size: string;
  resolution: string;
  format: string;
  downloadUrl: string;
  directServerName?: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string; // Sinhala or native name (e.g., සිංහල උපසිරැසි සමඟ)
  slug: string;
  posterUrl: string;
  backdropUrl: string;
  synopsis: string;
  releaseYear: number;
  duration: string;
  rating: number; // e.g. 8.4
  genres: string[];
  type: 'Movie' | 'TV Series' | 'Teledrama' | 'Short Film';
  hasSinhalaSub: boolean;
  isSinhalaDubbed: boolean;
  featured: boolean;
  trending: boolean;
  quality: Quality;
  director: string;
  cast: string[];
  trailerUrl: string; // YouTube embed or video URL
  streamUrl: string; // Direct MP4 or iframe embed URL for streaming
  downloadOptions: DownloadOption[];
  viewsCount: number;
  downloadsCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  movieId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MovieRequest {
  id: string;
  movieName: string;
  language: string;
  userEmail?: string;
  notes?: string;
  status: 'Pending' | 'Added' | 'Rejected';
  createdAt: string;
}

export interface SiteNotice {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'update' | 'alert';
  createdAt: string;
  active: boolean;
}
