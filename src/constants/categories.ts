/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MovieItem, SupportedCategory } from '../types/movie';

export const SUPPORTED_CATEGORIES: SupportedCategory[] = [
  'HINDI MOVIE',
  'SOUTH MOVIE',
  '18+ ADULTS',
  'TV SERIES',
  'SERIES',
  'HORROR MOVIE',
  'MOVIE',
  'BANGLA',
  'BANGLA DUBBED',
  'DUAL AUDIO',
  'MULTI AUDIO',
  'WEB SERIES',
  'WWE',
  'ANIMATION',
  'DRAMA',
  'ALL MOVIES',
];

export const DEFAULT_MOVIE: MovieItem = {
  id: '',
  title: '',
  pinned: false,
  isPinned: false,
  pin: false,
  is_pinned: false,
  featured: false,
  isFeatured: false,
  recent: false,
  isRecent: false,
  views: '',
  category: '',
  categories: [],
  poster: '',
  genre: [],
  type: '',
  language: '',
  quality: '',
  resolution: '',
  releaseDate: '',
  imdbRating: '',
  storyline: '',
  cast: [],
  screenshots: [],
  downloadLinks: [],
};

export const SAMPLES = {
  singleBollywood: `Pathaan (2023) Hindi Movie Pre-DVDRip 1080p 720p 480p x264 ESubs
Title: Pathaan
Year: 2023
Type: Movie
Category: HINDI MOVIE, ALL MOVIES
Genre: Action, Thriller, Adventure
Language: Hindi
IMDb Rating: 7.0/10
Release Date: 25 January 2023
Quality: WEB-DL
Resolution: 1080p, 720p, 480p
Director: Siddharth Anand
Cast: Shah Rukh Khan, Deepika Padukone, John Abraham, Dimple Kapadia, Ashutosh Rana
Storyline: An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.

Poster:
https://m.media-amazon.com/images/M/MV5BM2QzM2VkNWUtMGM0Ny00MGNiLWIwMDQtODJlMmFlNGExOTgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg

Screenshots:
https://i.postimg.cc/pathaan-shot1.jpg
https://i.postimg.cc/pathaan-shot2.jpg
https://i.postimg.cc/pathaan-shot3.jpg

Download Links:
480p [450MB] Direct G-Drive: https://hubcloud.club/drive/pathaan-480p.mkv
720p [1.2GB] Fast Cloud: https://hubcloud.club/drive/pathaan-720p.mkv
1080p [2.8GB] Full HD 10bit: https://hubcloud.club/drive/pathaan-1080p.mkv`,

  bengaliMovie: `তুফান (Toofan) ২০২৪ বাংলা ফুল মুভি 1080p 720p 480p HDRip
মুভির নাম: তুফান (Toofan)
মুক্তির সাল: 2024
ধরন: অ্যাকশন, ক্রাইম, থ্রিলার (Action, Crime, Thriller)
ভাষা: বাংলা (Bangla)
ক্যাটাগরি: BANGLA, MOVIE, ALL MOVIES
আইএমডিবি রেটিং: 7.8/10
অভিনয়ে: Shakib Khan, Mimi Chakraborty, Nabila, Chanchal Chowdhury, Jisshu Sengupta
পরিচালক: রায়হান রাফী (Raihan Rafi)
কাহিনী সংক্ষেপ: নব্বইয়ের দশকের এক কুখ্যাত গ্যাংস্টারের উত্থান ও অপরাধজগতের একচ্ছত্র আধিপত্য বিস্তার নিয়ে টানটান উত্তেজনার কাহিনী।

পোস্টার লিংক:
https://i.ibb.co/toofan-2024-bangla-official-poster.jpg

স্ক্রিনশটস:
https://i.ibb.co/toofan-screen-01.jpg
https://i.ibb.co/toofan-screen-02.jpg
https://i.ibb.co/toofan-screen-03.jpg

ডাউনলোড লিংকসমূহ:
480p WEB-DL | 400MB : https://pixeldrain.com/u/toofan_480p_bangla
720p HD | 1.1GB : https://pixeldrain.com/u/toofan_720p_bangla
1080p Full HD | 2.5GB : https://pixeldrain.com/u/toofan_1080p_bangla`,

  webSeries: `Mirzapur Season 3 (2024) Hindi WEB Series All Episodes Complete
Title: Mirzapur (Season 3)
Type: Web Series
Category: WEB SERIES, SERIES, DRAMA, ALL MOVIES
Release Date: 5 July 2024
Language: Hindi (Multi Audio / English Subtitles)
Genre: Action, Crime, Drama, Thriller
IMDb Rating: 8.5/10
Quality: WEB-DL
Resolution: 720p / 1080p
Cast: Pankaj Tripathi, Ali Fazal, Shweta Tripathi, Rasika Dugal, Vijay Varma, Isha Talwar
Storyline: With Kaleen Bhaiya missing and Guddu and Golu aiming for the throne of Purvanchal, new alliances and fierce betrayals emerge.

Poster:
https://images.lifestyleasia.com/wp-content/uploads/sites/7/2024/06/11181232/mirzapur-season-3-poster.jpg

Screenshots:
https://postimg.cc/mirzapur-s3-preview1
https://postimg.cc/mirzapur-s3-preview2

Download Links:
480p Batch Zip [1.8GB]: https://download.series.org/mirzapur-s03-480p-complete.zip
720p Complete Pack [4.2GB]: https://download.series.org/mirzapur-s03-720p-complete.zip
1080p 10-Bit HEVC [7.5GB]: https://download.series.org/mirzapur-s03-1080p-complete.zip`,

  batchMulti: `=== ENTRY 1 ===
Movie: Jawan (2023)
Category: HINDI MOVIE, SOUTH MOVIE, ALL MOVIES
Type: Movie
Language: Hindi, Tamil, Telugu (Multi Audio)
Quality: WEB-DL 1080p
Release Date: 7 September 2023
IMDb: 7.1/10
Genre: Action, Thriller
Cast: Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone
Storyline: A high-voltage action thriller which outlines the emotional journey of a man who is set out to rectify the wrongs in the society.
Poster: https://i.postimg.cc/jawan-2023.jpg
Screenshots:
https://i.postimg.cc/jawan-ss1.jpg
https://i.postimg.cc/jawan-ss2.jpg
Links:
720p | 1.3GB : https://gdrive.example.com/jawan-720p
1080p | 3.1GB : https://gdrive.example.com/jawan-1080p

=== ENTRY 2 ===
Movie: Animal (2023)
Category: HINDI MOVIE, 18+ ADULTS, DRAMA
Type: Movie
Language: Hindi
Quality: BluRay 720p / 1080p
Release Date: 1 December 2023
IMDb: 6.6/10
Genre: Action, Crime, Drama
Cast: Ranbir Kapoor, Anil Kapoor, Bobby Deol, Rashmika Mandanna, Triptii Dimri
Storyline: A son undergoes a remarkable transformation as the bond with his father begins to fracture, leading him into an obsessive quest for vengeance.
Poster: https://i.postimg.cc/animal-2023.jpg
Screenshots:
https://i.postimg.cc/animal-ss1.jpg
https://i.postimg.cc/animal-ss2.jpg
Links:
720p | 1.4GB : https://gdrive.example.com/animal-720p
1080p | 3.5GB : https://gdrive.example.com/animal-1080p

=== ENTRY 3 ===
Movie: Leo (2023)
Category: SOUTH MOVIE, DUAL AUDIO, MOVIE
Type: Movie
Language: Tamil + Hindi Dual Audio
Quality: HDRip 1080p
Release Date: 19 October 2023
IMDb: 7.2/10
Genre: Action, Crime, Thriller
Cast: Thalapathy Vijay, Sanjay Dutt, Arjun Sarja, Trisha Krishnan
Storyline: Parthiban is a mild-mannered cafe owner in Theog who gets dragged into a ruthless cartel's past after a violent encounter.
Poster: https://i.postimg.cc/leo-2023.jpg
Screenshots:
https://i.postimg.cc/leo-ss1.jpg
Links:
720p [1.1GB] : https://gdrive.example.com/leo-720p
1080p [2.6GB] : https://gdrive.example.com/leo-1080p`,
};
