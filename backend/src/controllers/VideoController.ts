import { Request, Response } from "express";
import {
  findEpisodeById,
  findEpisodeFromSeason,
  findMovieById,
} from "../functions/MovieFuncs";
import { streamVideo } from "../functions/VideoFuncs";
import { getUserByToken, updateUser } from "../functions/UserFuncs";
import { getVideoDuration } from "../services/ffmpeg";

export async function watchMovie(req: Request, res: Response) {
  const { movieId } = req.params;
  const token = req.headers.authorization;

  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const movie = await findMovieById(Number(movieId));
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }

  if (movie.isSeries) {
    res.status(400).json({
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

export async function getProgress(req: Request, res: Response) {
  const { movieId, episodeId } = req.body;
  const token = req.headers.authorization;

  if (!movieId) {
    res.status(400).json({ error: "Missing movieId" });
    return;
  }
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const watchedMovies = user.watchedMovies || {};
  const movie = watchedMovies[movieId];
  const episodes = movie?.episodes;

  if (!movie) {
    res.json({ progress: 0, watched: false });
    return;
  }

  if (episodeId) {
    if (!episodes) {
      res.json({ progress: 0, watched: false });
      return;
    }

    const episode = episodes[episodeId];
    if (!episode) {
      res.json({ progress: 0, watched: false });
      return;
    }

    res.json(episode);
    return;
  } else {
    res.json(movie);
  }
}

export async function updateProgress(req: Request, res: Response) {
  const { movieId, episodeId, progress } = req.body;
  const token = req.headers.authorization;

  if (!movieId || !progress) {
    res.status(400).json({ error: "Missing movieId or progress" });
    return;
  }
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const movie = await findMovieById(Number(movieId));
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }

  const watchedMovies = user.watchedMovies || {};

  if (episodeId) {
    // Save progress for episode
    const episode = await findEpisodeById(Number(episodeId));
    if (!episode) {
      res.status(404).json({ error: "Episode not found" });
      return;
    }

    const videoDuration = await getVideoDuration(episode.filePath);
    const watched = progress >= videoDuration * 0.95;

    if (watchedMovies.hasOwnProperty(movieId)) {
      if (watchedMovies[movieId].episodes) {
        watchedMovies[movieId].episodes[episodeId] = {
          progress,
          watched,
        };
      } else {
        watchedMovies[movieId].episodes = {
          [episodeId]: {
            progress,
            watched,
          },
        };
      }
    } else {
      watchedMovies[movieId] = {
        isSeries: true,
        episodes: {
          [episodeId]: {
            progress,
            watched,
          },
        },
        watched: false,
      };
    }
  } else {
    if (movie.isSeries) {
      res.status(400).json({
        error: "This is a series id, use the episode id to save progress",
      });
      return;
    }
    // Save progress for movie
    const videoDuration = await getVideoDuration(movie.filePath);
    const watched = progress >= videoDuration * 0.95;

    console.log(`videoDuration: ${videoDuration} - watched: ${watched}`);

    watchedMovies[movieId] = {
      progress,
      watched,
      isSeries: false,
    };
  }

  try {
    await updateUser(user.id, { watchedMovies });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save progress: " + error });
  }
}
