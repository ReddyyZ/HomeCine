import { Request, Response } from "express";
import {
  countEpisodes,
  countMovies,
  countSeries,
} from "../functions/MovieFuncs";
import { countUsers } from "../functions/UserFuncs";

export async function getCounts(req: Request, res: Response) {
  const { get } = req.query;
  if (get) {
    const response: {
      movies?: number;
      series?: number;
      episodes?: number;
      videos?: number;
      users?: number;
    } = {};

    String(get)
      .split(",")
      .forEach(async (item) => {
        switch (item) {
          case "movies":
            response.movies = await countMovies();
            break;
          case "series":
            response.series = await countSeries();
            break;
          case "episodes":
            response.episodes = await countEpisodes();
            break;
          case "videos":
            response.videos = (await countMovies()) + (await countEpisodes());
            break;
          case "users":
            response.users = await countUsers();
            break;
        }
      });
    res.json(response);
  } else {
    const movies = await countMovies();
    const series = await countSeries();
    const episodes = await countEpisodes();
    const videos = movies + episodes;
    const users = await countUsers();

    res.json({
      movies,
      series,
      episodes,
      videos,
      users,
    });
  }
}
