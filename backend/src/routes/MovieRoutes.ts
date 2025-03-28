import express from "express";
import * as MovieController from "../controllers/MovieController";
import { authenticate } from "../controllers/UserController";

const router = express.Router();

router.get("/movies", authenticate, MovieController.getMovies);
router.get("/movies/:movieId", authenticate, MovieController.getMovie);
router.get(
  "/movies/:movieId/seasons",
  authenticate,
  MovieController.getSeasonsFromMovie,
);
router.get(
  "/movies/:movieId/season/:season",
  authenticate,
  MovieController.getEpisodesFromSeason,
);
router.get(
  "/movies/:movieId/episode/:episodeId",
  authenticate,
  MovieController.getEpisodeById,
);
router.get(
  "/movies/:movieId/episodes",
  authenticate,
  MovieController.getAllEpisodesByMovieId,
);

export default router;
