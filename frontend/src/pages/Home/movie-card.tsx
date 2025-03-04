import { Movie } from "../../types/movies";
import { Link } from "react-router-dom";
import Image from "../../components/Image";
import { IoPlayCircle } from "react-icons/io5";
import colors from "../../constants/colors";

function MovieCard(movie: Movie) {
  return (
    <Link
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      to={`/movie/${movie.id}`}
      className="movieCard fadein aspect-[9/13] h-72 flex-none"
      key={movie.id}
    >
      <Image
        src={movie.posterUrl}
        alt={movie.title}
        className="h-full w-full"
      />
      <div className="movieHover">
        <IoPlayCircle size={36} color={colors.text} />
      </div>
    </Link>
  );
}

export default MovieCard;
