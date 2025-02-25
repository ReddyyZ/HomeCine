import express from "express";
import { authenticate } from "../controllers/UserController";
import * as VideoController from "../controllers/VideoController";

const router = express.Router();

router.get("/movies/:movieId/watch", authenticate, VideoController.watchMovie);
router.get(
  "/movies/:movieId/season/:season/episode/:episodeNumber/watch",
  authenticate,
  VideoController.watchEpisode,
);
router.get(
  "/movies/:movieId/episode/:episodeId/watch",
  authenticate,
  VideoController.watchEpisodeById,
);

router.get("/progress", authenticate, VideoController.getProgress);

router.post("/progress", authenticate, VideoController.updateProgress);

export default router;
