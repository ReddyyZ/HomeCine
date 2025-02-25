import { IoTrash } from "react-icons/io5";
import colors from "../../../constants/colors";
import { formatVideoDuration } from "../../../utils";
import Image from "../../../components/Image";
import { memo } from "react";
import { Episode } from "../../types/movies";

interface EpisodeItemProps {
  episode: Episode;
  onDelete: (episodeId: number) => void;
}

function EpisodeItem({ episode, onDelete }: EpisodeItemProps) {
  return (
    <div key={episode.id} className="w-60">
      <div className="relative">
        <Image
          src={episode.posterUrl}
          alt={episode.title}
          className="aspect-video w-full rounded-lg object-cover"
        />
        <button
          onClick={() => onDelete(episode.id)}
          className="bg-black-opacity absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100"
        >
          <IoTrash size={36} color={colors.text} />
        </button>
      </div>
      <p className="mt-2">
        <span className="text-gray-200!">
          E
          {String(episode.episodeNumber).length === 1
            ? `0${episode.episodeNumber}`
            : episode.episodeNumber}{" "}
          -{" "}
        </span>
        {episode.title}
      </p>
      {episode.videoDuration && (
        <p>{formatVideoDuration(episode.videoDuration)}</p>
      )}
    </div>
  );
}

export default memo(EpisodeItem);
