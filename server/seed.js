const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const PricingConfig = require("./models/PricingConfig");

const dbURL = process.env.DB_URL

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = {
  name: "Default Pricing Config",
  active: true,
  dbp: [
    { day: "mon", uptoKms: 3, price: 90 },
    { day: "tue", uptoKms: 3, price: 80 },
    { day: "wed", uptoKms: 3, price: 80 },
    { day: "thu", uptoKms: 3, price: 80 },
    { day: "sat", uptoKms: 3.5, price: 90 },
    { day: "sun", uptoKms: 3.5, price: 95 },
  ],
  dap: [
    { afterKms: 3, pricePerKm: 30 }
  ],
  tmf: [
    { fromMinutes: 0, toMinutes: 60, multiplier: 1 },
    { fromMinutes: 61, toMinutes: 120, multiplier: 1.25 },
    { fromMinutes: 121, toMinutes: 180, multiplier: 2.2 }
  ],
  wc: [
    { afterMinutes: 3, chargePerMinute: 1.66 }
  ]
};

PricingConfig.create(seedData)
  .then(() => {
    console.log("Pricing config seeded successfully.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error seeding pricing config:", err);
    mongoose.disconnect();
  });
