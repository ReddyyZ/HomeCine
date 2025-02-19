import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { getMovies } from "../../../services/apiClient";
import { Movie } from "../../types/movies";
import Image from "../../../components/Image";
import DropdownMenu from "../../../components/DropdownMenu";
import Button from "../../../components/Button";
import { IoAdd } from "react-icons/io5";
import colors from "../../../constants/colors";
import { IoEllipsisVertical } from "react-icons/io5";
import TextWithReadMore from "../../../components/TextWithReadMore";
import Modal from "../../../components/Modal";

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element>();
  const [modalClassName, setModalClassName] = useState("");
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
  };

  const handleDeleteMovie = (movie: Movie) => {
    setModalVisible(false);
  };

  const DeleteMovieModal = ({ movie }: { movie: Movie }) => {
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
            onClick={handleDeleteMovie}
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

  const getModalContent = async ({
    mode,
    movie,
  }: {
    mode: "edit" | "delete" | "createSeries" | "uploadMovie";
    movie?: Movie;
  }) => {
    if (mode === "delete") {
      setModalVisible(true);
      setModalClassName("max-w-90 max-h-40!");
      return <DeleteMovieModal movie={movie} />;
    }
  };

  useEffect(() => {
    loadMovies();
  });

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

      <div>
        <div className="bg-secondaryBg mt-4 rounded-sm p-4">
          {movies.map((movie) => (
            <div className="my-4 flex w-full justify-between gap-1">
              <div
                key={movie.id}
                className="flex flex-col justify-between gap-4 rounded-sm md:flex-row"
              >
                <Image
                  src={movie.posterUrl}
                  className="aspect-video h-44 w-full max-w-80"
                />
                <div>
                  <p className="text-xl font-bold">{movie.title}</p>
                  <p>{movie.year}</p>
                  <TextWithReadMore
                    value={movie.overview ? movie.overview : ""}
                    limit={250}
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
                  if (item.id === 2) {
                    setModalContent(getModalContent({ mode: "delete", movie }));
                  }
                }}
                value={<IoEllipsisVertical size={24} />}
                btnStyle={{
                  maxWidth: "fit-content",
                  padding: 6,
                  justifyContent: "center",
                  borderRadius: 4,
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
