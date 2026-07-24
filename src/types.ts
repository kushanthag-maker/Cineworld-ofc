export interface DownloadOption {
  id: string;
  quality: string;
  resolution: string;
  size: string;
  format: string;
  downloadUrl: string; // Server 1 Direct Link
  server2Url?: string; // Server 2 Backup Mirror Link
  directServerName?: string;
  server1Name?: string;
  server2Name?: string;
}

export interface Episode {
  episode: string;
  title: string;
  stream_url: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  releaseYear: number;
  duration: string;
  rating: number;
  genres: string[];
  director: string;
  cast: string[];
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  streamUrl: string;
  category: 'Sinhala Subbed' | 'Sinhala Dubbed' | 'Hollywood' | 'Bollywood' | 'Tamil / South' | 'Animation';
  language: string;
  hasSinhalaSub: boolean;
  quality: string;
  viewsCount: number;
  downloadsCount: number;
  downloadOptions?: DownloadOption[];
  episodes?: Episode[];
  trailerUrl?: string;
  imdbId?: string;
  createdAt: string;
}

export interface MovieRequest {
  id: string;
  movieTitle: string;
  category: string;
  requestedBy: string;
  whatsappNumber?: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  isActive: boolean;
  createdAt: string;
}

export interface MovieComment {
  id: string;
  movieId: string;
  userName: string;
  avatarBg?: string;
  comment: string;
  rating: number;
  likes: number;
  createdAt: string;
}
