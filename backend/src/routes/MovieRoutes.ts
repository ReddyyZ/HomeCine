import express from "express";
import * as MovieController from "../controllers/MovieController";

const router = express.Router();

router.get("/movies", MovieController.getMovies);
router.get("/movies/:movieId", MovieController.getMovie);
router.get("/movies/:movieId/seasons", MovieController.getSeasonsFromMovie);
router.get(
  "/movies/:movieId/season/:season",
  MovieController.getEpisodesFromSeason,
);
router.get(
  "/movies/:movieId/episode/:episodeId",
  MovieController.getEpisodeById
);

router.post("/movies", MovieController.createMovie);
router.post("/movies/:movieId/update", MovieController.updateMovie);

router.delete("/movies/:movieId", MovieController.deleteMovie);
router.delete(
  "/movies/:movieId/episode/:episodeId",
  MovieController.deleteEpisode,
);

export default router;
