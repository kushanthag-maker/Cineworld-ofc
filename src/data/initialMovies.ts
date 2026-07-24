import { Movie } from '../types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm-1',
    title: 'Avatar: The Way of Water',
    originalTitle: 'ඇවටාර්: ද වේ ඔෆ් වෝටර් (සිංහල උපසිරැසි)',
    slug: 'avatar-the-way-of-water',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    releaseYear: 2022,
    duration: '3h 12m',
    rating: 8.8,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    type: 'Movie',
    hasSinhalaSub: true,
    isSinhalaDubbed: false,
    featured: true,
    trending: true,
    quality: '4K Ultra HD',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    downloadOptions: [
      {
        id: 'dl-101',
        quality: '4K Ultra HD',
        size: '5.8 GB',
        resolution: '3840x2160',
        format: 'MKV / x265 10-bit',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        directServerName: 'Cineworld HighSpeed Server 1'
      },
      {
        id: 'dl-102',
        quality: '1080p Full HD',
        size: '2.4 GB',
        resolution: '1920x1080',
        format: 'MP4 / x264 AAC',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        directServerName: 'Cineworld Server 2'
      },
      {
        id: 'dl-103',
        quality: '720p HD',
        size: '980 MB',
        resolution: '1280x720',
        format: 'MP4 / x264',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        directServerName: 'Mega Direct Drive'
      }
    ],
    viewsCount: 14250,
    downloadsCount: 8930,
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'm-2',
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'ස්පයිඩර් මෑන් (සිංහල හඬකැවූ)',
    slug: 'spider-man-across-the-spider-verse',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    releaseYear: 2023,
    duration: '2h 20m',
    rating: 8.9,
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    type: 'Movie',
    hasSinhalaSub: true,
    isSinhalaDubbed: true,
    featured: true,
    trending: true,
    quality: '1080p Full HD',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    downloadOptions: [
      {
        id: 'dl-201',
        quality: '1080p Full HD',
        size: '2.1 GB',
        resolution: '1920x1080',
        format: 'MP4 / Dual Audio [Eng + Sinhala]',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        directServerName: 'Cineworld Fast Mirror'
      },
      {
        id: 'dl-202',
        quality: '720p HD',
        size: '1.1 GB',
        resolution: '1280x720',
        format: 'MP4 / x264',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        directServerName: 'Google Drive Direct'
      }
    ],
    viewsCount: 22100,
    downloadsCount: 14200,
    createdAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'm-3',
    title: 'Oppenheimer',
    originalTitle: 'ඔපන්හයිමර් (සිංහල උපසිරැසි)',
    slug: 'oppenheimer',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    releaseYear: 2023,
    duration: '3h 00m',
    rating: 8.9,
    genres: ['Biography', 'Drama', 'History'],
    type: 'Movie',
    hasSinhalaSub: true,
    isSinhalaDubbed: false,
    featured: true,
    trending: true,
    quality: '4K Ultra HD',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    downloadOptions: [
      {
        id: 'dl-301',
        quality: '4K Ultra HD',
        size: '6.2 GB',
        resolution: '3840x2160',
        format: 'MKV / HDR10',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        directServerName: 'Cineworld Ultra Cloud'
      },
      {
        id: 'dl-302',
        quality: '1080p Full HD',
        size: '2.8 GB',
        resolution: '1920x1080',
        format: 'MP4 / x264 Subtitles Included',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        directServerName: 'Server 1 Direct'
      }
    ],
    viewsCount: 31050,
    downloadsCount: 18400,
    createdAt: '2026-03-01T09:15:00Z'
  },
  {
    id: 'm-4',
    title: 'Interstellar',
    originalTitle: 'ඉන්ටර්ස්ටෙලාර් (සිංහල උපසිරැසි)',
    slug: 'interstellar',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    releaseYear: 2014,
    duration: '2h 49m',
    rating: 8.7,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    type: 'Movie',
    hasSinhalaSub: true,
    isSinhalaDubbed: false,
    featured: false,
    trending: false,
    quality: '1080p Full HD',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    downloadOptions: [
      {
        id: 'dl-401',
        quality: '1080p Full HD',
        size: '2.5 GB',
        resolution: '1920x1080',
        format: 'MP4 / x264',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        directServerName: 'Cineworld HighSpeed 1'
      }
    ],
    viewsCount: 19800,
    downloadsCount: 11200,
    createdAt: '2026-01-05T12:00:00Z'
  },
  {
    id: 'm-5',
    title: 'The Dark Knight',
    originalTitle: 'ද ඩාක් නයිට් (සිංහල උපසිරැසි)',
    slug: 'the-dark-knight',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseYear: 2008,
    duration: '2h 32m',
    rating: 9.0,
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    type: 'Movie',
    hasSinhalaSub: true,
    isSinhalaDubbed: true,
    featured: false,
    trending: true,
    quality: '1080p Full HD',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    downloadOptions: [
      {
        id: 'dl-501',
        quality: '1080p Full HD',
        size: '2.2 GB',
        resolution: '1920x1080',
        format: 'MP4 / Dual Audio',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        directServerName: 'Cineworld Server 1'
      }
    ],
    viewsCount: 45000,
    downloadsCount: 29000,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'm-6',
    title: 'Stranger Things: Season 4',
    originalTitle: 'ස්ට්‍රේන්ජර් තින්ග්ස් 4 (සිංහල උපසිරැසි)',
    slug: 'stranger-things-season-4',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    releaseYear: 2022,
    duration: '9 Episodes',
    rating: 8.7,
    genres: ['Horror', 'Sci-Fi', 'Drama', 'Fantasy'],
    type: 'TV Series',
    hasSinhalaSub: true,
    isSinhalaDubbed: false,
    featured: false,
    trending: true,
    quality: '1080p Full HD',
    director: 'The Duffer Brothers',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
    trailerUrl: 'https://www.youtube.com/embed/b9EkMc79ZSU',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    downloadOptions: [
      {
        id: 'dl-601',
        quality: '1080p Full HD',
        size: '8.5 GB (Complete Pack)',
        resolution: '1920x1080',
        format: 'ZIP / MP4 All Episodes',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        directServerName: 'Cineworld Series Cloud'
      }
    ],
    viewsCount: 16500,
    downloadsCount: 9400,
    createdAt: '2026-02-18T16:00:00Z'
  }
];

export const INITIAL_REVIEWS: Record<string, any[]> = {
  'm-1': [
    {
      id: 'rev-1',
      movieId: 'm-1',
      userName: 'Kamal Perera',
      rating: 5,
      comment: 'Superb visual effects and clean Sinhala subtitles! Thank you Cineworld Team!',
      date: '2026-07-20'
    },
    {
      id: 'rev-2',
      movieId: 'm-1',
      userName: 'Nalin Silva',
      rating: 5,
      comment: '4K Direct Download link fast. High speed downloading without ads!',
      date: '2026-07-21'
    }
  ]
};
