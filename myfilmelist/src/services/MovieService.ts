const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

import type { GenreResponse, Movie, MovieResponse, MovieDetails, MovieSearchResult, MovieSearchResultResponse } from '../types/Movie';
import type { Genre } from '../types/Movie';

const getUrl = (endpoint: string, params?: string) => {
  return `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR${params ? '&' + params : ''}`;
};

export const MovieService = {

  getGenres: async (): Promise<Genre[]> =>{
    try {
      const response = await fetch(getUrl('genre/movie/list'));

      if(!response.ok) throw new Error('Erro ao buscar gêneros');

      const data:GenreResponse = await response.json();

      return data.genres;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getMovieGenre: async (id:number | string): Promise<Movie[]> => {
    try {
      const response = await fetch(getUrl('discover/movie', `with_genres=${id}`));

      if (!response.ok) throw new Error('Erro ao buscar filmes por gênero');

      const data: MovieResponse = await response.json();

      return data.results;

    }catch (error) {
      console.error(error);
      return [];
    }
  },

  getPopularMovie: async (): Promise<Movie[]> => {
    try {
      const response = await fetch(getUrl('movie/popular'));
      
      if (!response.ok) throw new Error('Erro ao buscar filmes');

      const data: MovieResponse = await response.json();

      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getMovieId: async (id: string | number): Promise<MovieDetails | null> => {
    try {
      const response = await fetch(getUrl(`movie/${id}`));

      if (!response.ok) return null;

      const data: MovieDetails = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  search: async (query: string): Promise<MovieSearchResult[]> => {
    try {
      if (!query) return [];

      // encodeURIComponent garante que espaços e acentos não quebrem a URL
      const response = await fetch(getUrl('search/movie', `query=${encodeURIComponent(query)}`));

      if (!response.ok) return [];

      const data: MovieSearchResultResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getTopRated: async (): Promise<Movie[]> => {
    try {
      const response = await fetch(getUrl('movie/top_rated'));
      if (!response.ok) return [];
      const data: MovieResponse = await response.json();
      return data.results;
    } catch {
      return [];
    }
  }
};
