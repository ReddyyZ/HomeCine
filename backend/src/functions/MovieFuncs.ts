import { Sequelize, Op } from "sequelize";
import { Episode, Movie } from "../model/Movie";

type addMovieProps = {
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  filePath: string;
  isSeries: boolean;
  numberOfSeasons?: number;
};
  
export async function addMovie(props: addMovieProps) {
  // Check if movie already exists
  const movieExists = await Movie.findOne({
    where: {
      filePath: props.filePath
    }
  });
  if (movieExists) {
    console.log(`Movie ${props.title} already exists!`);
    return;
  }

  try {
    const movie = await Movie.create({
      title: props.title,
      year: props.year,
      overview: props.overview,
      posterUrl: props.posterUrl,
      filePath: props.filePath,
      isSeries: props.isSeries,
      numberOfSeasons: props.numberOfSeasons
    });

    console.log(`Movie ${props.title} saved! ${movie.id}`);
    return movie;
  } catch (error) {
    console.error(`Error saving movie: ${error}`);
  }
}

export async function deleteMovieByPath(filePath: string) {
  const movie = await Movie.findOne({
    where: {
      filePath
    }
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
};

export async function updateMovieById(id: number, props: Partial<addMovieProps>) {
  const movie = await Movie.findByPk(id);

  if (!movie) {
    console.log(`Movie with id ${id} not found`);
    return;
  }

  try {
    await movie.update(props);
    console.log(`Movie ${movie.title} updated!`);

    return true;
  } catch (error) {
    console.error(`Error updating movie: ${error}`);
    return false;
  }
}

export async function findAllMovies() {
  const movies = await Movie.findAll();
  return movies.map(movie => movie.toJSON());
}

type addEpisodeProps = {
  title: string;
  filePath: string;
  movieId: number;
  season: number;
  episodeNumber: number;
};

// Series functions

export async function addEpisode(params: addEpisodeProps) {
  // Check if episode already exists
  const episodeExists = await Episode.findOne({
    where: {
      filePath: params.filePath
    }
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
      episodeNumber: params.episodeNumber
    });
  
    console.log(`Episode ${params.title} saved!`);
    return episode;
  } catch (error) {
    console.error(`Error saving episode: ${error}`);
  }
};

export async function deleteEpisodeByPath(filePath: string) {
  const episode = await Episode.findOne({
    where: {
      filePath
    }
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
    };
  } catch (error) {
    console.error(`Error deleting episode: ${error}`);
  }
};

export async function updateEpisodeById(id: number, props: Partial<addEpisodeProps>) {
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
      filePath
    }
  });
};

export async function findAllSeries() {
  const series = await Movie.findAll({
    where: {
      isSeries: true
    }
  });
  return series.map(serie => serie.toJSON());
};

export function findAllEpisodesByMovieId(movieId: number) {
  return Episode.findAll({
    where: {
      movieId
    }
  }).then(episodes => episodes.map(episode => episode.toJSON()));
};

export async function findAllEpisodesFromSeason(movieId: number, season: number) {
  try {
    const episodes = await Episode.findAll({
      where: {
        movieId,
        season
      }
    });
    return episodes.map(episode => episode.toJSON());
  } catch (error) {
    console.error(`Error finding episodes: ${error}`);
    return [];
  }
};

export async function getNumberOfSeasons(movieId: number) {
  try {
    const [episode] = await Episode.findAll({
      where: {
        movieId,
        season: {
          [Op.eq]: Sequelize.literal(`(SELECT MAX(season) FROM episodes WHERE movieId = ${movieId})`)
        }
      }
    });
  
    return episode.season;
  } catch (error) {
    console.error(`Error getting number of seasons: ${error}`);
    return 0;
  }
}