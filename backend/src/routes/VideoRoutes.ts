import express from "express";
import * as VideoController from "../controllers/VideoController";

const router = express.Router();

router.get("/movies/:movieId/watch", VideoController.watchMovie);
router.get(
  "/movies/:movieId/season/:season/episode/:episodeNumber/watch",
  VideoController.watchEpisode,
);
router.get(
  "/movies/:movieId/episode/:episodeId/watch",
  VideoController.watchEpisodeById,
);

router.get("/progress", VideoController.getProgress);

router.post("/progress", VideoController.updateProgress);

export default router;
