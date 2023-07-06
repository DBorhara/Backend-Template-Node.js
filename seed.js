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
  await User.bulkCreate(seedUsers);
};

seed().then(() => process.exit());
