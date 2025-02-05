import express from "express";
// import { CreateUser } from "./controller/UserController";
import MovieRoutes from "@src/routes/MovieRoutes";
import UserRoutes from "@src/routes/UserRoutes";
import VideoRoutes from "@src/routes/VideoRoutes";
import UploadRoutes from "@src/routes/UploadRoutes";
import { authenticate } from "./controllers/UserController";

const routes = express.Router();

routes.use(UserRoutes);
routes.use(authenticate, MovieRoutes);
routes.use(VideoRoutes);
routes.use(UploadRoutes);

export default routes;
