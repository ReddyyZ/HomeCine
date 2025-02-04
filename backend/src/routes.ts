import express from "express";
// import { CreateUser } from "./controller/UserController";
import MovieRoutes from "@src/routes/MovieRoutes";

const routes = express.Router();

routes.use(MovieRoutes);

export default routes;
