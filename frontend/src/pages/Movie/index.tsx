import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getEpisodesFromSeason,
  getMovie,
  getSeasonNumber,
} from "../../services/apiClient";
import { useAuth } from "../../contexts/AuthProvider";
import { Episode, Movie } from "../types/movies";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import colors from "../../constants/colors";
import { formatVideoDuration } from "../../utils";
import DropdownMenu from "../../components/DropdownMenu";
import Image from "../../components/Image";
import List from "../../components/List";

export default function MoviePage() {
  const { movieId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState<Movie>({} as Movie);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [episodeList, setEpisodeList] = useState<Episode[]>([] as Episode[]);

  const fetchMovieDetails = async () => {
    if (!auth.user) {
      return auth.logout();
    }

    if (!movieId) {
      return navigate("/");
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
    if (!movieId) {
      return navigate("/");
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
          <img
            src={movieDetails.posterUrl}
            alt={movieDetails.title}
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#121212] to-transparent p-6">
            <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
            <p className="text-[#B0B0B0]">{movieDetails.year}</p>
            <button className="mt-4 rounded bg-[#E50914] px-6 py-2 transition-colors hover:bg-[#D30813]">
              Play
            </button>
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
                {/* <div className="flex overflow-x-auto gap-4"> */}
                {episodeList.map((episode) => (
                  <div key={episode.id} className="w-60">
                    <Image
                      src="/path/to/related-thumbnail.jpg"
                      alt="Related Movie"
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                    <p className="mt-2">{episode.title}</p>
                    {episode.videoDuration && (
                      <p>{formatVideoDuration(episode.videoDuration)}</p>
                    )}
                  </div>
                ))}
                {/* </div> */}
              </List>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
