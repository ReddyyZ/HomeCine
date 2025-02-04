import express from "express";
import * as MovieController from "@src/controllers/MovieController";
import * as VideoController from "@src/controllers/VideoController";

const router = express.Router();

router.get("/movies", MovieController.getMovies);
router.get("/movies/:movieId", MovieController.getMovie);
router.get("/movies/:movieId/seasons", MovieController.getSeasonsFromMovie);
router.get(
  "/movies/:movieId/season/:season",
  MovieController.getEpisodesFromSeason,
);
router.get("/movies/:movieId/watch", VideoController.watchMovie);
router.get(
  "/movies/:movieId/season/:season/episode/:episodeNumber/watch",
  VideoController.watchEpisode,
);

router.post("/movies/:movieId/update", MovieController.updateMovie);

router.delete("/movies/:movieId", MovieController.deleteMovie);
router.delete(
  "/movies/:movieId/episode/:episodeId",
  MovieController.deleteEpisode,
);

export default router;
