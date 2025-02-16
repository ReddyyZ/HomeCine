import ffmpeg from "fluent-ffmpeg";
import ffprobe from "ffprobe-static";
import path from "path";
ffmpeg.setFfprobePath(ffprobe.path);

export function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error(err);
        return resolve(0);
      }
      resolve(metadata.format.duration || 0);
    });
  });
}

type getThumbnailProps = {
  filePath: string;
  movieTitle: string;
  episodeTitle?: string;
};

const thumbnailsFolder = path.join(__dirname, "../../media/thumbnails");

export function getThumbnail({filePath, movieTitle, episodeTitle}: getThumbnailProps): Promise<string> {
  const output = `http://localhost:8080/media/${episodeTitle ? `${movieTitle}-${episodeTitle}` : movieTitle}.png`;

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on("end", () => resolve(output))
      .on("error", (err) => {
        console.error(err);
        resolve("");
      })
      .takeScreenshots({
        count: 1,
        timemarks: ["50%"],
        filename: `${episodeTitle ? `${movieTitle}-${episodeTitle}` : movieTitle}.png`,
        folder: thumbnailsFolder,
      });
  });
}