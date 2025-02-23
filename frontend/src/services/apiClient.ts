import apiClient from "./axios";

export type LoginProps = {
  email: string;
  password: string;
};

export type RegisterProps = {
  name: string;
  email: string;
  password: string;
};

export function login(data: LoginProps) {
  return apiClient.post("/login", data);
}

export function register(data: RegisterProps) {
  return apiClient.post("/register", data);
}

export function getMovies(user: string) {
  return apiClient.get("/movies", {
    headers: {
      Authorization: user,
    },
  });
}

export function getMovie(user: string, movieId: string) {
  return apiClient.get(`/movies/${movieId}`, {
    headers: {
      Authorization: user,
    },
  });
}

export function getSeasonNumber(user: string, movieId: string) {
  return apiClient.get(`/movies/${movieId}/seasons`, {
    headers: {
      Authorization: user,
    },
  });
}

export function getEpisodesFromSeason(
  user: string,
  movieId: string,
  season: number,
) {
  return apiClient.get(`/movies/${movieId}/season/${season}`, {
    headers: {
      Authorization: user,
    },
  });
}

export function getAllEpisodesFromMovie(user: string, movieId: string) {
  return apiClient.get(`/movies/${movieId}/episodes`, {
    headers: {
      Authorization: user,
    },
  });
}

export function getMovieProgress(user: string, movieId: string) {
  return apiClient.get(`/progress?movieId=${movieId}&token=${user}`);
}

export function updateMovieProgress(
  user: string,
  movieId: string,
  progress: number,
) {
  return apiClient.post(
    "/progress",
    {
      movieId,
      progress,
    },
    {
      headers: {
        Authorization: user,
      },
    },
  );
}

export function updateEpisodeProgress(
  user: string,
  movieId: string,
  episodeId: string,
  progress: number,
) {
  return apiClient.post(
    "/progress",
    {
      movieId,
      episodeId,
      progress,
    },
    {
      headers: {
        Authorization: user,
      },
    },
  );
}

export function getEpisodeById(
  user: string,
  movieId: string,
  episodeId: string,
) {
  return apiClient.get(`/movies/${movieId}/episode/${episodeId}`, {
    headers: {
      Authorization: user,
    },
  });
}
