import express from "express";
import * as UtilsController from "../controllers/UtilsController";
import { adminAuthenticate } from "../controllers/AdminController";

const router = express.Router();

router.get("/counts", adminAuthenticate, UtilsController.getCounts);
router.get(
  "/search-movie",
  adminAuthenticate,
  UtilsController.searchMovieOnTMDB,
);

export default router;
