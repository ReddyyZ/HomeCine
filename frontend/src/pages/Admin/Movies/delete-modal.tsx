import { memo, useEffect } from "react";
import Button from "../../../components/Button";
import { Movie } from "../../types/movies";

function DeleteMovieModal({
  movie,
  setModalClassName,
  handleDeleteMovie,
  onDismiss,
}: {
  movie: Movie;
  setModalClassName: (value: string) => void;
  handleDeleteMovie: (movie: Movie) => void;
  onDismiss: () => void;
}) {
  useEffect(() => {
    setModalClassName("max-w-72 md: max-w-80 max-h-40!");
  }, []);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="mb-1 text-lg">
          Delete <strong>{movie.title}</strong> movie?
        </p>
        <p>This action is irreversible!</p>
      </div>
      <div className="flex">
        <Button
          className="rounded-r-none! border border-gray-300 bg-gray-500!"
          onClick={() => handleDeleteMovie(movie)}
        >
          Yes
        </Button>
        <Button
          className="rounded-l-none! border border-l-0 border-gray-300 bg-transparent!"
          onClick={onDismiss}
        >
          No
        </Button>
      </div>
    </div>
  );
}

export default memo(DeleteMovieModal);
