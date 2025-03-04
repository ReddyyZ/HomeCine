import { memo } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import DropdownMenu, {
  DropdownMenuItemProps,
} from "../../../components/DropdownMenu";
import TextWithReadMore from "../../../components/TextWithReadMore";
import { formatVideoDuration } from "../../../utils";
import { Movie } from "../../../types/movies";
import Image from "../../../components/Image";

function MovieItem({
  movie,
  onSelect,
}: {
  movie: Movie;
  onSelect: (item: DropdownMenuItemProps) => void;
}) {
  return (
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
  );
}

export default memo(MovieItem);
