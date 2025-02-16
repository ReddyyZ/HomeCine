import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import "./db/sequilize";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/media', express.static(path.join(__dirname,"../media/thumbnails")));
app.use(routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
