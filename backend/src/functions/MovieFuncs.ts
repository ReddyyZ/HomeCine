import { Sequelize, Op } from "sequelize";
import { Episode, Movie } from "../models/Movie";
import fs from "fs";
import { promisify } from "util";
import { getVideoDuration } from "../services/ffmpeg";
import { GenreList } from "../constants";

const rmAsync = promisify(fs.rm);

export type addMovieProps = {
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  filePath: string;
  isSeries: boolean;
  numberOfSeasons?: number;
  genreIds: number[];
  originalName?: string;
};

type defaultResult = {
  success?: boolean;
  errorCode?: number;
  error?: string;
};

export async function addMovie(props: addMovieProps) {
  // Check if movie already exists
  const movieExists = await Movie.findOne({
    where: {
      filePath: props.filePath,
    },
  });
  if (movieExists) {
    console.log(`Movie ${props.title} already exists!`);
    return null;
  }

  try {
    const genres: string[] = [];

    if (props.genreIds) {
      props.genreIds.forEach((genreId: number) => {
        const genre = GenreList.find((genre) => genre.id === genreId);
        if (genre) {
          genres.push(genre.name);
        }
      });
    }

    const movie = await Movie.create({
      originalTitle: props.title,
      title: props.title,
      year: props.year,
      overview: props.overview,
      posterUrl: props.posterUrl,
      filePath: props.filePath,
      isSeries: props.isSeries,
      numberOfSeasons: props.numberOfSeasons,
      videoDuration: !props.isSeries
        ? await getVideoDuration(props.filePath)
        : undefined,
      genres: JSON.stringify(genres),
    });

    console.log(`Movie ${props.title} saved! ${movie.id}`);
    return movie;
  } catch (error) {
    console.error(`Error saving movie: ${error}`);
    return null;
  }
}

export async function deleteMovieByPath(filePath: string) {
  const movie = await Movie.findOne({
    where: {
      filePath,
    },
  });

  if (!movie) {
    console.log(`Movie with path ${filePath} not found`);
    return;
  }

  try {
    await movie.destroy();
    console.log(`Movie ${movie.title} deleted!`);
  } catch (error) {
    console.error(`Error deleting movie: ${error}`);
  }
}

export async function deleteMovieById(id: number): Promise<defaultResult> {
  const movie = await Movie.findByPk(id);
  if (!movie) {
    console.log(`Movie with id ${id} not found`);
    return {
      errorCode: 404,
      error: "Movie not found",
    };
  }

  try {
    if (movie.isSeries) {
      deleteAllEpisodesFromMovieId(id);
    }

    await movie.destroy();
    await rmAsync(movie.filePath, {
      recursive: true,
      force: true,
    });

    console.log(`Movie ${movie.title} deleted!`);
    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error deleting movie: ${error}`);
    return {
      errorCode: 500,
      error: `Error deleting movie: ${error}`,
    };
  }
}

export async function updateMovieById(
  id: number,
  props: Partial<addMovieProps>,
): Promise<defaultResult> {
  const movie = await Movie.findByPk(id);

  if (!movie) {
    console.log(`Movie with id ${id} not found`);
    return {
      errorCode: 404,
      error: "Movie not found",
    };
  }

  try {
    await movie.update(props);
    console.log(`Movie ${movie.title} updated!`);

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error updating movie: ${error}`);
    return {
      errorCode: 500,
      error: `Error updating movie: ${error}`,
    };
  }
}

export async function findAllMovies() {
  try {
    const movies = await Movie.findAll();
    return movies.map((movie) => movie.toJSON());
  } catch (error) {
    console.error(`Error finding movies: ${error}`);
    return [];
  }
}

export function findMovieById(movieId: number) {
  return Movie.findByPk(movieId);
}

export function movieExists(filePath: string): Promise<Movie | null> {
  try {
    return Movie.findOne({
      where: {
        filePath,
      },
    });
  } catch (error) {
    console.error(`Error checking if movie exists: ${error}`);
    return Promise.resolve(null);
  }
}

type addEpisodeProps = {
  title: string;
  filePath: string;
  movieId: number;
  season: number;
  episodeNumber: number;
  posterUrl?: string;
};

// Series functions

export async function addEpisode(params: addEpisodeProps) {
  // Check if episode already exists
  const episodeExists = await Episode.findOne({
    where: {
      filePath: params.filePath,
    },
  });
  if (episodeExists) {
    console.log(`Episode ${params.title} already exists!`);
    return;
  }

  try {
    const episode = await Episode.create({
      title: params.title,
      filePath: params.filePath,
      movieId: params.movieId,
      season: params.season,
      episodeNumber: params.episodeNumber,
      posterUrl: params.posterUrl,
      videoDuration: await getVideoDuration(params.filePath),
    });

    console.log(`Episode ${params.title} saved!`);
    return episode;
  } catch (error) {
    console.error(`Error saving episode: ${error}`);
  }
}

export async function deleteEpisodeByPath(filePath: string) {
  const episode = await Episode.findOne({
    where: {
      filePath,
    },
  });

  if (!episode) {
    console.log(`Episode with path ${filePath} not found`);
    return;
  }

  try {
    await episode.destroy();
    console.log(`Episode ${episode.title} deleted!`);

    const episodeList = await findAllEpisodesByMovieId(episode.movieId);
    if (episodeList.length === 0) {
      const movie = await Movie.findByPk(episode.movieId);
      if (movie) {
        await movie.destroy();
        console.log(`Movie ${movie.title} deleted!`);
      }
    }
  } catch (error) {
    console.error(`Error deleting episode: ${error}`);
  }
}

export async function deleteEpisodeById(id: number): Promise<defaultResult> {
  const episode = await Episode.findByPk(id);

  if (!episode) {
    console.log(`Episode with id ${id} not found`);
    return {
      errorCode: 404,
      error: "Episode not found",
    };
  }

  try {
    await episode.destroy();
    await rmAsync(episode.filePath);

    console.log(`Episode ${episode.title} deleted!`);
    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error deleting episode: ${error}`);
    return {
      errorCode: 500,
      error: `Error deleting episode: ${error}`,
    };
  }
}

export async function updateEpisodeById(
  id: number,
  props: Partial<addEpisodeProps>,
) {
  const episode = await Episode.findByPk(id);

  if (!episode) {
    console.log(`Episode with id ${id} not found`);
    return;
  }

  try {
    await episode.update(props);
    console.log(`Episode ${episode.title} updated!`);
  } catch (error) {
    console.error(`Error updating episode: ${error}`);
  }
}

export function findEpisodeByPath(filePath: string) {
  return Episode.findOne({
    where: {
      filePath,
    },
  });
}

export function findEpisodeById(id: number) {
  return Episode.findByPk(id);
}

export function findEpisodeFromSeason(
  movieId: number,
  season: number,
  episodeNumber: number,
) {
  return Episode.findOne({
    where: {
      movieId,
      season,
      episodeNumber,
    },
  });
}

export async function findAllSeries() {
  const series = await Movie.findAll({
    where: {
      isSeries: true,
    },
  });
  return series.map((serie) => serie.toJSON());
}

export async function findAllEpisodesByMovieId(movieId: number) {
  const episodes = await Episode.findAll({
    where: {
      movieId,
    },
  });
  return episodes.map((episode) => episode.toJSON());
}

export async function findAllEpisodesFromSeason(
  movieId: number,
  season: number,
) {
  try {
    const episodes = await Episode.findAll({
      where: {
        movieId,
        season,
      },
    });
    return episodes.map((episode) => episode.toJSON());
  } catch (error) {
    console.error(`Error finding episodes: ${error}`);
    return [];
  }
}

export async function getNumberOfSeasons(movieId: number) {
  try {
    const [episode] = await Episode.findAll({
      where: {
        movieId,
        season: {
          [Op.eq]: Sequelize.literal(
            `(SELECT MAX(season) FROM episodes WHERE movieId = ${movieId})`,
          ),
        },
      },
    });
    if (!episode) {
      return {
        seasons: 0,
      };
    }

    return {
      seasons: episode.season,
    };
  } catch (error) {
    console.error(`Error getting number of seasons: ${error}`);
    return {
      seasons: 0,
    };
  }
}

export function deleteAllEpisodesFromMovieId(movieId: number) {
  return Episode.destroy({
    where: {
      movieId,
    },
  });
}
