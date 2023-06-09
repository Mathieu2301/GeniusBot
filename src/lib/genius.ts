import { get } from './request';

export interface GeniusResponse {
  meta: Meta;
  response: Response;
}

export interface Meta {
  status: number;
}

export interface Response {
  sections: Section[];
  next_page: number;
}

export interface Section {
  type: IndexEnum;
  hits: Hit[];
}

export interface Hit {
  highlights: Highlight[];
  index: IndexEnum;
  type: ResultType;
  result: Result;
}

export interface Highlight {
  property: Property;
  value: string;
  snippet: boolean;
  ranges: Range[];
}

export enum Property {
  Lyrics = 'lyrics',
}

export interface Range {
  start: number;
  end: number;
}

export enum IndexEnum {
  Lyric = 'lyric',
}

export interface Result {
  _type: ResultType;
  annotation_count: number;
  api_path: string;
  artist_names: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: number;
  instrumental: boolean;
  language: Language;
  lyrics_owner_id: number;
  lyrics_state: LyricsState;
  lyrics_updated_at: number;
  path: string;
  pyongs_count: null;
  relationships_index_url: string;
  release_date_components: ReleaseDateComponents | null;
  release_date_for_display: null | string;
  release_date_with_abbreviated_month_for_display: null | string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: Stats;
  title: string;
  title_with_featured: string;
  updated_by_human_at: number;
  url: string;
  featured_artists: Artist[];
  primary_artist: Artist;
}

export enum ResultType {
  Song = 'song',
}

export interface Artist {
  _type: Type;
  api_path: string;
  header_image_url: string;
  id: number;
  image_url: string;
  index_character: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
  slug: string;
  url: string;
  iq?: number;
}

export enum Type {
  Artist = 'artist',
}

export enum Language {
  En = 'en',
  Es = 'es',
  Fr = 'fr',
}

export enum LyricsState {
  Complete = 'complete',
}

export interface ReleaseDateComponents {
  year: number;
  month: number;
  day: number;
}

export interface Stats {
  unreviewed_annotations: number;
  hot: boolean;
}

const normalize = (str: string): string => (str
  .normalize('NFD')
  .toLowerCase()
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '')
);

/**
 * Description:
 *  Get the completion of a text based on a query.
 *  We need to ignore accents, case, punctuation, spaces, etc...
 *
 * Example:
 *  text: "Hello, nice to meet you. I'm a genius"
 *  query: "hello nice, to meet you"
 *  return: "I'm a genius"
 * 
 * Method:
 *  Find the start index of the query in the text ignoring
 *  accents, case, punctuation, spaces, etc...
 */
function getCompletion(text: string, query: string): string {
  const normalizedQuery = normalize(query);

  let queryInTextEndI = -1;
  let currentQueryI = 0;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const normalizedChar = normalize(char);

    if (!normalizedChar) continue;
    if (normalizedChar === normalizedQuery[currentQueryI]) currentQueryI += 1;
    if (currentQueryI === normalizedQuery.length) {
      queryInTextEndI = Number(i) + 1;
      break;
    }
  }

  if (queryInTextEndI === -1) return '';

  const lines = (text
    .substring(queryInTextEndI)
    .toLowerCase()
    .split('\n')
    .map((line) => line
      .replace(/ ?\(.*?\)/g, '')
      .replace(/^[\s,.?!]+/, '')
      .replace(/[\s,.?!]+$/, '')
    )
    .filter((line) => line.length > 0)
  );

  const averageLineLength = lines.reduce((acc, line) => acc + line.length, 0) / lines.length;

  return (lines
    .filter((line, i) => i === 0 || line.length > averageLineLength)
    .join(', ')
  );
}

export interface GeniusCompletion {
  code: 'OK' | 'NOT_FOUND' | 'ERROR';
  query?: string;
  completion?: string;
}

export async function searchLyrics(msg: string, artists: string[] = []): Promise<GeniusCompletion> {
  const rs = await get(`https://genius.com/api/search/lyric?q=${encodeURIComponent(msg)}`) as GeniusResponse;
  if (!rs || !rs.response || !rs.response.sections) return { code: 'ERROR' };

  const hits = rs.response.sections.reduce((acc, section) => acc.concat(section.hits), [] as Hit[]);

  for (const hit of hits) {
    // Check if artist is allowed
    if (artists.length && !artists.includes(hit.result.primary_artist.name.toLowerCase())) continue;

    // Process lyrics
    for (const highlight of hit.highlights) {
      const completion = getCompletion(highlight.value, msg);
      if (!completion) continue;

      console.log({
        message: msg,
        answer: `${completion}...`,
      });
      return {
        code: 'OK',
        query: msg,
        completion: `${completion}...`,
      };
    }
  }

  return { code: 'NOT_FOUND' };
}

export default {
  searchLyrics,
};
