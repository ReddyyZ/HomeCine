export type Movie = {
  id: number;
  year?: number;
  overview?: string;
  posterUrl?: string;
  videoDuration?: number;
  title: string;
  filePath: string;
  isSeries: boolean;
  numberOfSeasons?: number;
  createdAt: string;
  updatedAt: string;
  genres: string;
  originalName?: string;
};

export type Episode = {
  id: number;
  title: string;
  season: number;
  episodeNumber: number;
  filePath: string;
  movieId: number;
  posterUrl?: string;
  videoDuration?: number;
  createdAt: string;
  updatedAt: string;
};

export type episodeProgress = {
  progress: number;
  watched: boolean;
};

export type movieProgress = {
  progress?: number;
  isSeries: boolean;
  episodes?: Record<string, episodeProgress>;
  lastEpisodeWatched?: string;
  watched: boolean;
};

export type VideoMetadata = {
  title?: string;
  episodeTitle?: string;
  season?: number;
  episodeNumber?: number;
  movieId?: number;
};

export type AddMovieProps = {
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  filePath: string;
  isSeries: boolean;
  numberOfSeasons?: number;
  genreIds: number[];
  originalName?: string;
};
