import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes, CreationOptional } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../db/sequilize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
};

User.init({
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
        args: [2]
      },
      max: {
        msg: "Name must be at most 50 characters long",
        args: [50]
      }
    }
  },
  email: {
    type: new DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  sequelize,
  hooks: {
    beforeCreate: async (user: User) => {
      const hashedPassword = await bcrypt.hash(user.password, 2);
      user.password = hashedPassword;
    }
  }
});