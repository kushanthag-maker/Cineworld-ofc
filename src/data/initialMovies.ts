import { Movie } from '../types';

export const initialMovies: Movie[] = [
  {
    id: 'ben-10-af-s3',
    title: 'Ben 10: Alien Force Season 03',
    originalTitle: 'Ben 10: Alien Force Season 03 – සිංහල හඩකැවූ',
    releaseYear: 2024,
    duration: '17 Episodes',
    rating: 8.8,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'Ben Tennyson is back with upgraded alien powers in full Sinhala Dubbed HD audio. Watch all 17 episodes online or download with high-speed direct server links.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-3.png',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-3.png',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 1420,
    downloadsCount: 890,
    episodes: [
      { episode: '01', title: 'Episode 01 - Vengeance of Vilgax Part 1', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4' },
      { episode: '02', title: 'Episode 02 - Vengeance of Vilgax Part 2', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4' },
      { episode: '03', title: 'Episode 03 - Inferno', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E3.mp4' },
      { episode: '04', title: 'Episode 04 - Simple', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E4.mp4' },
      { episode: '05', title: 'Episode 05 - Vreedle Vreedle', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E5.mp4' }
    ],
    downloadOptions: [
      {
        id: 'opt-b10-1',
        quality: '1080p Episode 01 Direct',
        resolution: '1920x1080',
        size: '180 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://dl.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
        server2Url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
        server1Name: 'Server 1 High-Speed R2',
        server2Name: 'Server 2 Direct CDN'
      },
      {
        id: 'opt-b10-2',
        quality: '1080p Episode 02 Direct',
        resolution: '1920x1080',
        size: '185 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://dl.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4',
        server2Url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4',
        server1Name: 'Server 1 High-Speed R2',
        server2Name: 'Server 2 Direct CDN'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

