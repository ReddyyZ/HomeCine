import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (
    req,
    file: Express.Multer.File,
    cb: DestinationCallback,
  ) {
    const videos = JSON.parse(req.body.videos ? req.body.videos : "{}");
    const { title, season, episodeNumber } = videos[file.originalname];

    const isSeries = season && episodeNumber;
    const dir = path.join(
      __dirname,
      isSeries ? `../../media/series/${title}/` : "../../media/movies/",
    );

    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }

      cb(null, dir);
    } catch (error) {
      cb(new Error(String(error)), dir);
    }
  },
  filename: function (req, file: Express.Multer.File, cb: FileNameCallback) {
    const videos = JSON.parse(req.body.videos ? req.body.videos : "{}");
    const { title, episodeTitle, season, episodeNumber } =
      videos[file.originalname];
    const fileExt = path.extname(file.originalname);

    if (season && episodeNumber) {
      cb(
        null,
        `S${String(season).length < 2 ? `0${season}` : season}E${String(episodeNumber).length < 2 ? `0${episodeNumber}` : episodeNumber} - ${episodeTitle}${fileExt}`,
      );
    } else {
      cb(null, `${title}${fileExt}`);
    }
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const videos = JSON.parse(req.body.videos ? req.body.videos : "{}");

  if (!videos || Object.keys(videos).length === 0) {
    console.log("missing videos metadata");
    cb(null, false);
    return;
  }

  const metadata = videos[file.originalname];
  if (!metadata) {
    console.log("missing videos metadata 2");
    cb(null, false);
    return;
  }

  const { title, episodeTitle, season, episodeNumber } = metadata;
  const isSeries = season || episodeNumber || episodeTitle;
  const allowedFileExts = /mp4|avi|mpeg|mkv/;
  const allowedMimeTypes = /video\/mp4|video\/avi|video\/mpeg|video\/mkv/;

  const testFileExt = allowedFileExts.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const testMimeType = allowedMimeTypes.test(file.mimetype);

  if (!title) {
    cb(null, false);
    return;
  }

  if (isSeries && (!season || !episodeNumber || !episodeTitle)) {
    cb(null, false);
    return;
  }

  if (testFileExt && testMimeType) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter });

export default upload;
