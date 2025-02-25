import express from "express";
import * as UploadController from "../controllers/UploadController";
import upload from "../services/upload";
import { adminAuthenticate } from "../controllers/AdminController";

const router = express.Router();

router.post(
  "/upload",
  adminAuthenticate,
  upload.array("file"),
  UploadController.uploadFile,
);

export default router;
