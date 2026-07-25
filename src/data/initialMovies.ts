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
// === 5 NEW SERIES WITH DIRECT MP4 LINKS ===
  {
    id: 'ben-10-ua-s3',
    title: 'Ben 10: Ultimate Alien Season 03 Sinhala Dubbed- සිංහල හඩකැවූ',
    originalTitle: 'Ben 10: Ultimate Alien Season 03 – සිංහල හඩکැවූ',
    releaseYear: 2010,
    duration: '13 Episodes',
    rating: 8.2,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'With his secret identity now revealed to the world, Ben Tennyson continues to fight evil as a superhero with the help of the newly acquired Ultimatrix. Full Sinhala Dubbed HD.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/07/SEASON-1-1.jpg',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/07/SEASON-1-1.jpg',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 980,
    downloadsCount: 650,
    episodes: [
      { episode: '01', title: 'Episode 01', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E1.mp4' },
      { episode: '02', title: 'Episode 02', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E2.mp4' },
      { episode: '03', title: 'Episode 03', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E3.mp4' },
      { episode: '04', title: 'Episode 04', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E4.mp4' },
      { episode: '05', title: 'Episode 05', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E5.mp4' }
    ],
    downloadOptions: [
      { id: 'ua-s3-1080', quality: '1080p', resolution: '1920x1080', size: '350MB', format: 'MP4', downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S3//B10UAS3E1.mp4', server2Url: '', server1Name: 'Main Server', server2Name: 'Backup Server' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ben-10-ua-s2',
    title: 'Ben 10: Ultimate Alien Season 02 Sinhala Dubbed- සිංහල හඩکැවූ',
    originalTitle: 'Ben 10: Ultimate Alien Season 02 – සිංහල හඩکැවූ',
    releaseYear: 2009,
    duration: 'Multiple Episodes',
    rating: 8.2,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'Ben Tennyson is back with upgraded alien powers in full Sinhala Dubbed HD audio.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/07/SEASON-1.jpg',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/07/SEASON-1.jpg',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 850,
    downloadsCount: 520,
    episodes: [
      { episode: '01', title: 'Episode 01', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E1.mp4' },
      { episode: '02', title: 'Episode 02', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E2.mp4' },
      { episode: '03', title: 'Episode 03', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E3.mp4' },
      { episode: '04', title: 'Episode 04', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E4.mp4' },
      { episode: '05', title: 'Episode 05', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E5.mp4' }
    ],
    downloadOptions: [
      { id: 'ua-s2-1080', quality: '1080p', resolution: '1920x1080', size: '320MB', format: 'MP4', downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S2//B10UAS2E1.mp4', server2Url: '', server1Name: 'Main Server', server2Name: 'Backup Server' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ben-10-ua-s1',
    title: 'Ben 10: Ultimate Alien Season 01 Sinhala Dubbed- සිංහල හඩکැවූ',
    originalTitle: 'Ben 10: Ultimate Alien Season 01 – සِංහල හඩکැවූ',
    releaseYear: 2010,
    duration: 'Multiple Episodes',
    rating: 8.2,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'Ben Tennyson is back with upgraded alien powers in full Sinhala Dubbed HD audio.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/07/SEASON-1-3-1.jpg',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/07/SEASON-1-3-1.jpg',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 1100,
    downloadsCount: 780,
    episodes: [
      { episode: '01', title: 'Episode 01', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E1.mp4' },
      { episode: '02', title: 'Episode 02', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E2.mp4' },
      { episode: '03', title: 'Episode 03', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E3.mp4' },
      { episode: '04', title: 'Episode 04', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E4.mp4' },
      { episode: '05', title: 'Episode 05', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E5.mp4' }
    ],
    downloadOptions: [
      { id: 'ua-s1-1080', quality: '1080p', resolution: '1920x1080', size: '300MB', format: 'MP4', downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Ultimate-Alien-S1//B10UAS1E1.mp4', server2Url: '', server1Name: 'Main Server', server2Name: 'Backup Server' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ben-10-af-s2',
    title: 'Ben 10: Alien Force Season 02 – සිංහල හඩکැවූ',
    originalTitle: 'Ben 10: Alien Force Season 02 – සිංහල හඩکැවූ',
    releaseYear: 2009,
    duration: 'Multiple Episodes',
    rating: 8.3,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'Ben Tennyson is back with upgraded alien powers in full Sinhala Dubbed HD audio.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-4.png',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-4.png',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 920,
    downloadsCount: 610,
    episodes: [
      { episode: '01', title: 'Episode 01', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E1.mp4' },
      { episode: '02', title: 'Episode 02', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E2.mp4' },
      { episode: '03', title: 'Episode 03', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E3.mp4' },
      { episode: '04', title: 'Episode 04', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E4.mp4' },
      { episode: '05', title: 'Episode 05', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E5.mp4' }
    ],
    downloadOptions: [
      { id: 'af-s2-1080', quality: '1080p', resolution: '1920x1080', size: '280MB', format: 'MP4', downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S2//B10AFS2E1.mp4', server2Url: '', server1Name: 'Main Server', server2Name: 'Backup Server' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ben-10-af-s1',
    title: 'Ben 10: Alien Force Season 01 – සිංහල හඩکැවූ',
    originalTitle: 'Ben 10: Alien Force Season 01 – සිංහල හඩکැවූ',
    releaseYear: 2008,
    duration: 'Multiple Episodes',
    rating: 8.3,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'Ben Tennyson is back with upgraded alien powers in full Sinhala Dubbed HD audio.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-5.png',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-5.png',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 1050,
    downloadsCount: 720,
    episodes: [
      { episode: '01', title: 'Episode 01', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E1.mp4' },
      { episode: '02', title: 'Episode 02', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E2.mp4' },
      { episode: '03', title: 'Episode 03', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E3.mp4' },
      { episode: '04', title: 'Episode 04', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E4.mp4' },
      { episode: '05', title: 'Episode 05', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E5.mp4' }
    ],
    downloadOptions: [
      { id: 'af-s1-1080', quality: '1080p', resolution: '1920x1080', size: '260MB', format: 'MP4', downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Alien-Force-S1//B10AFS1E1.mp4', server2Url: '', server1Name: 'Main Server', server2Name: 'Backup Server' }
    ],
    createdAt: new Date().toISOString()
  },
