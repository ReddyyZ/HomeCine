import ffmpeg from "fluent-ffmpeg";
import ffprobe from "ffprobe-static";
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
