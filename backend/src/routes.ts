import express from "express";
// import { CreateUser } from "./controller/UserController";
import MovieRoutes from "./routes/MovieRoutes";
import UserRoutes from "./routes/UserRoutes";
import VideoRoutes from "./routes/VideoRoutes";
import UploadRoutes from "./routes/UploadRoutes";
import UtilsRoutes from "./routes/UtilsRoutes";

const routes = express.Router();

routes.use(UserRoutes);
routes.use(MovieRoutes);
routes.use(VideoRoutes);
routes.use(UploadRoutes);
routes.use(UtilsRoutes);

export default routes;
