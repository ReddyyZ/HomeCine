import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

sequelize.sync().then(() => console.log("DB synced!"));

export {
  sequelize
};