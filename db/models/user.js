const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class User extends Model {
  // Generate a random salt
  static async generateSalt() {
    // Use Node.js crypto module to generate a random salt
    return crypto.randomBytes(16).toString("base64");
  }

  // Encrypt password
  static async encryptPassword(password, salt) {
    // Use Node.js crypto module to create a hash (SHA-256) from password and salt
    return crypto
      .createHash("RSA-SHA256")
      .update(password)
      .update(salt)
      .digest("hex");
  }

  // Instance method to verify a user's password
  async correctPassword(candidatePassword) {
    // Check if the hashed candidate password is the same as the stored password
    return (
      (await User.encryptPassword(candidatePassword, this.salt)) ===
      this.password
    );
  }
}

// Define user model
User.init(
  {
    // User email
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // User password
    password: {
      type: DataTypes.STRING,
    },
    // Salt for password
    salt: {
      type: DataTypes.STRING,
    },
    // User Google ID (for OAuth)
    googleId: {
      type: DataTypes.STRING,
    },
    // Flag to denote if user is an admin
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db, // The DB connection instance
    modelName: "User", // The name of our model
    hooks: {
      // Single user save
      beforeSave: async (user) => {
        if (user.changed("password")) {
          // If the password field has changed, generate a new salt
          user.salt = await User.generateSalt();
          // And encrypt the password
          user.password = await User.encryptPassword(user.password, user.salt);
        }
      },
      // Bulk user creation
      beforeBulkCreate: async (users) => {
        for (let user of users) {
          if (user.changed("password")) {
            // If the password field has changed, generate a new salt
            user.salt = await User.generateSalt();
            // And encrypt the password
            user.password = await User.encryptPassword(
              user.password,
              user.salt
            );
          }
        }
      },
    },
  }
);

module.exports = User;
