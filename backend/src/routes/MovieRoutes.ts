import express from "express";
import * as MovieController from '@src/controllers/MovieController';

const router = express.Router();

router.get("/movies", MovieController.getMovies);
router.get("/movies/:movieId", MovieController.getMovie);
router.get("/movies/:movieId/seasons", MovieController.getSeasonsFromMovie);
router.get("/movies/:movieId/season/:season", MovieController.getEpisodesFromSeason);

router.post("/movies/:movieId/update", MovieController.updateMovie);

router.delete("/movies/:movieId", MovieController.deleteMovie);
router.delete("/movies/:movieId/episode/:episodeId", MovieController.deleteEpisode);

export default router;