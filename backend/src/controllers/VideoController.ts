import { Request, Response } from "express";
import { findEpisodeFromSeason, findMovieById } from "../functions/MovieFuncs";
import { streamVideo } from "../functions/VideoFuncs";

export async function watchMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }

  const movie = await findMovieById(Number(movieId));
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  if (movie.isSeries) {
    res
      .status(400)
      .json({
        error:
          "This is a series, use /movies/:movieId/seasons to get the seasons",
      });
    return;
  }

  streamVideo(movie.filePath, req, res);
}

export async function watchEpisode(req: Request, res: Response) {
  const { movieId, season, episodeNumber } = req.params;
  if (!movieId || !season || !episodeNumber) {
    res
      .status(400)
      .json({ error: "Missing movieId or season or episodeNumber" });
    return;
  }

  const episode = await findEpisodeFromSeason(
    Number(movieId),
    Number(season),
    Number(episodeNumber),
  );
  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  streamVideo(episode.filePath, req, res);
}
