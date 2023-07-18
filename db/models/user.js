const crypto = require("node:crypto");
const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class User extends Model {
  static async generateSalt() {
    return crypto.randomBytes(16).toString("base64");
  }

  static async encryptPassword(pw, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(pw)
      .update(salt)
      .digest("hex");
  }
  // 1e38b6a36f6e3ac36e63f64892f2e1cf4291e7e3666902c9b97dc5af01546c06
  // Salt aUYqF5jlAZVseb9gxB8e9Q==

  // instance method to check pw
  async correctPassword(pwAttempt) {
    return (await User.encryptPassword(pwAttempt, this.salt)) === this.password;
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
      // For OAuth purposes
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    hooks: {
      //Single
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.salt = await User.generateSalt();
          user.password = await User.encryptPassword(user.password, user.salt);
        }
      },
      // Many created
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

/* [{
    email:test@test.com, 
    password:123 >> 1e38b6a36f6e3ac36e63f64892f2e1cf4291e7e3666902c9b97dc5af01546c06, 
    salt: aUYqF5jlAZVseb9gxB8e9Q==, 
    googleId:81he2i12nin}]*/

// user PW(new or changed) >> Hashed(RSA-SHA256) >> New Salt Generated(unique) >> New Salt Applied to Hashed PW >> Unique Encrypted PW
