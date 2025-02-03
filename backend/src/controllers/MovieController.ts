import { Request, Response } from "express";
import { findAllEpisodesByMovieId, findAllEpisodesFromSeason, findAllMovies, findAllSeries, findMovieById, getNumberOfSeasons } from "../functions/MovieFuncs";

export async function getMovies(req: Request, res: Response) {
  const movies = await findAllMovies();

  res.json(movies);
};

export async function getSeries(req: Request, res: Response) {
  const series = await findAllSeries();

  res.json(series);
};

export async function getSeasonsFromMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
  };

  const seasons = await getNumberOfSeasons(Number(movieId));

  res.json(seasons);
};

export async function getEpisodesFromSeason(req: Request, res: Response) {
  const { movieId, season } = req.params;
  if (!movieId || !season) {
    res.status(400).json({ error: "Missing movieId or season" });
  };

  const episodes = await findAllEpisodesFromSeason(Number(movieId), Number(season));

  res.json(episodes);
};

export async function getAllEpisodesByMovieId(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
  };

  const episodes = await findAllEpisodesByMovieId(Number(movieId));

  res.json(episodes);
};

export async function getMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
  };

  const movie = await findMovieById(Number(movieId));

  res.json(movie);
}