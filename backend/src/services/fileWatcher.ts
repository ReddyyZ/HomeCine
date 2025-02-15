import chokidar from "chokidar";
import path from "path";
import {
  addEpisode,
  addMovie,
  deleteEpisodeByPath,
  deleteMovieByPath,
  findEpisodeByPath,
  movieExists,
} from "../functions/MovieFuncs";
import { searchMovie } from "./tmdb";

const mediaPath = path.join(__dirname, "../../media");
const posterUrl = "https://image.tmdb.org/t/p/original";

const isSeries = (filePath: string) => filePath.includes("/series/");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const extractMovieTitleFromPath = (filePath: string) => {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName;
};

const processMovie = async (filePath: string) => {
  const title = extractMovieTitleFromPath(filePath);
  const [movieInfo] = await searchMovie(title, false);

  try {
    await addMovie({
      title,
      filePath,
      isSeries: false,
      overview: movieInfo?.overview,
      year: movieInfo && new Date(movieInfo.first_air_date).getUTCFullYear(),
      posterUrl: movieInfo && posterUrl + movieInfo.poster_path,
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
    const episode = await addEpisode({
      title: episodeTitle,
      filePath,
      movieId: movie.id,
      season,
      episodeNumber,
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

export default async function initializeWatcher() {
  console.log("Waiting for database to be loaded...");
  await sleep(5000);

  const watcher = chokidar.watch(mediaPath, {
    persistent: true,
    ignoreInitial: false,
    depth: 99,
  });

  watcher
    .on("unlink", (filePath) => {
      const isSerie = isSeries(filePath);

      if (isSerie) {
        deleteEpisodeByPath(filePath);
      } else {
        deleteMovieByPath(filePath);
      }
    })
    .on("add", (filePath) => {
      const isSerie = isSeries(filePath);

      if (isSerie) {
        processSerie(filePath);
      } else {
        processMovie(filePath);
      }
    })
    .on("error", (error) => {
      console.error(`Watcher error: ${error}`);
    });

  console.log("Watcher initialized!");
}
