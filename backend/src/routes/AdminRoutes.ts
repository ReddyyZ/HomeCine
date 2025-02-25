import express from "express";
import * as AdminController from "../controllers/AdminController";
import * as MovieController from "../controllers/MovieController";

const router = express.Router();

router.post("/admin/login", AdminController.login);
router.post(
  "/movies",
  AdminController.adminAuthenticate,
  MovieController.createMovie,
);
router.put(
  "/movies/:movieId",
  AdminController.adminAuthenticate,
  MovieController.updateMovie,
);

router.delete(
  "/movies/:movieId",
  AdminController.adminAuthenticate,
  MovieController.deleteMovie,
);
router.delete(
  "/movies/:movieId/episode/:episodeId",
  AdminController.adminAuthenticate,
  MovieController.deleteEpisode,
);
router.delete(
  "/movies/:movieId/episodes",
  AdminController.adminAuthenticate,
  MovieController.deleteMultipleEpisodes,
);

export default router;
