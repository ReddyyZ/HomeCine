import { useParams } from "react-router-dom";
import { Episode, Movie } from "../../types/movies";
import {
  getEpisodeById,
  getMovie,
  getMovieProgress,
  updateEpisodeProgress,
  updateMovieProgress,
} from "../../services/apiClient";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { baseURL } from "../../services/axios";
import { IoArrowBack } from "react-icons/io5";
import colors from "../../constants/colors";
import { formatVideoDuration } from "../../utils";

export default function Watch() {
  const { movieId, episodeId } = useParams();
  const [movieDetails, setMovieDetails] = useState<Movie>();
  const [episodeDetails, setEpisodeDetails] = useState<Episode>();
  const auth = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = episodeId
    ? `${baseURL}/movies/${movieId}/episode/${episodeId}/watch?token=${auth.user}`
    : `${baseURL}/movies/${movieId}/watch?token=${auth.user}`;

  const loadMovie = async () => {
    if (!auth.user) {
      return auth.logout();
    }
    if (!movieId) {
      return;
    }

    const movie = await getMovie(auth.user, movieId);
    if (!movie) {
      return;
    }
    if (movie.data?.error) {
      console.error(movie.data.error);
      return;
    }
    if (!movie.data) {
      console.error("No movie data found");
      window.history.back();
      return;
    }
    if (episodeId) {
      const episode = await getEpisodeById(auth.user, movieId, episodeId);
      if (!episode) {
        return;
      }
      if (episode.data?.error) {
        console.error(episode.data.error);
        return;
      }
      if (!episode.data) {
        console.error("No episode data found");
        window.history.back();
        return;
      }
      console.log(episode.data);
      setEpisodeDetails(episode.data);
    }

    setMovieDetails(movie.data);
    await getProgress();
  };

  const getProgress = async () => {
    if (!auth.user) {
      return auth.logout();
    }
    if (!movieId) {
      return;
    }

    const progress = await getMovieProgress(auth.user, movieId);
    if (!progress) {
      return;
    }
    if (progress.data?.error) {
      console.error(progress.data.error);
      return;
    }
    if (!progress.data) {
      console.error("No progress data found");
      return;
    }

    if (!videoRef.current) {
      return;
    }

    if (episodeId) {
      videoRef.current.currentTime = progress.data.episodes[episodeId].progress;
    } else {
      videoRef.current.currentTime = progress.data.progress;
    }
  };

  const sendProgress = async () => {
    if (!auth.user) {
      return auth.logout();
    }
    if (!movieId) {
      return;
    }
    if (!videoRef.current) {
      return;
    }

    const currentTime = videoRef.current?.currentTime || 0;

    if (currentTime % 5 < 0.1) {
      // Throttle updates
      if (!videoRef.current.paused) {
        console.log(movieId, currentTime);
        if (episodeId) {
          const res = await updateEpisodeProgress(
            auth.user,
            movieId,
            episodeId,
            currentTime,
          );
          console.log(res);
        } else {
          const res = await updateMovieProgress(
            auth.user,
            movieId,
            currentTime,
          );
          console.log(res);
        }
      }
    }
  };

  useEffect(() => {
    if (!movieId) {
      return;
    }
    loadMovie();
    const video = videoRef.current;

    video?.addEventListener("timeupdate", sendProgress);
    return () => {
      video?.removeEventListener("timeupdate", sendProgress);
    };
  }, []);

  return (
    <div className="p-8">
      <div className="fadein relative mx-auto max-w-4xl rounded-sm bg-gray-600 p-4">
        <button
          className="mb-4 flex cursor-pointer items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          onClick={() => window.history.back()}
        >
          <IoArrowBack size={24} fill={colors.text} />
          Go back
        </button>

        <div className="aspect-w-16 aspect-h-9 w-full max-w-4xl">
          <video
            ref={videoRef}
            id="video"
            src={videoUrl}
            controls
            className="h-full w-full rounded-sm"
          />
        </div>

        <div>
          {episodeId ? (
            <div className="mt-4">
              <p style={{ color: colors.mutedText }}>
                {movieDetails?.title} | Season {episodeDetails?.season} -
                Episode {episodeDetails?.episodeNumber}
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                {episodeDetails ? episodeDetails.title : movieDetails?.title}
              </h1>
            </div>
          ) : (
            <h1 className="mt-4 text-2xl font-bold">{movieDetails?.title}</h1>
          )}
          {episodeDetails?.videoDuration ? (
            <p className="mt-2">
              Duration: {formatVideoDuration(episodeDetails.videoDuration)}
            </p>
          ) : (
            movieDetails?.videoDuration && (
              <p className="mt-2">
                Duration: {formatVideoDuration(movieDetails.videoDuration)}
              </p>
            )
          )}
          {!movieDetails?.isSeries && (
            <p className="mt-2 text-sm">{movieDetails?.overview}</p>
          )}
        </div>
      </div>
    </div>
  );
}
