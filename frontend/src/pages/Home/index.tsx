import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import Logo from "../../components/Logo";
import { Movie } from "../types/movies";
import { useAuth } from "../../contexts/AuthProvider";
import { getMovies } from "../../services/apiClient";
import { IoPlayCircle } from "react-icons/io5";
import "./styles.css";
import colors from "../../constants/colors";
import List from "../../components/List";
import LoadingIndicator from "../../components/LoadingIndicator";

function MovieCard(movie: Movie) {
  return (
    <div className="movieCard fadein h-80 w-56" key={movie.id}>
      <img src={movie.posterUrl} alt={movie.title} />
      <div className="movieHover">
        <IoPlayCircle size={36} color={colors.text} />
      </div>
    </div>
  );
}

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // Estado para armazenar todos os filmes
  const [loading, setLoading] = useState(false);
  const moviesWrapperRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();

  const loadMovies = async () => {
    if (!auth.user) return auth.logout();
    if (loading) return;

    setLoading(true);

    try {
      const result = await getMovies(auth.user);
      if (!result) return;
      if (result.data.error) return alert(result.data.error);

      const moviesResult = result.data as Movie[];

      setAllMovies(moviesResult); // Armazena todos os filmes
      setMovies(moviesResult); // Inicialmente, exibe todos os filmes
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const showMovies = (searchInput: string) => {
    moviesWrapperRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    const filtered = allMovies.filter((movie) =>
      removeAccents(movie.title)
        .toLowerCase()
        .includes(removeAccents(searchInput).toLowerCase()),
    );

    setMovies(filtered);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex min-h-96 w-full flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <Logo size="large" />
          <p className="mb-6 text-center font-[Orbitron] text-xl">
            Your home, your cinema!
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showMovies(search);
            }}
          >
            <Input
              placeholder="Search for movies"
              id="search"
              type="search"
              value={search}
              onChangeText={setSearch}
            />
          </form>
        </div>
      </div>
      <div className="relative px-6 py-4" ref={moviesWrapperRef}>
        {loading && (
          <div
            className="appear-animation z-20 mb-2 flex items-center justify-center rounded-sm"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(5px)",
              width: "100%",
              height: "100%",
            }}
          >
            <LoadingIndicator size="large" />
          </div>
        )}
        <div className="bg-secondaryBg mx-auto max-w-7xl rounded-lg p-6">
          <h2 className="mb-4 text-2xl">Movies</h2>
          <List type="movies">
            {movies.filter((movie) => !movie.isSeries).map(MovieCard)}
          </List>

          <h2 className="mt-6 mb-4 text-2xl">Series</h2>
          <List type="series">
            {movies.filter((movie) => movie.isSeries).map(MovieCard)}
          </List>
        </div>
      </div>
    </div>
  );
}
