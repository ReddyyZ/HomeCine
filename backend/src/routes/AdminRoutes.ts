import express from "express";
import * as AdminController from "../controllers/AdminController";

const router = express.Router();

router.post("/admin/login", AdminController.login);

export default router;
