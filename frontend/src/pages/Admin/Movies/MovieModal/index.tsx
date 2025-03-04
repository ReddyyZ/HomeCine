import LoadingView from "../../../../components/LoadingView";
import { memo, useEffect, useState } from "react";
import {
  createMovie,
  deleteEpisodes,
  getAllEpisodesFromMovie,
  getSeasonNumber,
  searchMovieOnTMDB,
  updateMovie,
  uploadVideos,
} from "../../../../services/apiClient";
import { Episode, Movie, VideoMetadata } from "../../../../types/movies";
import {
  FilterCallback,
  UploadField,
  UploadList,
  UploadRoot,
} from "../../../../components/Upload";
import DropdownMenu from "../../../../components/DropdownMenu";
import Input from "../../../../components/Input";
import List from "../../../../components/List";
import EpisodeItem from "../episode-item";
import HeaderBtns from "./header-btns";
import ImageSelector from "./image-selector";
import genreList from "../../../../constants/genres";

interface MovieModalMainProps {
  setModalClassName: (value: string) => void;
  user: string;
  onDismiss: () => void;
  onReload: () => void;
}

interface MovieModalEditProps {
  movie: Movie;
  edit: true;
  isSeries?: never;
}

interface MovieModalCreateProps {
  movie?: undefined;
  edit?: false;
  isSeries?: boolean;
}

type MovieModalProps = MovieModalMainProps &
  (MovieModalEditProps | MovieModalCreateProps);

function MovieModal({
  movie,
  edit,
  isSeries,
  setModalClassName,
  user,
  onDismiss,
  onReload,
}: MovieModalProps) {
  const [originalMetadata, setOriginalMetadata] = useState<{
    title?: string;
    year?: string;
    overview?: string;
    posterUrl?: string;
    genres?: string[];
  }>({
    title: "",
    year: "",
    overview: "",
    posterUrl: "",
    genres: [],
  });
  const [posterImage, setPosterImage] = useState("");
  const [seasons, setSeasons] = useState(1);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [overview, setOverview] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videosMetadata, setVideosMetadata] = useState<
    Record<string, VideoMetadata>
  >({});
  const [titleInputError, setTitleInputError] = useState(false);

  const getGenresNames = () => {
    return selectedGenres
      .map((genreId) => genreList.find((genre) => genre.id === genreId)?.name)
      .filter((genre) => genre !== undefined);
  };

  const getGenresIdsByGenresNames = (genres: string[]) => {
    return genres
      .map(
        (genre) => genreList.find((genreItem) => genreItem.name === genre)?.id,
      )
      .filter((genre) => genre !== undefined);
  };

  const hasChanged =
    title !== originalMetadata?.title ||
    year !== originalMetadata?.year ||
    overview !== originalMetadata?.overview ||
    posterImage !== originalMetadata?.posterUrl ||
    getGenresNames().toString() !== originalMetadata?.genres?.toString() ||
    files.length > 0 ||
    episodes.toString() !== allEpisodes.toString();

  const loadEpisodes = async () => {
    if (!movie) return;

    const seasons = await getSeasonNumber(user, String(movie.id));
    if (seasons.data?.error) {
      return alert(seasons.data.error);
    }
    setSeasons(seasons.data.seasons);

    const allEpisodesResult = await getAllEpisodesFromMovie(
      user,
      String(movie.id),
    );
    if (allEpisodesResult.data?.error) {
      return alert(allEpisodesResult.data.error);
    }

    setAllEpisodes(allEpisodesResult.data);
    setEpisodes(allEpisodesResult.data);
  };

  const onDeleteEpisode = (episodeId: number) => {
    setEpisodes((prevEpisodes) =>
      prevEpisodes.filter((episode) => episode.id !== episodeId),
    );
  };

  const getDeletedEpisodes = () => {
    return allEpisodes.filter(
      (episode) => !episodes.some((e) => e.id === episode.id),
    );
  };

  const filterEpisodesFromSeason = (season: number) => {
    return episodes.filter((episode) => episode.season === season);
  };

  const loadInputs = () => {
    if (!edit) return;

    const title = movie?.title ?? "";
    const year = movie.year ? String(movie.year) : "";
    const overview = movie?.overview ?? "";
    const posterUrl = movie?.posterUrl ?? "";
    const genres = movie ? JSON.parse(movie.genres) : [];

    setTitle(title);
    setYear(year);
    setOverview(overview);
    setPosterImage(posterUrl);
    setSelectedGenres(getGenresIdsByGenresNames(genres));

    setOriginalMetadata({
      title,
      year,
      overview,
      posterUrl,
      genres,
    });

    setFiles([]);
    loadEpisodes();
  };

  const handleFileRemove = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setVideosMetadata((prevMetadata) => {
      const newMetadata = { ...prevMetadata };
      delete newMetadata[Object.keys(newMetadata)[index]];
      return newMetadata;
    });
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

  const filterFiles = (filesToFilter: FileList, callback: FilterCallback) => {
    const isCreatingMovie = !edit && !isSeries;
    if (isCreatingMovie && (files.length >= 1 || filesToFilter.length > 1)) {
      return callback(filesToFilter, false, "Only one video allowed");
    }

    const allowedTypes = ["video/mp4", "video/quicktime"];
    for (let i = 0; i < files.length; i++) {
      if (!allowedTypes.includes(files[i].type)) {
        return callback(filesToFilter, false, "File type not allowed");
      }
    }

    return callback(filesToFilter, true);
  };

  const updateMovieMetadata = async () => {
    if (!movie) return;

    const res = await updateMovie(user, String(movie.id), {
      title,
      year: year.length > 0 ? Number(year) : undefined,
      overview,
      posterUrl: posterImage,
      genres: JSON.stringify(getGenresNames()),
    });
    if (res.data?.error) {
      return alert(res.data.error);
    }
    setOriginalMetadata({
      title: title,
      year: String(year),
      overview,
      posterUrl: posterImage,
      genres: getGenresNames(),
    });
  };

  const deleteRemovedEpisodes = async () => {
    const deletedEpisodes = getDeletedEpisodes();
    if (deletedEpisodes.length === 0 || !movie) return;

    const res = await deleteEpisodes(
      user,
      String(movie.id),
      deletedEpisodes.map((episode) => String(episode.id)),
    );
    if (res.data?.error) {
      return alert(res.data.error);
    }

    loadEpisodes();
  };

  const uploadEpisodes = async (movieId: number) => {
    if (files.length === 0) return;

    const onUploadProgress = (progress: number) => {
      setUploadProgress(progress);
    };

    const videoMetadataWithMovieId = Object.keys(videosMetadata).reduce(
      (acc: Record<string, VideoMetadata>, key) => {
        acc[key] = {
          ...videosMetadata[key],
          movieId,
        };
        return acc;
      },
      {},
    );

    const res = await uploadVideos(
      user,
      videoMetadataWithMovieId,
      files,
      onUploadProgress,
    );
    if (res.data?.error) {
      return alert(res.data.error);
    }

    setFiles([]);
    setVideosMetadata({});
    await loadEpisodes();
  };

  const createNewSeries = async () => {
    const result = await createMovie(user, {
      title,
      year: year.length > 0 ? Number(year) : undefined,
      overview,
      posterUrl: posterImage,
      genreIds: selectedGenres,
      isSeries: isSeries ?? false,
    });

    if (result.data?.error) {
      alert(result.data.error);
      return;
    }

    return result.data as Movie;
  };

  const createNewMovie = async () => {
    if (files.length === 0) return;

    const onUploadProgress = (progress: number) => {
      setUploadProgress(progress);
    };

    const movieMetadata = {
      [files[0].name]: {
        title,
        year: year.length > 0 ? Number(year) : undefined,
        overview,
        posterUrl: posterImage,
        genreIds: selectedGenres,
      },
    };

    const res = await uploadVideos(
      user,
      movieMetadata,
      files,
      onUploadProgress,
    );
    if (res.data?.error) {
      return alert(res.data.error);
    }
  };

  const checkIfInputIsEmpty = () => {
    const isMissingMetadata = Object.keys(videosMetadata).some((video) => {
      const videoMetadata = videosMetadata[video];

      if (
        !videoMetadata.episodeNumber ||
        !videoMetadata.season ||
        !videoMetadata.episodeTitle
      ) {
        return true;
      }
    });

    if (isMissingMetadata) {
      alert("Missing metadata in one or more episodes");
      return true;
    }
  };

  const saveChanges = async () => {
    if (loading) return;

    setLoading(true);

    if (isSeries || movie?.isSeries) {
      if (checkIfInputIsEmpty()) {
        setLoading(false);
        return;
      }
    }

    if (!title) {
      setTitleInputError(true);
      setLoading(false);
      return alert("Title is missing!");
    }

    if (edit) {
      await updateMovieMetadata();
      await deleteRemovedEpisodes();
      await uploadEpisodes(movie.id);
    } else {
      if (isSeries) {
        const createMovieResult = await createNewSeries();
        if (!createMovieResult) {
          setLoading(false);
          return;
        }

        await uploadEpisodes(createMovieResult.id);
      } else {
        await createNewMovie();
      }

      onDismiss();
    }
    onReload();
    setLoading(false);
    setTitleInputError(false);
    // onDismiss();
  };

  const getInfoFromTMDB = async () => {
    if (!title || loading) return;

    setLoading(true);

    const res = await searchMovieOnTMDB(
      user,
      title,
      isSeries || movie?.isSeries,
    );
    if (res.data?.error) {
      return alert(res.data.error);
    }

    const movieData = res.data[0];
    if (!movieData) {
      return alert("Movie not found on TMDB");
    }

    console.log(movieData);

    setTitle(movieData.title ? movieData.title : (movieData.name ?? ""));
    setYear(
      movieData.first_air_date
        ? String(new Date(movieData.first_air_date).getUTCFullYear())
        : "",
    );
    setOverview(movieData.overview ?? "");
    setPosterImage(
      movieData.poster_path
        ? `https://image.tmdb.org/t/p/original/${movieData.poster_path}`
        : "",
    );
    setSelectedGenres(movieData.genre_ids ?? []);

    setLoading(false);
  };

  useEffect(() => {
    setModalClassName("p-2 transition-all duration-200 relative");
    loadInputs();
  }, []);

  useEffect(() => {
    if (loading) {
      setModalClassName("p-0 transition-all duration-200 relative");
    } else {
      setModalClassName("p-2 transition-all duration-200 relative");
    }
  }, [loading, setModalClassName]);

  return (
    <>
      {loading && (
        <LoadingView>
          {uploadProgress ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-semibold">Uploading...</p>
              <p>{uploadProgress}%</p>
            </div>
          ) : (
            <p className="text-lg font-semibold">Loading...</p>
          )}
        </LoadingView>
      )}
      <HeaderBtns
        onDismiss={onDismiss}
        hasChanged={hasChanged}
        onDiscardChanges={loadInputs}
        saveChanges={saveChanges}
      />
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="flex max-w-72 flex-col">
          <ImageSelector
            posterImage={posterImage}
            setPosterImage={setPosterImage}
          />
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex w-full flex-col gap-1">
                <label htmlFor="title" className="text-lg font-semibold">
                  Movie Title
                </label>
                <Input
                  name="title"
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                  error={titleInputError}
                />
                <button
                  onClick={getInfoFromTMDB}
                  className="text-secondary! w-fit cursor-pointer p-1 text-sm transition-opacity duration-200 hover:opacity-70 disabled:cursor-auto disabled:opacity-70"
                  disabled={!(title.length > 0)}
                >
                  Get movie info from TMDB
                </button>
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

            <label className="text-lg font-semibold">Genres</label>
            <DropdownMenu
              items={genreList.map((genre) => ({
                id: genre.id,
                value: genre.name,
              }))}
              onSelect={(item) => {
                setSelectedGenres((prevGenres) => {
                  if (prevGenres.includes(item.id)) {
                    return prevGenres.filter((genre) => genre !== item.id);
                  }
                  return [...prevGenres, item.id];
                });
              }}
              multipleSelect
              currentItems={selectedGenres}
              value={
                selectedGenres.length > 0
                  ? `${selectedGenres.length} ${selectedGenres.length === 1 ? "genre" : "genres"} selected`
                  : "Select genres"
              }
            />
          </div>
          {(isSeries || movie?.isSeries) && (
            <div>
              {episodes.length > 0 && (
                <div>
                  <p className="mb-2 text-lg font-semibold">Episode list</p>
                  <div className="w-full max-w-60">
                    <DropdownMenu
                      items={[...Array(seasons).keys()].map((i) => ({
                        id: i + 1,
                        value: `Season ${i + 1}`,
                      }))}
                      onSelect={(item) => {
                        setCurrentSeason(item.id);
                      }}
                      select
                      currentItem={currentSeason}
                      containerStyle={{
                        marginBottom: 24,
                      }}
                      itemsContainerClassName="w-full"
                    />
                  </div>
                  <div className="mb-4 max-w-160">
                    <List type={"search"}>
                      {filterEpisodesFromSeason(currentSeason)
                        .sort((a, b) => a.episodeNumber - b.episodeNumber)
                        .map((item) => (
                          <EpisodeItem
                            episode={item}
                            onDelete={onDeleteEpisode}
                          />
                        ))}
                    </List>
                  </div>
                </div>
              )}
              <UploadRoot>
                <p className="text-lg font-semibold">Upload new episodes</p>
                <UploadList
                  filesMetadata={videosMetadata}
                  files={files}
                  setFileMetadata={setVideosMetadata}
                  onRemove={handleFileRemove}
                  isSeries
                />
                <UploadField onUpload={onUpload} filter={filterFiles} />
              </UploadRoot>
            </div>
          )}
          {!isSeries && !edit && (
            <div className="flex w-full flex-col gap-4">
              <label className="text-lg font-semibold">Upload Video</label>
              <UploadRoot>
                <UploadList
                  filesMetadata={videosMetadata}
                  files={files}
                  setFileMetadata={setVideosMetadata}
                  onRemove={handleFileRemove}
                />
                <UploadField onUpload={onUpload} filter={filterFiles} />
              </UploadRoot>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(MovieModal);
