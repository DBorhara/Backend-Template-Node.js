const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class User extends Model {
  static async generateSalt() {
    return crypto.randomBytes(16).toString("base64");
  }

  static async encryptPassword(plainText, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  }

  // instance method to check password
  async correctPassword(candidatePwd) {
    return User.encryptPassword(candidatePwd, this.salt) === this.password;
  }
}

// Define user model
User.init(
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING,
    },
    googleId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.salt = await User.generateSalt();
          user.password = await User.encryptPassword(user.password, user.salt);
        }
      },
      beforeBulkCreate: async (users) => {
        users.forEach(async (user) => {
          if (user.changed("password")) {
            user.salt = await User.generateSalt();
            user.password = await User.encryptPassword(
              user.password,
              user.salt
            );
          }
        });
      },
    },
  }
);

module.exports = User;
