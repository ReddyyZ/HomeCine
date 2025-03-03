import { Request, Response } from "express";
import { addEpisode, addMovie, findMovieById } from "../functions/MovieFuncs";
import path from "path";
import { getThumbnail } from "../services/ffmpeg";

const mediaPath = path.join(__dirname, "../../media");

type VideoMetadata = {
  title: string;
  episodeTitle?: string;
  season?: number;
  episodeNumber?: number;
  posterUrl?: string;
  overview?: string;
  genreIds?: number[];
  movieId?: number;
  year?: number;
};

type VideoMetadataList = Record<string, VideoMetadata>;

export async function uploadFile(req: Request, res: Response) {
  const videos = req.body.videos
    ? (JSON.parse(req.body.videos) as VideoMetadataList)
    : null;
  const files = req.files as Express.Multer.File[];

  if (!videos) {
    res.status(400).json({ error: "Missing videos metadata" });
    return;
  }

  if (!files.length) {
    res.status(400).json({ error: "Missing files or error during upload" });
    return;
  }

  files.forEach(async (file) => {
    const video = videos[file.originalname];

    if (!video) {
      res
        .status(400)
        .json({ error: `Missing metadata for ${file.originalname}` });
      return;
    }

    const {
      title,
      episodeTitle,
      season,
      episodeNumber,
      year,
      movieId,
      genreIds,
      overview,
      posterUrl,
    } = video;
    const isSeries = movieId && episodeTitle && season && episodeNumber;

    if (!isSeries && !title) {
      res.status(400).json({ error: "Missing title" });
      return;
    }

    if (isSeries) {
      // let movie = movieId ? await findMovieById(movieId) : null;
      const movie = await findMovieById(movieId);
      const moviePath = path.join(
        mediaPath,
        "series",
        String(movie?.originalTitle),
      );
      const episodePath = path.join(
        moviePath,
        `S${String(season).length < 2 ? `0${season}` : season}E${String(episodeNumber).length < 2 ? `0${episodeNumber}` : episodeNumber} - ${episodeTitle}${path.extname(String(file.originalname))}`,
      );

      if (!movie) {
        res.status(400).json({ error: `Movie with id ${movieId} not found` });
        return;
      }
      // if (!movie) {
      //   movie = await addMovie({
      //     title: title,
      //     filePath: moviePath,
      //     isSeries: true,
      //     overview,
      //     year: year,
      //     posterUrl,
      //     genreIds: genreIds ? genreIds : [],
      //   });

      //   if (!movie) {
      //     console.error(`Error adding movie: ${title}`);
      //     return;
      //   }
      // }
      console.log(`Episode from movie: [${movie.id}]${movie.title}`);

      const thumbnail = await getThumbnail({
        filePath: episodePath,
        movieId: String(movie.id),
        episodeTitle,
      });

      const episode = await addEpisode({
        title: episodeTitle,
        filePath: episodePath,
        movieId: movie.id,
        season,
        episodeNumber,
        posterUrl: thumbnail,
      });

      if (!episode) {
        console.error(`Error adding episode: ${episodeTitle}`);
        return;
      }

      console.log(`Episode added: [${episode.id}]${episode.title}`);
    } else {
      const moviePath = path.join(
        mediaPath,
        "movies",
        `${title}${path.extname(file.originalname)}`,
      );
      const movie = await addMovie({
        title,
        filePath: moviePath,
        isSeries: false,
        overview,
        year,
        posterUrl,
        genreIds: genreIds ? genreIds : [],
      });

      if (!movie) {
        console.error(`Error adding movie: ${title}`);
        return;
      }

      console.log(`Movie added: [${movie.id}]${movie.title}`);
    }
  });

  // if (isSeries && (!season || !episodeNumber)) {
  //   res.status(400).json({ error: "Missing season or episodeNumber or episodeTitle" });
  //   return;
  // }

  if (req.files) {
    res.json({ success: true, files: req.files });
  }
}
