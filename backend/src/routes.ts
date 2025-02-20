import express from "express";
// import { CreateUser } from "./controller/UserController";
import MovieRoutes from "./routes/MovieRoutes";
import UserRoutes from "./routes/UserRoutes";
import VideoRoutes from "./routes/VideoRoutes";
import UploadRoutes from "./routes/UploadRoutes";
import { authenticate } from "./controllers/UserController";

const routes = express.Router();

routes.use(UserRoutes);
routes.use(authenticate, MovieRoutes);
routes.use(VideoRoutes);
routes.use(UploadRoutes);

export default routes;
