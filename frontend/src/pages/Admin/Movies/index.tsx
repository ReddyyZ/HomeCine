import { useState, useEffect, JSX, memo } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import {
  getEpisodesFromSeason,
  getMovies,
  getSeasonNumber,
} from "../../../services/apiClient";
import { Episode, Movie, VideoMetadata } from "../../types/movies";
import Image from "../../../components/Image";
import DropdownMenu from "../../../components/DropdownMenu";
import Button from "../../../components/Button";
import { IoAdd, IoArrowBack, IoClose, IoCloudUpload } from "react-icons/io5";
import colors from "../../../constants/colors";
import { IoEllipsisVertical } from "react-icons/io5";
import TextWithReadMore from "../../../components/TextWithReadMore";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import { formatVideoDuration, removeAccents } from "../../../utils";
import ImageUploading from "react-images-uploading";
import List from "../../../components/List";
import {
  UploadField,
  UploadList,
  UploadRoot,
} from "../../../components/Upload";

const EpisodeItem = (episode: Episode) => {
  return (
    <div key={episode.id} className="w-60">
      <div className="relative">
        <Image
          src={episode.posterUrl}
          alt={episode.title}
          className="aspect-video w-full rounded-lg object-cover"
        />
        {/* <Link
          to={`/movie/${episode.movieId}/episode/${episode.id}/watch`}
          className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center bg-[#00000067] opacity-0 transition-opacity duration-200 hover:opacity-100"
        >
          <IoPlayCircle size={36} color={colors.text} />
        </Link> */}
      </div>
      <p className="mt-2">{episode.title}</p>
      {episode.videoDuration && (
        <p>{formatVideoDuration(episode.videoDuration)}</p>
      )}
    </div>
  );
};

const MovieItem = memo(
  ({ movie, onSelect }: { movie: Movie; onSelect: (item) => void }) => (
    <div className="bg-cardBg flex w-full justify-between gap-1 rounded-md">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <Image
          src={movie.posterUrl}
          className="aspect-auto max-h-fit w-full max-w-50 rounded-tl-md md:rounded-l-md"
        />
        <div className="p-2">
          <p className="mb-2 text-xl font-bold">
            {movie.title} {movie.year && `(${movie.year})`}
          </p>
          {movie.genres && (
            <div className="flex gap-2">
              <p className="font-semibold text-gray-200">Genre: </p>
              <p>{JSON.parse(movie.genres).join(", ")}</p>
            </div>
          )}
          {movie.videoDuration ? (
            <div className="flex gap-2">
              <p className="font-semibold text-gray-200">Duration:</p>
              <p>{formatVideoDuration(movie.videoDuration)}</p>
            </div>
          ) : (
            movie.isSeries &&
            movie.numberOfSeasons && (
              <div className="mb-2 flex gap-2">
                <p className="font-semibold text-gray-200">Seasons</p>
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
        onSelect={onSelect}
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
  ),
);

const DeleteMovieModal = memo(
  ({
    movie,
    setModalClassName,
    handleDeleteMovie,
    onDismiss,
  }: {
    movie: Movie;
    setModalClassName: (value: string) => void;
    handleDeleteMovie: (movie: Movie) => void;
    onDismiss: () => void;
  }) => {
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
  },
);

const EditMovieModal = memo(
  ({
    movie,
    setModalClassName,
    user,
    onDismiss,
  }: {
    movie: Movie;
    setModalClassName: (value: string) => void;
    user: string;
    onDismiss: () => void;
  }) => {
    const [posterImage, setPosterImage] = useState("");
    const [seasons, setSeasons] = useState(1);
    const [currentSeason, setCurrentSeason] = useState(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [overview, setOverview] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [videosMetadata, setVideosMetadata] = useState<
      Record<string, VideoMetadata>
    >({});
    const hasChanged =
      title !== movie.title ||
      year !== String(movie.year) ||
      overview !== String(movie.overview) ||
      posterImage !== String(movie.posterUrl) ||
      files.length > 0;

    const loadEpisodes = async () => {
      const seasons = await getSeasonNumber(user, String(movie.id));
      if (seasons.data?.error) {
        return alert(seasons.data.error);
      }
      setSeasons(seasons.data.seasons);

      const episodesResult = await getEpisodesFromSeason(
        user,
        String(movie.id),
        currentSeason,
      );
      if (episodesResult.data?.error) {
        return alert(episodesResult.data.error);
      }

      setEpisodes(episodesResult.data);
    };

    const loadInputs = () => {
      setTitle(movie.title);
      setYear(String(movie.year));
      setOverview(String(movie.overview));
      setPosterImage(String(movie.posterUrl));
      setFiles([]);
    };

    const handleFileRemove = (index: number) => {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const onUpload = (
      file: File[],
      filesMetadata: Record<string, VideoMetadata>,
    ) => {
      setVideosMetadata((prevMetadata) => ({
        ...prevMetadata,
        ...filesMetadata,
      }));
      setFiles((prevFiles) => [...prevFiles, ...file]);
    };

    const filterFiles = (files: FileList) => {
      const allowedTypes = ["video/mp4", "video/quicktime"];
      for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
          return false;
        }
      }
      return true;
    };

    useEffect(() => {
      setModalClassName("p-2");
      loadInputs();
    }, []);

    useEffect(() => {
      if (movie.isSeries) {
        loadEpisodes();
      }
    }, [currentSeason]);

    return (
      <>
        <div className="flex justify-between">
          <button
            className="cursor-pointer transition-opacity hover:opacity-70"
            onClick={onDismiss}
          >
            <IoClose size={28} />
          </button>
          <div className="flex w-72 gap-2">
            <Button
              style={{
                backgroundColor: "#252525",
                color: !hasChanged ? "#3A3A3A" : "",
              }}
              className={
                !hasChanged ? "cursor-default! hover:opacity-100!" : ""
              }
              disabled={!hasChanged}
              onClick={loadInputs}
            >
              Discard changes
            </Button>
            <Button
              style={{
                backgroundColor: !hasChanged ? "#252525" : colors.primary,
                color: !hasChanged ? "#3A3A3A" : "",
              }}
              className={
                !hasChanged ? "cursor-default! hover:opacity-100!" : ""
              }
              disabled={!hasChanged}
            >
              Save
            </Button>
          </div>
        </div>
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
                      className={`bg-black-opacity absolute h-full w-full ${!isDragging && "hidden"}`}
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
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-4">
                {/* TODO: title and year input */}
                <div className="flex w-full flex-col gap-1">
                  <label htmlFor="title" className="text-lg font-semibold">
                    Movie Title
                  </label>
                  <Input
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                  />
                </div>
                <div className="flex w-32 flex-col gap-1">
                  <label htmlFor="year" className="text-lg font-semibold">
                    Year
                  </label>
                  <Input
                    name="year"
                    placeholder="Year"
                    value={year}
                    onChangeText={setYear}
                  />
                </div>
              </div>
              {/* TODO: overview input */}
              <div className="flex w-full flex-col gap-1">
                <label htmlFor="overview" className="text-lg font-semibold">
                  Overview
                </label>
                <Input
                  name="overview"
                  className=""
                  multipleLine
                  value={overview}
                  onChangeText={setOverview}
                />
              </div>
            </div>
            {movie.isSeries && (
              <div>
                <p className="mb-2 text-lg font-semibold">Episode list</p>
                {/* TODO: episode list */}
                <div className="w-full max-w-60">
                  <DropdownMenu
                    items={[...Array(seasons).keys()].map((i) => ({
                      id: i + 1,
                      value: `Season ${i + 1}`,
                    }))}
                    onSelect={(item) => {
                      setCurrentSeason(item.id);
                      // setSearchParams({ season: item.id.toString() });
                    }}
                    select
                    currentItem={currentSeason}
                    containerStyle={{
                      marginBottom: 24,
                    }}
                    itemsContainerClassName="w-full"
                  />
                </div>
                <div className="max-w-160">
                  <List type={"search"}>{episodes.map(EpisodeItem)}</List>
                </div>
                <UploadRoot>
                  <p className="text-lg font-semibold">Upload new episodes</p>
                  <UploadList
                    filesMetadata={videosMetadata}
                    files={files}
                    setFileMetadata={setVideosMetadata}
                    onRemove={handleFileRemove}
                  />
                  <UploadField
                    multiple={false}
                    onUpload={onUpload}
                    filter={filterFiles}
                  />
                </UploadRoot>
              </div>
            )}
          </div>
        </div>
      </>
    );
  },
);

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
    } else if (mode === "edit" && movie && auth.user) {
      setModalVisible(true);
      return (
        <EditMovieModal
          movie={movie}
          setModalClassName={setModalClassName}
          user={auth.user}
          onDismiss={dismiss}
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
                if (item.id === 1) {
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
