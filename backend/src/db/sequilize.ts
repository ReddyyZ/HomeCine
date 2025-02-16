import { Sequelize } from "sequelize";
import initialFileScan from "../services/fileWatcher";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

sequelize.sync().then(() => {
  console.log("DB synced! 🚀");
  console.log("Starting file watcher...");
  initialFileScan();
});

export { sequelize };
