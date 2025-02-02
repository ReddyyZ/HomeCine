import { Sequelize } from "sequelize";
import User from "../model/User";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const models = [
  User
];

sequelize.sync().then(() => console.log("DB synced!"));
models.map(m=>m(sequelize))

export {
  sequelize
};