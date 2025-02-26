import { useState, useEffect, JSX } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { getMovies } from "../../../services/apiClient";
import { Movie } from "../../types/movies";
import DropdownMenu from "../../../components/DropdownMenu";
import { IoAdd, IoArrowBack } from "react-icons/io5";
import colors from "../../../constants/colors";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import { removeAccents } from "../../../utils";
import EditMovieModal from "./MovieModal";
import DeleteMovieModal from "./delete-modal";
import MovieItem from "./movie-item";

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element>(<div />);
  const [modalClassName, setModalClassName] = useState("");
  const [search, setSearch] = useState("");
  const [querySearched, setQuerySearched] = useState("");
  const auth = useAuth();

  const loadMovies = async () => {
    if (!auth.admin) return;

    const res = await getMovies(auth.admin);
    if (res.status === 401) {
      return auth.logoutAdmin();
    }
    if (res.data?.error) {
      return alert(res.data.error);
    }

    setMovies(res.data);
    setFilteredMovies(res.data);
  };

  const showMovies = (searchInput: string) => {
    const filtered = movies.filter((movie) =>
      removeAccents(movie.title)
        .toLowerCase()
        .includes(removeAccents(searchInput).toLowerCase()),
    );

    setFilteredMovies(filtered);
    setQuerySearched(searchInput);
  };

  const clearSearch = () => {
    setSearch("");
    showMovies("");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const searchElement = document.getElementById("search") as HTMLInputElement;
    searchElement.value = "";
  };

  const handleDeleteMovie = (movie: Movie) => {
    setModalVisible(false);
  };

  const getModalContent = ({
    mode,
    movie,
  }: {
    mode: "edit" | "delete" | "createSeries" | "uploadMovie";
    movie?: Movie;
  }) => {
    const dismiss = () => setModalVisible(false);

    if (mode === "delete" && movie) {
      setModalVisible(true);
      return (
        <DeleteMovieModal
          movie={movie}
          setModalClassName={setModalClassName}
          handleDeleteMovie={handleDeleteMovie}
          onDismiss={dismiss}
        />
      );
    } else if (mode === "edit" && movie && auth.admin) {
      setModalVisible(true);
      return (
        <EditMovieModal
          movie={movie}
          setModalClassName={setModalClassName}
          user={auth.admin}
          onDismiss={dismiss}
          onReload={loadMovies}
        />
      );
    }

    return <div />;
  };

  const onDismissModal = () => {
    setModalVisible(false);
    setModalClassName("");
    setModalContent(<div />);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>

        <DropdownMenu
          items={[
            {
              id: 1,
              value: "Create series",
            },
            {
              id: 2,
              value: "Upload movie",
            },
          ]}
          onSelect={() => {
            setModalVisible(true);
          }}
          value={
            <div className="flex gap-2">
              New
              <IoAdd size={24} />
            </div>
          }
          btnStyle={{
            maxWidth: 100,
            justifyContent: "center",
            borderRadius: 4,
            backgroundColor: colors.primary,
          }}
          itemsContainerClassName="w-36 -translate-x-12"
        />
      </div>

      <form className="mt-4">
        <Input
          type="search"
          onChangeText={(value) => setSearch(value)}
          onSearch={showMovies}
          value={search}
          placeholder="Search movies"
        />
      </form>

      <div>
        <div className="bg-secondaryBg scrollbar scrollbar-thumb-gray-300 scrollbar-track-[#1E1E1E] mt-4 flex max-h-130 flex-col gap-4 overflow-y-auto rounded-sm p-4">
          {
            // Exibe a mensagem de erro caso não encontre nenhum filme
            querySearched && (
              <div className="mb-1 flex items-center gap-3">
                <button
                  onClick={clearSearch}
                  className="cursor-pointer p-1 transition-opacity duration-150 hover:opacity-70"
                >
                  <IoArrowBack size={24} color={colors.text} />
                </button>
                <p className="text-lg">
                  Showing results for: <strong>"{querySearched}"</strong>
                </p>
              </div>
            )
          }
          {filteredMovies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onSelect={(item) => {
                console.log("a");
                if (item.id === 1) {
                  console.log("edit", movie);
                  setModalContent(getModalContent({ mode: "edit", movie }));
                } else if (item.id === 2) {
                  setModalContent(getModalContent({ mode: "delete", movie }));
                }
              }}
            />
          ))}
        </div>
      </div>
      <Modal
        visible={modalVisible}
        onDismiss={onDismissModal}
        modalClassName={modalClassName}
      >
        {modalContent || <div />}
      </Modal>
    </div>
  );
}
