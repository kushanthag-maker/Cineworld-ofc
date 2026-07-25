import fs from 'fs';
import path from 'path';

const harryPotterMovies = [
  {
    id: "harry-potter-1-philosophers-stone",
    title: "Harry Potter and the Sorcerer's Stone (2001) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Philosopher's Stone",
    releaseYear: 2001,
    duration: "2h 32m",
    rating: 8.9,
    genres: ["Fantasy", "Adventure", "Family"],
    director: "Chris Columbus",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Richard Harris"],
    description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world. Features full Sinhala Subtitles.",
    posterUrl: "https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 12500,
    downloadsCount: 8400,
    episodes: [],
    downloadOptions: [
      {
        id: "hp1-dl-1080p",
        quality: "1080p Full HD Dual Audio / Sinhala Sub",
        resolution: "1920x1080",
        size: "2.1 GB",
        format: "MP4 High Speed Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        server1Name: "Fast Cloud R2 Direct Server",
        server2Name: "Backup Stream CDN"
      },
      {
        id: "hp1-dl-720p",
        quality: "720p HD Quality",
        resolution: "1280x720",
        size: "1.1 GB",
        format: "MP4 Fast Download",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        server1Name: "Server 1",
        server2Name: "Server 2"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-2-chamber-of-secrets",
    title: "Harry Potter and the Chamber of Secrets (2002) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Chamber of Secrets",
    releaseYear: 2002,
    duration: "2h 41m",
    rating: 8.8,
    genres: ["Fantasy", "Adventure", "Mystery"],
    director: "Chris Columbus",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Kenneth Branagh"],
    description: "An ancient prophecy seems to be coming true when a mysterious presence begins stalking the corridors of a school of magic and leaving its victims paralyzed.",
    posterUrl: "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 11200,
    downloadsCount: 7600,
    episodes: [],
    downloadOptions: [
      {
        id: "hp2-dl-1080p",
        quality: "1080p Full HD Sinhala Sub",
        resolution: "1920x1080",
        size: "2.3 GB",
        format: "MP4 High Speed Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        server1Name: "Fast Cloud R2 Direct Server",
        server2Name: "Backup Stream CDN"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-3-prisoner-of-azkaban",
    title: "Harry Potter and the Prisoner of Azkaban (2004) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Prisoner of Azkaban",
    releaseYear: 2004,
    duration: "2h 22m",
    rating: 9.0,
    genres: ["Fantasy", "Adventure", "Family"],
    director: "Alfonso Cuarón",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Gary Oldman"],
    description: "Harry Potter, Ron and Hermione return to Hogwarts School of Witchcraft and Wizardry for their third year of study, where they delve into the mystery surrounding an escaped prisoner who poses a dangerous threat to the young wizard.",
    posterUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 14800,
    downloadsCount: 9900,
    episodes: [],
    downloadOptions: [
      {
        id: "hp3-dl-1080p",
        quality: "1080p Full HD Sinhala Sub",
        resolution: "1920x1080",
        size: "2.0 GB",
        format: "MP4 Direct Link",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        server1Name: "Server 1 Direct",
        server2Name: "Server 2 Mirror"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-4-goblet-of-fire",
    title: "Harry Potter and the Goblet of Fire (2005) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Goblet of Fire",
    releaseYear: 2005,
    duration: "2h 37m",
    rating: 8.8,
    genres: ["Fantasy", "Adventure", "Family"],
    director: "Mike Newell",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Robert Pattinson"],
    description: "Harry Potter finds himself competing in a hazardous tournament between rival schools of magic, but he is distracted by recurring nightmares.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 13100,
    downloadsCount: 8900,
    episodes: [],
    downloadOptions: [
      {
        id: "hp4-dl-1080p",
        quality: "1080p Full HD Direct",
        resolution: "1920x1080",
        size: "2.2 GB",
        format: "MP4 High Speed Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        server1Name: "Cloud R2 Direct",
        server2Name: "Mirror 2"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-5-order-of-the-phoenix",
    title: "Harry Potter and the Order of the Phoenix (2007) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Order of the Phoenix",
    releaseYear: 2007,
    duration: "2h 18m",
    rating: 8.7,
    genres: ["Fantasy", "Adventure", "Action"],
    director: "David Yates",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Ralph Fiennes"],
    description: "With their warning about Lord Voldemort's return scoffed at, Harry and Dumbledore are targeted by the Wizard authorities as an authoritarian bureaucrat slowly takes power at Hogwarts.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 10800,
    downloadsCount: 7200,
    episodes: [],
    downloadOptions: [
      {
        id: "hp5-dl-1080p",
        quality: "1080p Full HD Direct",
        resolution: "1920x1080",
        size: "1.9 GB",
        format: "MP4 Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        server1Name: "R2 Server 1",
        server2Name: "CDN Server 2"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-6-half-blood-prince",
    title: "Harry Potter and the Half-Blood Prince (2009) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Half-Blood Prince",
    releaseYear: 2009,
    duration: "2h 33m",
    rating: 8.8,
    genres: ["Fantasy", "Adventure", "Mystery"],
    director: "David Yates",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Michael Gambon"],
    description: "As Harry Potter begins his sixth year at Hogwarts, he discovers an old book marked as 'the property of the Half-Blood Prince' and begins to learn more about Lord Voldemort's dark past.",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 11900,
    downloadsCount: 8100,
    episodes: [],
    downloadOptions: [
      {
        id: "hp6-dl-1080p",
        quality: "1080p Full HD Direct",
        resolution: "1920x1080",
        size: "2.1 GB",
        format: "MP4 Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        server1Name: "R2 Server 1",
        server2Name: "CDN Server 2"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-7-deathly-hallows-part-1",
    title: "Harry Potter and the Deathly Hallows - Part 1 (2010) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Deathly Hallows - Part 1",
    releaseYear: 2010,
    duration: "2h 26m",
    rating: 8.9,
    genres: ["Fantasy", "Adventure", "Action"],
    director: "David Yates",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Helena Bonham Carter"],
    description: "As Harry, Ron, and Hermione race against time and evil to destroy the Horcruxes, they uncover the existence of the three most powerful objects in the wizarding world: the Deathly Hallows.",
    posterUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 15400,
    downloadsCount: 10200,
    episodes: [],
    downloadOptions: [
      {
        id: "hp7-dl-1080p",
        quality: "1080p Full HD Direct",
        resolution: "1920x1080",
        size: "2.2 GB",
        format: "MP4 Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        server1Name: "R2 Server 1",
        server2Name: "CDN Server 2"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "harry-potter-8-deathly-hallows-part-2",
    title: "Harry Potter and the Deathly Hallows - Part 2 (2011) - සිංහල උපසිරැසි සමඟ",
    originalTitle: "Harry Potter and the Deathly Hallows - Part 2",
    releaseYear: 2011,
    duration: "2h 10m",
    rating: 9.2,
    genres: ["Fantasy", "Adventure", "Action"],
    director: "David Yates",
    cast: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Ralph Fiennes"],
    description: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages at Hogwarts.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4",
    category: "Hollywood",
    language: "English (Sinhala Subtitle / සිංහල උපසිරැසි)",
    hasSinhalaSub: true,
    quality: "1080p Full HD",
    viewsCount: 18900,
    downloadsCount: 12800,
    episodes: [],
    downloadOptions: [
      {
        id: "hp8-dl-1080p",
        quality: "1080p Full HD Direct",
        resolution: "1920x1080",
        size: "2.0 GB",
        format: "MP4 Direct",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4",
        server2Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4",
        server1Name: "R2 Server 1",
        server2Name: "CDN Server 2"
      }
    ],
    createdAt: new Date().toISOString()
  }
];

async function generateMovies() {
  const apiKey = 'zan_FLUs8y9T_fcz7cgi12p';
  
  const movieSources = [
    { search: 'ben 10', category: 'Sinhala Dubbed' },
    { search: 'kung fu', category: 'Sinhala Dubbed' },
    { search: 'shrek', category: 'Sinhala Dubbed' },
    { search: 'rio', category: 'Sinhala Dubbed' },
    { search: 'frozen', category: 'Sinhala Dubbed' },
    { search: 'garfield', category: 'Sinhala Dubbed' },
    { search: 'gajaman', category: 'Sinhala Movie' },
    { search: 'raya', category: 'Sinhala Dubbed' },
    { search: 'bee', category: 'Sinhala Dubbed' },
    { search: 'scooby', category: 'Sinhala Dubbed' }
  ];

  const processedUrls = new Set();
  const movies = [...harryPotterMovies];

  for (const s of movieSources) {
    try {
      console.log(`Searching API for: ${s.search}...`);
      const res = await fetch(`https://api.zanta-mini.store/api/slcartoons/search?apiKey=${apiKey}&text=${encodeURIComponent(s.search)}`);
      const data = await res.json();
      if (!data.results) continue;

      for (const item of data.results) {
        if (!item.url || item.url.includes('about-us') || item.url.includes('contact-us') || item.url.includes('dmca')) continue;
        if (processedUrls.has(item.url)) continue;
        processedUrls.add(item.url);

        console.log(`Fetching DL links for: ${item.title}...`);
        const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${apiKey}&text=${encodeURIComponent(item.url)}`);
        const dlData = await dlRes.json();

        if (!dlData.results) continue;
        const r = dlData.results;

        const directDownloadLink = r.download_links?.find(l => l.type && l.type.includes('Direct'))?.final_link;
        const telegramLink = r.download_links?.find(l => l.type && l.type.includes('Telegram'))?.final_link;

        const episodes = (r.episodes || []).map((ep, idx) => ({
          episode: ep.episode || String(idx + 1).padStart(2, '0'),
          title: ep.title ? `Episode ${ep.episode || idx + 1} - ${ep.title}` : `Episode ${ep.episode || idx + 1}`,
          stream_url: ep.stream_url
        }));

        const primaryStreamUrl = episodes.length > 0 
          ? episodes[0].stream_url 
          : (directDownloadLink || 'https://cdn.sinhalacartoons.com/ben-10-classic/Ben%2010%20(%202005%20)%20S01%20Ep01.mp4');

        const downloadOptions = [];

        if (directDownloadLink) {
          downloadOptions.push({
            id: `dl-1-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            quality: '1080p Full HD Direct',
            resolution: '1920x1080',
            size: 'High Speed Direct',
            format: 'MP4 / MKV Direct',
            downloadUrl: directDownloadLink,
            server2Url: primaryStreamUrl,
            server1Name: 'Cloudflare R2 Direct Server',
            server2Name: 'CDN Stream Server'
          });
        }

        if (telegramLink) {
          downloadOptions.push({
            id: `dl-2-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            quality: 'Telegram Easy Mobile Download',
            resolution: 'HD Quality',
            size: 'Telegram Fast',
            format: 'Telegram Bot Link',
            downloadUrl: telegramLink,
            server2Url: telegramLink,
            server1Name: 'Telegram Official Bot',
            server2Name: 'Telegram Channel'
          });
        }

        if (downloadOptions.length === 0 && episodes.length > 0) {
          episodes.slice(0, 3).forEach((ep, idx) => {
            downloadOptions.push({
              id: `dl-ep-${idx}-${Date.now()}`,
              quality: `Episode ${ep.episode} Direct Download`,
              resolution: '1080p Full HD',
              size: '180 MB',
              format: 'MP4 Direct',
              downloadUrl: ep.stream_url,
              server2Url: ep.stream_url,
              server1Name: 'R2 Server 1',
              server2Name: 'CDN Server 2'
            });
          });
        }

        const id = item.url.split('/').filter(Boolean).pop() || `movie-${Date.now()}`;
        const titleClean = item.title.replace(/–/g, '-').replace(/\|/g, '-').trim();

        movies.push({
          id,
          title: titleClean,
          originalTitle: item.title,
          releaseYear: 2024,
          duration: episodes.length > 0 ? `${episodes.length} Episodes` : '1h 35m',
          rating: Number(item.rating) || 8.2,
          genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Family'],
          director: 'Sinhala Cartoons Studio',
          cast: ['Sinhala Dubbed Cast'],
          description: `Watch ${titleClean} online in high quality. Features full Sinhala Dubbed audio (සිංහල හඩකැවූ) with fast direct MP4 video streaming and high-speed R2 server downloads.`,
          posterUrl: item.thumbnail || 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-3.png',
          backdropUrl: item.thumbnail || 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-3.png',
          streamUrl: primaryStreamUrl,
          category: s.category,
          language: 'Sinhala Dubbed (සිංහල)',
          hasSinhalaSub: true,
          quality: item.quality || '1080p Full HD',
          viewsCount: Math.floor(Math.random() * 4000) + 3000,
          downloadsCount: Math.floor(Math.random() * 3000) + 2000,
          episodes,
          downloadOptions,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(`Error processing ${s.search}:`, err);
    }
  }

  // Write to src/data/initialMovies.ts
  const fileContent = `import { Movie } from '../types';

export const initialMovies: Movie[] = ${JSON.stringify(movies, null, 2)};
`;

  fs.writeFileSync(path.join(process.cwd(), 'src/data/initialMovies.ts'), fileContent, 'utf-8');
  console.log(`Successfully written ${movies.length} movies (including 8 Harry Potter movies + ${movies.length - 8} cartoon movies from your API) to src/data/initialMovies.ts!`);
}

generateMovies();
