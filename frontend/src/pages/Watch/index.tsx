import { useParams } from "react-router-dom";
import { Movie } from "../types/movies";
import {
  getMovie,
  getMovieProgress,
  updateMovieProgress,
} from "../../services/apiClient";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { baseURL } from "../../services/axios";
import { IoArrowBack } from "react-icons/io5";
import colors from "../../constants/colors";
import { formatVideoDuration } from "../../utils";

export default function Watch() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState<Movie>();
  const auth = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

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
      return;
    }
    if (movie.data.isSeries) {
      console.error("This is a series, not a movie");
      return;
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

    videoRef.current.currentTime = progress.data.progress;
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
        const res = await updateMovieProgress(auth.user, movieId, currentTime);
        console.log(res);
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
      <div className="bg-secondaryBg fadein relative mx-auto max-w-4xl rounded-sm p-4">
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
            src={`${baseURL}/movies/${movieId}/watch?token=${auth.user}`}
            controls
            className="h-full w-full rounded-sm"
          />
        </div>

        <div>
          <h1 className="mt-4 text-2xl font-bold">{movieDetails?.title}</h1>
          {movieDetails?.videoDuration && (
            <p className="mt-2">
              Duration: {formatVideoDuration(movieDetails?.videoDuration)}
            </p>
          )}
          <p className="mt-2 text-sm">{movieDetails?.overview}</p>
        </div>
      </div>
    </div>
  );
}
