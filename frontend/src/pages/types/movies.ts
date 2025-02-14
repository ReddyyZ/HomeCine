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
