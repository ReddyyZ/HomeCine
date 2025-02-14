import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getEpisodesFromSeason,
  getMovie,
  getMovieProgress,
  getSeasonNumber,
} from "../../services/apiClient";
import { useAuth } from "../../contexts/AuthProvider";
import { Episode, Movie } from "../types/movies";
import { useEffect, useState } from "react";
import { IoArrowBack, IoPlayCircle } from "react-icons/io5";
import colors from "../../constants/colors";
import { formatVideoDuration } from "../../utils";
import DropdownMenu from "../../components/DropdownMenu";
import Image from "../../components/Image";
import List from "../../components/List";
import Button from "../../components/Button";

const EpisodeItem = (episode: Episode) => {
  return (
    <div key={episode.id} className="w-60">
      <div className="relative">
        <Image
          src="/path/to/related-thumbnail.jpg"
          alt="Related Movie"
          className="aspect-video w-full rounded-lg object-cover"
        />
        <Link
          to={`/movie/2/episode/${episode.id}/watch`}
          className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center bg-[#00000067] opacity-0 transition-opacity duration-200 hover:opacity-100"
        >
          <IoPlayCircle size={36} color={colors.text} />
        </Link>
      </div>
      <p className="mt-2">{episode.title}</p>
      {episode.videoDuration && (
        <p>{formatVideoDuration(episode.videoDuration)}</p>
      )}
    </div>
  );
};

export default function MoviePage() {
  const { movieId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState<Movie>({} as Movie);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [episodeList, setEpisodeList] = useState<Episode[]>([] as Episode[]);

  if (!movieId) {
    return navigate("/");
  }

  const fetchMovieDetails = async () => {
    if (!auth.user) {
      return auth.logout();
    }

    try {
      const movie = await getMovie(auth.user, movieId);
      if (movie.data?.error) {
        console.error(movie.data.error);
        return navigate("/");
      }
      if (movie.status === 401) auth.logout();

      if (!movie.data) {
        return navigate("/");
      }

      if (movie.data.isSeries) {
        // Fetch episodes
        const episodes = await getSeasonNumber(auth.user, movieId);

        setMovieDetails({
          ...movie.data,
          numberOfSeasons: episodes.data.seasons,
        });
      } else {
        setMovieDetails(movie.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEpisodes = async () => {
    if (!auth.user) {
      return auth.logout();
    }

    try {
      const episodes = await getEpisodesFromSeason(
        auth.user,
        movieId,
        currentSeason,
      );

      if (episodes.data?.error) {
        console.error(episodes.data.error);
        return navigate("/");
      }
      if (episodes.status === 401) auth.logout();

      if (!episodes.data) {
        return navigate("/");
      }

      setEpisodeList(episodes.data);
    } catch (error) {
      console.error(error);
      return navigate("/");
    }
  };

  const playMovie = async () => {
    if (movieDetails.isSeries) {
      if (!auth.user) {
        return auth.logout();
      }

      const progress = await getMovieProgress(auth.user, movieId);
      if (progress.data?.error) {
        console.error(progress.data.error);
        return navigate("/");
      }
      if (progress.status === 401) auth.logout();

      const lastEpisode = progress.data?.lastEpisodeWatched;

      if (lastEpisode) {
        return navigate(`/movie/${movieId}/episode/${lastEpisode}/watch`);
      } else {
        return navigate(`/movie/${movieId}/episode/${episodeList[0].id}/watch`);
      }
    } else {
      return navigate(`/movie/${movieId}/watch`);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  useEffect(() => {
    fetchEpisodes();
    console.log("episode fetched");
  }, [currentSeason]);

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-[#E0E0E0]">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-8 h-96">
          <Link
            to={"/"}
            className="absolute top-1 left-1 cursor-pointer p-2 transition-opacity duration-200 hover:opacity-70"
          >
            <IoArrowBack size={28} fill={colors.text} />
          </Link>
          <Image
            src={movieDetails.posterUrl}
            alt={movieDetails.title}
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#121212] to-transparent p-6">
            <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
            <p className="text-[#B0B0B0]">{movieDetails.year}</p>

            <Button onClick={playMovie} className="mt-2 max-h-9 max-w-32">
              Play
            </Button>
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-8 rounded-lg bg-[#252525] p-6">
          <h2 className="mb-4 text-2xl font-bold">Details</h2>
          <p className="mb-4 text-[#B0B0B0]">{movieDetails.overview}</p>
          <div className="grid grid-cols-2 gap-4">
            {movieDetails.genres && (
              <div>
                <p className="font-semibold text-[#B0B0B0]">Genre</p>
                <p>{JSON.parse(movieDetails.genres).join(", ")}</p>
              </div>
            )}
            {movieDetails.videoDuration ? (
              <div>
                <p className="font-semibold text-[#B0B0B0]">Duration</p>
                <p>{formatVideoDuration(movieDetails.videoDuration)}</p>
              </div>
            ) : (
              movieDetails.isSeries && (
                <div>
                  <p className="font-semibold text-[#B0B0B0]">Seasons</p>
                  <p>{movieDetails.numberOfSeasons}</p>
                </div>
              )
            )}
            {movieDetails.originalName && (
              <div>
                <p className="font-semibold text-[#B0B0B0]">Original Name</p>
                <p>{movieDetails.originalName}</p>
              </div>
            )}
          </div>
        </div>

        {movieDetails.isSeries && (
          <>
            {/* Episode list */}
            <div>
              <div className="w-full max-w-60">
                <DropdownMenu
                  items={[...Array(movieDetails.numberOfSeasons).keys()].map(
                    (i) => ({ id: i + 1, value: `Season ${i + 1}` }),
                  )}
                  onSelect={(item) => {
                    setCurrentSeason(item.id);
                  }}
                  currentItem={currentSeason}
                  containerStyle={{
                    marginBottom: 24,
                  }}
                />
              </div>

              <h2 className="mb-4 text-2xl font-bold">Episodes</h2>

              <List
                type={"search"}
                style={{
                  minHeight: 200,
                }}
              >
                {episodeList.map(EpisodeItem)}
              </List>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
