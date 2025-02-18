import path from "path";
import {
  addEpisode,
  addMovie,
  // deleteEpisodeByPath,
  // deleteMovieByPath,
  findEpisodeByPath,
  movieExists,
} from "../functions/MovieFuncs";
import { searchMovie } from "./tmdb";
import fs from "fs";
import { getThumbnail } from "./ffmpeg";

const mediaPath = path.join(__dirname, "../../media");
const posterUrl = "https://image.tmdb.org/t/p/original";

const extractMovieTitleFromPath = (filePath: string) => {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName;
};

const processMovie = async (filePath: string) => {
  const title = extractMovieTitleFromPath(filePath);
  const [movieInfo] = await searchMovie(title, false);

  try {
    if (await movieExists(filePath)) {
      console.log(`Movie already exists: ${filePath}`);
      return;
    }

    const thumbnail = await getThumbnail({
      filePath,
      movieTitle: title,
    });

    await addMovie({
      title,
      filePath,
      isSeries: false,
      overview: movieInfo?.overview,
      year: movieInfo && new Date(movieInfo.first_air_date).getUTCFullYear(),
      posterUrl: thumbnail
        ? thumbnail
        : movieInfo && posterUrl + movieInfo.poster_path,
      genreIds: movieInfo && movieInfo.genre_ids,
    });
  } catch (error) {
    console.error("Error adding movie:", error);
  }
};

const processSerie = async (filePath: string) => {
  if (await findEpisodeByPath(filePath)) {
    console.log(`Episode already exists: ${filePath}`);
    return;
  }

  const episodeInfo = path
    .basename(filePath, path.extname(filePath))
    .match(/^S(\d{2})E(\d{2})\s*-\s*(.*)$/);
  if (!episodeInfo) {
    console.error(`Invalid episode name: ${filePath}`);
    return;
  }

  const moviePath = path.join(filePath, "..");
  const movieTitle = path.basename(moviePath);
  const [movieInfo] = await searchMovie(movieTitle, true);

  const season = parseInt(episodeInfo[1]);
  const episodeNumber = parseInt(episodeInfo[2]);
  const episodeTitle = episodeInfo[3];

  console.log(
    `Processing episode: ${episodeTitle} S${season}E${episodeNumber} - ${episodeTitle}`,
  );

  try {
    // Find or create movie
    let movie = await movieExists(moviePath);
    if (!movie) {
      movie = await addMovie({
        title: movieTitle,
        filePath: moviePath,
        isSeries: true,
        overview: movieInfo && movieInfo.overview,
        year: movieInfo && new Date(movieInfo.first_air_date).getUTCFullYear(),
        posterUrl: movieInfo && posterUrl + movieInfo.poster_path,
        genreIds: movieInfo && movieInfo.genre_ids,
      });

      if (!movie) {
        console.error(`Error adding movie: ${movieTitle}`);
        return;
      }
    }
    console.log(`Episode from movie: [${movie.id}]${movie.title}`);

    // Add episode
    const thumbnail = await getThumbnail({
      filePath,
      movieTitle,
      episodeTitle,
    });

    const episode = await addEpisode({
      title: episodeTitle,
      filePath,
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
  } catch (error) {
    console.error(`Error processing episode: ${error}`);
  }
};

export default function initialFileScan() {
  const seriesPath = path.join(mediaPath, "series");
  const moviesPath = path.join(mediaPath, "movies");

  const processFiles = async (dirPath: string, isSeries: boolean) => {
    if (!fs.existsSync(dirPath)) {
      return fs.mkdirSync(dirPath, {
        recursive: true,
      });
    }

    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.join(dirPath, file);

      if (isSeries) {
        if (!fs.lstatSync(filePath).isDirectory()) {
          return;
        }

        fs.readdirSync(filePath).forEach((episode) => {
          processSerie(path.join(filePath, episode));
        });
      } else {
        processMovie(filePath);
      }
    });
  };

  processFiles(seriesPath, true);
  processFiles(moviesPath, false);
}
