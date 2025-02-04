import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/sequilize";
import { hashPassword } from "../services/auth";
import { v4 as UUIDV4 } from "uuid";

type episodeProgress = {
  progress: number;
  watched: boolean;
};

type movieProgress = {
  progress?: number;
  isSeries: boolean;
  episodes?: Record<string, episodeProgress>;
  watched: boolean;
};

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare watchedMovies?: Record<string, movieProgress>;
}

User.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(100),
      allowNull: false,
      validate: {
        min: {
          msg: "Name must be at least 2 characters long",
          args: [2],
        },
        max: {
          msg: "Name must be at most 100 characters long",
          args: [100],
        },
      },
    },
    email: {
      type: new DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    watchedMovies: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "users",
    sequelize,
    hooks: {
      beforeCreate: async (user: User) => {
        const hashedPassword = await hashPassword(user.password);
        const userId = UUIDV4();
        user.password = hashedPassword;
        user.id = userId;
      },
    },
  },
);
