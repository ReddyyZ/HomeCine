import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/sequilize";

export class Movie extends Model<
  InferAttributes<Movie>,
  InferCreationAttributes<Movie>
> {
  declare id: CreationOptional<number>;
  declare year: CreationOptional<number>;
  declare overview: CreationOptional<string>;
  declare posterUrl: CreationOptional<string>;
  declare videoDuration: CreationOptional<number>;
  declare originalTitle: string;
  declare title: string;
  declare filePath: string;
  declare isSeries: boolean;
  declare numberOfSeasons: CreationOptional<number>;
  declare genres: string;
  declare originalName: CreationOptional<string>;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year: {
      type: DataTypes.NUMBER,
    },
    overview: {
      type: new DataTypes.TEXT(),
      validate: {
        min: {
          msg: "Overview must be at least 1 characters long",
          args: [1],
        },
        max: {
          msg: "Overview must be at most 350 characters long",
          args: [350],
        },
      },
    },
    posterUrl: {
      type: DataTypes.TEXT,
    },
    videoDuration: {
      type: DataTypes.NUMBER,
    },
    originalTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: {
          msg: "Title must be at least 1 characters long",
          args: [1],
        },
        max: {
          msg: "Title must be at most 150 characters long",
          args: [150],
        },
      },
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: {
          msg: "Title must be at least 1 characters long",
          args: [1],
        },
        max: {
          msg: "Title must be at most 150 characters long",
          args: [150],
        },
      },
    },
    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    isSeries: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    numberOfSeasons: {
      type: DataTypes.NUMBER,
    },
    genres: {
      type: DataTypes.JSON,
    },
    originalName: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "movies",
    sequelize,
  },
);

export class Episode extends Model<
  InferAttributes<Episode>,
  InferCreationAttributes<Episode>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare season: number;
  declare episodeNumber: number;
  declare filePath: string;
  declare movieId: number;
  declare posterUrl: CreationOptional<string>;
  declare videoDuration: CreationOptional<number>;
}

Episode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: {
          msg: "Title must be at least 1 characters long",
          args: [1],
        },
        max: {
          msg: "Title must be at most 150 characters long",
          args: [150],
        },
      },
    },
    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    posterUrl: {
      type: DataTypes.TEXT,
    },
    videoDuration: {
      type: DataTypes.NUMBER,
    },
    season: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    episodeNumber: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.NUMBER,
    },
  },
  {
    tableName: "episodes",
    sequelize,
  },
);

Movie.hasMany(Episode, {
  foreignKey: "movieId",
});

Episode.belongsTo(Movie, {
  foreignKey: "movieId",
});
