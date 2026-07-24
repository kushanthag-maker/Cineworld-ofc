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
  },
  {
    id: 'avatar-tla-s1',
    title: 'Avatar The Last Airbender - Sinhala Dubbed',
    originalTitle: 'Avatar: The Last Airbender Season 01 Sinhala',
    releaseYear: 2024,
    duration: '20 Episodes',
    rating: 9.3,
    genres: ['Animation', 'Sinhala Cartoon', 'Adventure', 'Fantasy'],
    director: 'Nickelodeon / Sinhala Dubbing',
    cast: ['Aang', 'Katara', 'Sokka', 'Zuko'],
    description: 'Aang, the young Avatar, must master the four elements to save the world in high quality Sinhala Dubbed audio. Streaming directly with high-speed mirrors.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p HD',
    viewsCount: 2310,
    downloadsCount: 1450,
    downloadOptions: [
      {
        id: 'opt-av-1',
        quality: '1080p Full HD Direct',
        resolution: '1920x1080',
        size: '320 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        server2Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        server1Name: 'Server 1 Direct CDN',
        server2Name: 'Server 2 Mirror'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'the-croods-a-new-age-2020',
    title: 'The Croods: A New Age (2020)',
    originalTitle: 'The Croods: A New Age (2020) Sinhala Subtitles | සිංහල උපසිරසි සමඟ',
    releaseYear: 2020,
    duration: '1h 35m',
    rating: 7.0,
    genres: ['Animation', 'Adventure', 'Comedy', 'Family', 'Sinhala Subbed'],
    director: 'Joel Crawford',
    cast: ['Nicolas Cage', 'Emma Stone', 'Ryan Reynolds', 'Catherine Keener', 'Peter Dinklage'],
    description: 'Searching for a safer habitat, the prehistoric Crood family discovers an enclosed, walled-in paradise that meets all of its needs. However, they must learn to live with the Bettermans — a family that is a couple of steps above the Croods on the evolutionary ladder. Includes complete Sinhala Subtitles (සිංහල උපසිරසි සමඟ).',
    posterUrl: 'https://image.tmdb.org/t/p/w780/ytTQoYkdpsgtfDWrNFCei8Mfbxu.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w780/ytTQoYkdpsgtfDWrNFCei8Mfbxu.jpg',
    streamUrl: 'https://pixeldrain.com/api/file/oNhYjVmP?download=1',
    category: 'Sinhala Subbed',
    language: 'English with Sinhala Sub (සිංහල Sub)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 1850,
    downloadsCount: 1240,
    downloadOptions: [
      {
        id: 'opt-croods-1',
        quality: 'Pixeldrain - FHD 1080p Direct',
        resolution: '1920x1080',
        size: '1.4 GB',
        format: 'MP4 / MKV Direct',
        downloadUrl: 'https://pixeldrain.com/api/file/oNhYjVmP?download=1',
        server2Url: 'https://sinhalasub.lk/links/fcdb3h7ioe/',
        server1Name: 'Pixeldrain High-Speed',
        server2Name: 'DLServer-01'
      },
      {
        id: 'opt-croods-2',
        quality: 'Pixeldrain - HD 720p Direct',
        resolution: '1280x720',
        size: '850 MB',
        format: 'MP4 / MKV Direct',
        downloadUrl: 'https://pixeldrain.com/api/file/JPXaFV1F?download=1',
        server2Url: 'https://sinhalasub.lk/links/imckmis17v/',
        server1Name: 'Pixeldrain 720p',
        server2Name: 'DLServer-01 720p'
      },
      {
        id: 'opt-croods-3',
        quality: 'Pixeldrain - SD 480p Direct',
        resolution: '854x480',
        size: '450 MB',
        format: 'MP4 / MKV Direct',
        downloadUrl: 'https://pixeldrain.com/api/file/xAf4LesY?download=1',
        server2Url: 'https://sinhalasub.lk/links/awuqbmk2ho/',
        server1Name: 'Pixeldrain 480p',
        server2Name: 'DLServer-01 480p'
      },
      {
        id: 'opt-croods-4',
        quality: 'DLServer-02 - FHD 1080p',
        resolution: '1920x1080',
        size: '1.4 GB',
        format: 'Direct Mirror',
        downloadUrl: 'https://sinhalasub.lk/links/tjxcnonzhs/',
        server2Url: 'https://sinhalasub.lk/links/fmkouvifxd/',
        server1Name: 'DLServer-02',
        server2Name: 'FilesPayout'
      },
      {
        id: 'opt-croods-sub',
        quality: 'Sinhala Subtitles (SRT File)',
        resolution: 'SRT Subtitle',
        size: '120 KB',
        format: 'SRT',
        downloadUrl: 'https://sinhalasub.lk/links/htw6q92avg/',
        server2Url: 'https://sinhalasub.lk/links/htw6q92avg/',
        server1Name: 'SinhalaSub Direct',
        server2Name: 'SinhalaSub Mirror'
      }
    ],
    createdAt: new Date().toISOString()
  }
];
