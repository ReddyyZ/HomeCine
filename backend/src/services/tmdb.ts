import axios from "axios";

axios.defaults.baseURL = "https://api.themoviedb.org/3";

type searchMovieResult = {
  adult: boolean,
  backdrop_path: string | null,
  genre_ids: number[],
  id: number,
  origin_country: string[],
  original_language: string,
  original_name: string,
  overview: string,
  popularity: number,
  poster_path: string,
  first_air_date: string,
  name: string,
  vote_average: number,
  vote_count: number
}

export const searchMovie = async (query: string, isSeries: boolean = false, lang?: string): Promise<searchMovieResult[]> => {
  if (!query) return [];
  
  const response = await axios.get(`/search/${isSeries ? 'tv' : 'movie'}?api_key=${process.env.TMDB_API_KEY}&query=${query}&include_adult=true${lang ? `&language=${lang}` : ""}`);
  return response.data.results;
}