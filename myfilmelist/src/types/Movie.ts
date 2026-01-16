export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string; 
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface MovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;

  // aqui muda:
  genres: Genre[];
}

export interface MovieSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  realease_date: string;
}

export interface MovieSearchResultResponse {
  page: number;
  results: MovieSearchResult[];
  total_pages: number;
  total_results: number;
}


// O TMDB retorna uma lista paginada
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}