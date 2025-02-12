import { useEffect, useState } from "react";
import Input from "../../components/Input";
import Logo from "../../components/Logo";
import { Movie } from "../types/movies";
import { useAuth } from "../../contexts/AuthProvider";
import { getMovies } from "../../services/apiClient";
import { IoPlayCircle } from "react-icons/io5";
import "./styles.css";
import colors from "../../constants/colors";
import DraggableList from "../../DraggableList";
import List from "../../components/List";

function MovieCard(movie: Movie) {
  return (
    <div className="h-80 w-56 movieCard">
      <img src={movie.posterUrl} alt={movie.title} />
      <div className="movieHover">
        <IoPlayCircle size={36} color={colors.text} />
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const auth = useAuth();

  const searchMovies = async () => {
    if (!auth.user) return auth.logout();

    const result = await getMovies(auth.user);
    if (!result) return;
    if (result.data.error) return alert(result.data.error);
    setMovies(result.data);

    setTimeout(() => {
      const movieCards = document.querySelectorAll(".movieCard");
      movieCards.forEach((card) => {
        setTimeout(() => card.classList.add("fadein"), 50);
      });
    }, 200);
    console.log(result.data);
  };

  useEffect(() => {
    searchMovies();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="min-h-96 w-full flex flex-col justify-center items-center p-6 ">
        <div className="max-w-lg w-full">
          <Logo size="large" />
          <p className="font-[Orbitron] text-center text-xl mb-6">
            Your home, your cinema!
          </p>

          <Input
            placeholder="Search for movies"
            id="search"
            type="search"
            value={search}
            onChangeText={setSearch}
          />
        </div>
      </div>
      <div className="py-4 px-6">
        <div className="max-w-7xl mx-auto bg-secondaryBg p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Movies</h2>
          <List type="movies">
            {movies.filter((movie) => !movie.isSeries).map(MovieCard)}
          </List>

          <h2 className="text-2xl mt-6 mb-4">Series</h2>
          <List type="series">
            {movies.filter((movie) => movie.isSeries).map(MovieCard)}
          </List>
        </div>
      </div>
    </div>
  );
}
