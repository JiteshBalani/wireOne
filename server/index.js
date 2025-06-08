const dotenv = require('dotenv');
const envFile = process.argv.includes('--dev') ? '.env.development' : '.env.production';
dotenv.config({ path: envFile });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pricingRoutes = require("./routes/pricing");
const configRoutes = require("./routes/config");
const app = express();

const frontendURL = process.env.FRONTEND_URL;
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://wireone.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use("/api", pricingRoutes);
app.use("/api/configs", configRoutes);

const dbURL = process.env.DB_URL;

mongoose.connect(dbURL).then(() => {
    console.log("Connection to database successful!");
}).catch(err => {
    console.log("DB Connection Error:", err);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Server is running on', PORT, '&', 'Frontend URL is', frontendURL);
});
