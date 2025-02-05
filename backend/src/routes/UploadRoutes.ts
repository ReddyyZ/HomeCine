import express from "express";
import * as UploadController from "@src/controllers/UploadController";
import upload from "../services/upload";

const router = express.Router();

router.post("/upload", upload.array("file"), UploadController.uploadFile);

export default router;
