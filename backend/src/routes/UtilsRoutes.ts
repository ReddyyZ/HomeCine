import express from "express";
import * as UtilsController from "../controllers/UtilsController";
import { adminAuthenticate } from "../controllers/AdminController";

const router = express.Router();

router.get("/counts", adminAuthenticate, UtilsController.getCounts);

export default router;
