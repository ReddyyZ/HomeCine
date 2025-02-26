import LoadingView from "../../../../components/LoadingView";
import { memo, useEffect, useState } from "react";
import {
  createMovie,
  deleteEpisodes,
  getAllEpisodesFromMovie,
  getSeasonNumber,
  updateMovie,
  uploadVideos,
} from "../../../../services/apiClient";
import { Episode, Movie, VideoMetadata } from "../../../types/movies";
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
  isSeries: boolean;
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
  }>({
    title: "",
    year: "",
    overview: "",
    posterUrl: "",
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videosMetadata, setVideosMetadata] = useState<
    Record<string, VideoMetadata>
  >({});
  const hasChanged =
    title !== originalMetadata?.title ||
    year !== originalMetadata?.year ||
    overview !== originalMetadata?.overview ||
    posterImage !== originalMetadata?.posterUrl ||
    files.length > 0 ||
    episodes.toString() !== allEpisodes.toString();

  const loadEpisodes = async () => {
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
    const title = movie ? movie.title : "";
    const year = movie ? String(movie.year) : "";
    const overview = movie ? String(movie.overview) : "";
    const posterUrl = movie ? String(movie.posterUrl) : "";

    setTitle(title);
    setYear(year);
    setOverview(overview);
    setPosterImage(posterUrl);

    setOriginalMetadata({
      title,
      year,
      overview,
      posterUrl,
    });

    setFiles([]);
    loadEpisodes();
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

  const filterFiles = (filesToFilter: FileList, callback: FilterCallback) => {
    const allowedTypes = ["video/mp4", "video/quicktime"];
    for (let i = 0; i < files.length; i++) {
      if (!allowedTypes.includes(files[i].type)) {
        return callback(filesToFilter, false, "File type not allowed");
      }
    }

    return callback(filesToFilter, true);
  };

  const updateMovieMetadata = async () => {
    const res = await updateMovie(user, String(movie.id), {
      title,
      year: Number(year),
      overview,
      posterUrl: posterImage,
    });
    if (res.data?.error) {
      return alert(res.data.error);
    }
    setOriginalMetadata({
      title: title,
      year: String(year),
      overview,
      posterUrl: posterImage,
    });
  };

  const deleteRemovedEpisodes = async () => {
    const deletedEpisodes = getDeletedEpisodes();
    if (deletedEpisodes.length === 0) return;

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

  const uploadEpisodes = async () => {
    if (files.length === 0) return;

    const onUploadProgress = (progress: number) => {
      setUploadProgress(progress);
    };

    const videoMetadataWithMovieId = Object.keys(videosMetadata).reduce(
      (acc: Record<string, VideoMetadata>, key) => {
        acc[key] = {
          ...videosMetadata[key],
          movieId: movie.id,
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
    loadEpisodes();
  };

  // const createNewMovie = async () => {
  //   createMovie(user, {
  //     title,
  //     year: Number(year),
  //     overview,
  //     posterUrl: posterImage,
  //   })
  // }

  const saveChanges = async () => {
    setLoading(true);
    await updateMovieMetadata();
    await deleteRemovedEpisodes();
    await uploadEpisodes();
    onReload();
    setLoading(false);
    // onDismiss();
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
      {loading && <LoadingView />}
      <HeaderBtns
        onDismiss={onDismiss}
        hasChanged={hasChanged}
        onDiscardChanges={loadInputs}
        saveChanges={saveChanges}
      />
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="flex max-w-72 flex-col">
          {/* TODO: show actual image and image input */}
          <ImageSelector
            posterImage={posterImage}
            setPosterImage={setPosterImage}
          />
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
          {movie && movie.isSeries && (
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
                <List type={"search"}>
                  {filterEpisodesFromSeason(currentSeason).map((item) => (
                    <EpisodeItem episode={item} onDelete={onDeleteEpisode} />
                  ))}
                </List>
              </div>
              <UploadRoot>
                <p className="text-lg font-semibold">Upload new episodes</p>
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
