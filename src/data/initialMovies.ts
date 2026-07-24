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
      { episode: '05', title: 'Episode 05 - Vreedle Vreedle', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E5.mp4' },
      { episode: '06', title: 'Episode 06 - Singlehanded', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E6.mp4' },
      { episode: '07', title: 'Episode 07 - If All Else Fails', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E7.mp4' },
      { episode: '08', title: 'Episode 08 - In Charm\'s Way', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E8.mp4' },
      { episode: '09', title: 'Episode 09 - Ghost Town', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E9.mp4' },
      { episode: '10', title: 'Episode 10 - Trade-Off', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E10.mp4' },
      { episode: '11', title: 'Episode 11 - Busy Box', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E11.mp4' },
      { episode: '12', title: 'Episode 12 - Con of Rath', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E12.mp4' },
      { episode: '13', title: 'Episode 13 - Primus', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E13.mp4' },
      { episode: '14', title: 'Episode 14 - Time Heals', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E14.mp4' },
      { episode: '15', title: 'Episode 15 - The Secret of Chromastone', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E15.mp4' },
      { episode: '16', title: 'Episode 16 - Above and Beyond', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E16.mp4' },
      { episode: '17', title: 'Episode 17 - Vendetta', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E17.mp4' }
    ],
    downloadOptions: [
      {
        id: 'opt-b10-1',
        quality: 'Episode 01 HD Direct',
        resolution: '1920x1080',
        size: '180 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
        server2Url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
        server1Name: 'Server 1 High-Speed R2',
        server2Name: 'Server 2 Direct CDN'
      },
      {
        id: 'opt-b10-2',
        quality: 'Episode 02 HD Direct',
        resolution: '1920x1080',
        size: '185 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4',
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
    episodes: [
      { episode: '01', title: 'Episode 01 - The Boy in the Iceberg', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { episode: '02', title: 'Episode 02 - The Avatar Returns', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { episode: '03', title: 'Episode 03 - The Southern Air Temple', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { episode: '04', title: 'Episode 04 - The Warriors of Kyoshi', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { episode: '05', title: 'Episode 05 - The King of Omashu', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
    ],
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
  }
];
