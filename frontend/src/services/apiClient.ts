import { AxiosProgressEvent } from "axios";
import { Movie, VideoMetadata } from "../pages/types/movies";
import apiClient from "./axios";

export type LoginProps = {
  email: string;
  password: string;
};

export type AdminLoginProps = {
  user: string;
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

export function uploadVideos(
  user: string,
  metadata: Record<string, VideoMetadata>,
  files: File[],
  onUploadProgress: (progress: number) => void,
) {
  const data = new FormData();
  data.append("videos", JSON.stringify(metadata));
  files.forEach((file) => {
    console.log(file);
    data.append("file", file);
  });

  return apiClient.post("/upload", data, {
    headers: {
      Authorization: user,
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data,
    onUploadProgress(progressEvent: AxiosProgressEvent) {
      const progress = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1),
      );

      onUploadProgress(progress);
    },
  });
}

export function deleteEpisode(
  user: string,
  movieId: string,
  episodeId: string,
) {
  return apiClient.delete(`/movies/${movieId}/episode/${episodeId}`, {
    headers: {
      Authorization: user,
    },
  });
}

export function deleteEpisodes(
  user: string,
  movieId: string,
  episodeIds: string[],
) {
  return apiClient.delete(`/movies/${movieId}/episodes`, {
    headers: {
      Authorization: user,
    },
    data: {
      episodeIds,
    },
  });
}

export function deleteMovie(user: string, movieId: string) {
  return apiClient.delete(`/movies/${movieId}`, {
    headers: {
      Authorization: user,
    },
  });
}

export function updateMovie(user: string, movieId: string, data: any) {
  return apiClient.put(`/movies/${movieId}`, data, {
    headers: {
      Authorization: user,
    },
  });
}

export function counts() {
  return apiClient.get("/counts", {
    // headers: {
    //   Authorization: user,
    // },
  });
}

export function loginAdmin(data: AdminLoginProps) {
  return apiClient.post("/admin/login", data);
}
