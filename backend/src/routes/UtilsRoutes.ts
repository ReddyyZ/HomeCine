import express from "express";
import * as UtilsController from "../controllers/UtilsController";

const router = express.Router();

router.get("/counts", UtilsController.getCounts);

export default router;
