import { Request, Response } from "express";
import {
  addMovieProps,
  deleteEpisodeById,
  deleteMovieById,
  findAllEpisodesByMovieId,
  findAllEpisodesFromSeason,
  findAllMovies,
  findAllSeries,
  findMovieById,
  getNumberOfSeasons,
  updateMovieById,
} from "../functions/MovieFuncs";

export async function getMovies(req: Request, res: Response) {
  const movies = await findAllMovies();

  res.json(movies);
}

export async function getMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }

  const movie = await findMovieById(Number(movieId));

  res.json(movie);
}

export async function deleteMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }

  const result = await deleteMovieById(Number(movieId));

  res.status(result.errorCode ? result.errorCode : 200).json(result);
}

export async function getSeries(req: Request, res: Response) {
  const series = await findAllSeries();

  res.json(series);
}

export async function getSeasonsFromMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }

  const seasons = await getNumberOfSeasons(Number(movieId));

  res.json(seasons);
}

export async function getEpisodesFromSeason(req: Request, res: Response) {
  const { movieId, season } = req.params;
  if (!movieId || !season) {
    res.status(400).json({ error: "Missing movieId or season" });
    return;
  }

  const episodes = await findAllEpisodesFromSeason(
    Number(movieId),
    Number(season),
  );

  res.json(episodes);
}

export async function getAllEpisodesByMovieId(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }

  const episodes = await findAllEpisodesByMovieId(Number(movieId));

  res.json(episodes);
}

export async function updateMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  const props: Partial<addMovieProps> = req.body;
  if (!movieId || !props) {
    res.status(400).json({ error: "Missing movieId or props" });
    return;
  }

  const result = await updateMovieById(Number(movieId), props);

  res.status(result.errorCode ? result.errorCode : 200).json(result);
}

export async function deleteEpisode(req: Request, res: Response) {
  const { episodeId } = req.params;
  if (!episodeId) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const result = await deleteEpisodeById(Number(episodeId));

  res.status(result.errorCode ? result.errorCode : 200).json(result);
}
