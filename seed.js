const db = require("./db");
const { Shoes, Shopper } = require("./db/models");

const seedShoes = [
  { company: "Nike", type: "Jordan 5's", laces: true, size: 10 },
  { company: "Adidas", type: "Sambas", laces: true, size: 7 },
  { company: "Yeezy's", type: "Yeezy 1's", laces: true, size: 12 },
  { company: "Crocs", type: "Crocodillio's", laces: false, size: 3 },
  { company: "Convers", type: "All Stars", laces: true, size: 19 },
  { company: "New Balance", type: "550's", laces: true, size: 10 },
  { company: "Grandma", type: "Chancla Poderosas", laces: false, size: 8 },
];

const seedShoppers = [
  { firstName: "Depak", lastName: "Borhara", size: 13 },
  { firstName: "Abi", lastName: "Scholz", size: 8 },
  { firstName: "Rahima", lastName: "Khabibullaeva", size: 7 },
  { firstName: "Sabina", lastName: "Ismailova", size: 9 },
  { firstName: "Nafisa I wash my chicken", lastName: "Anzum", size: 8 },
  { firstName: "Elaine", lastName: "Luzung", size: 10 },
  { firstName: "Nilly", lastName: "Billy", size: 2 },
  { firstName: "Miranda", lastName: "Karecho", size: 5 },
  { firstName: "Bruno", lastName: "Mars", size: 9 },
];

const seed = async () => {
  await Shoes.bulkCreate(seedShoes);
  await Shopper.bulkCreate(seedShoppers);
};

seed().then(() => process.exit());
