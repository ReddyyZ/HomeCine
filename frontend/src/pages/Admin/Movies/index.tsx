import { useState, useEffect, JSX, useRef } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { getMovies } from "../../../services/apiClient";
import { Movie } from "../../types/movies";
import Image from "../../../components/Image";
import DropdownMenu from "../../../components/DropdownMenu";
import Button from "../../../components/Button";
import { IoAdd, IoArrowBack, IoCloudUpload } from "react-icons/io5";
import colors from "../../../constants/colors";
import { IoEllipsisVertical } from "react-icons/io5";
import TextWithReadMore from "../../../components/TextWithReadMore";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import { formatVideoDuration, removeAccents } from "../../../utils";
import ImageUploading from "react-images-uploading";

const EditMovieModal = ({
  movie,
  setModalClassName,
}: {
  movie: Movie;
  setModalClassName: (value: string) => void;
}) => {
  const [posterImage, setPosterImage] = useState("");

  setModalClassName("p-2");

  useEffect(() => {
    if (movie.posterUrl) {
      setPosterImage(movie.posterUrl);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="flex max-w-72 flex-col">
          {/* TODO: show actual image and image input */}
          <ImageUploading
            value={[]}
            onChange={(imgList) => {
              setPosterImage(String(imgList[0].dataURL));
            }}
          >
            {({ onImageUpload, onImageRemove, dragProps, isDragging }) => (
              <div className="upload__image-wrapper">
                <button
                  onClick={onImageUpload}
                  {...dragProps}
                  className="relative"
                >
                  <div
                    className={`absolute h-full w-full bg-[#000000b5] ${!isDragging && "hidden"}`}
                  />
                  {isDragging && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                      <IoCloudUpload size={24} />
                    </div>
                  )}
                  <Image
                    key={posterImage}
                    src={posterImage}
                    className="max-h-full"
                  />
                </button>
                <div className="mt-2 flex justify-around">
                  <button
                    onClick={onImageUpload}
                    className="bg-cardBg w-full cursor-pointer py-2 transition-opacity hover:opacity-70"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setPosterImage("");
                      onImageRemove(0);
                    }}
                    className="bg-cardBg w-full cursor-pointer py-2 transition-opacity hover:opacity-70"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </ImageUploading>
        </div>
        <div className="w-full">
          <div>
            {/* TODO: title and year input */}
            <Input />
            <Input />
          </div>
          {/* TODO: overview input */}
          <Input />
        </div>
        <div>{/* TODO: episode list */}</div>
      </div>
    </>
  );
};

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element>();
  const [modalClassName, setModalClassName] = useState("");
  const [search, setSearch] = useState("");
  const [querySearched, setQuerySearched] = useState("");
  const auth = useAuth();

  const loadMovies = async () => {
    if (!auth.user) return;

    const res = await getMovies(auth.user);
    if (res.status === 401) {
      return auth.logout();
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
    console.log("adsa");
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

  const DeleteMovieModal = ({ movie }: { movie: Movie }) => {
    setModalClassName("max-w-72 md: max-w-80 max-h-40!");

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
            className="rounded-r-none! border border-[#3A3A3A] bg-[#252525]!"
            onClick={() => handleDeleteMovie(movie)}
          >
            Yes
          </Button>
          <Button
            className="rounded-l-none! border border-l-0 border-[#3A3A3A] bg-transparent!"
            onClick={() => setModalVisible(false)}
          >
            No
          </Button>
        </div>
      </div>
    );
  };

  const getModalContent = ({
    mode,
    movie,
  }: {
    mode: "edit" | "delete" | "createSeries" | "uploadMovie";
    movie?: Movie;
  }) => {
    if (mode === "delete" && movie) {
      setModalVisible(true);
      return <DeleteMovieModal movie={movie} />;
    } else if (mode === "edit" && movie) {
      setModalVisible(true);
      return (
        <EditMovieModal movie={movie} setModalClassName={setModalClassName} />
      );
    }

    return <div />;
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
          onSelect={(item) => {
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
        <div className="bg-secondaryBg scrollbar scrollbar-thumb-[#3A3A3A] scrollbar-track-[#1E1E1E] mt-4 flex max-h-130 flex-col gap-4 overflow-y-auto rounded-sm p-4">
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
            <div className="bg-cardBg flex w-full justify-between gap-1 rounded-sm">
              <div
                key={movie.id}
                className="flex flex-col justify-between gap-4 md:flex-row"
              >
                <Image
                  src={movie.posterUrl}
                  className="aspect-auto max-h-fit w-full max-w-50 rounded-tl-sm md:rounded-l-sm"
                />
                <div className="p-2">
                  <p className="mb-2 text-xl font-bold">
                    {movie.title} {movie.year && `(${movie.year})`}
                  </p>
                  {movie.genres && (
                    <div className="flex gap-2">
                      <p className="font-semibold text-[#B0B0B0]">Genre: </p>
                      <p>{JSON.parse(movie.genres).join(", ")}</p>
                    </div>
                  )}
                  {movie.videoDuration ? (
                    <div className="flex gap-2">
                      <p className="font-semibold text-[#B0B0B0]">Duration:</p>
                      <p>{formatVideoDuration(movie.videoDuration)}</p>
                    </div>
                  ) : (
                    movie.isSeries &&
                    movie.numberOfSeasons && (
                      <div className="mb-2 flex gap-2">
                        <p className="font-semibold text-[#B0B0B0]">Seasons</p>
                        <p>{movie.numberOfSeasons}</p>
                      </div>
                    )
                  )}
                  <TextWithReadMore
                    value={movie.overview ? movie.overview : ""}
                    limit={250}
                    className="mt-2"
                  />
                </div>
              </div>
              <DropdownMenu
                items={[
                  {
                    id: 1,
                    value: "Edit",
                  },
                  {
                    id: 2,
                    value: "Delete",
                  },
                ]}
                onSelect={(item) => {
                  console.log(item);
                  if (item.id === 1) {
                    setModalContent(getModalContent({ mode: "edit", movie }));
                  } else if (item.id === 2) {
                    setModalContent(getModalContent({ mode: "delete", movie }));
                  }
                }}
                value={<IoEllipsisVertical size={24} />}
                btnStyle={{
                  maxWidth: "fit-content",
                  padding: 6,
                  justifyContent: "center",
                  borderRadius: 4,
                  backgroundColor: "transparent",
                }}
                itemsContainerClassName="w-24 -translate-x-1/2"
              />
            </div>
          ))}
        </div>
      </div>
      <Modal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
        }}
        modalClassName={modalClassName}
      >
        {modalContent}
      </Modal>
    </div>
  );
}
