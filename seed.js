"use strict";

const db = require("./db");
const { User } = require("./db/models");

const seedUsers = [
  { email: "depak@test.com", password: "abc", isAdmin: true },
  { email: "test1@test.com", password: "123", isAdmin: false },
  { email: "test2@test.com", password: "456", isAdmin: false },
  { email: "test3@test.com", password: "789", isAdmin: false },
  { email: "test4@test.com", password: "123", isAdmin: false },
  { email: "test5@test.com", password: "123", isAdmin: false },
  { email: "test6@test.com", password: "123", isAdmin: false },
];

const seed = async () => {
  try {
    // await db.sync({ force: true }); // Clear database
    await User.bulkCreate(seedUsers);
    console.log("Seeding successful!");
    process.exit(0); // Exit process with success status
  } catch (error) {
    console.error("Seeding failed: ", error);
    process.exit(1); // Exit process with failure status
  }
};

seed(); // Call the async function to seed the database
