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

// app.use(cors({
//   origin: ['https://wireone.vercel.app', 'http://localhost:3000'], // Add your frontend domains
//   credentials: true, // If you need to send cookies/auth headers
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.options('*', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://wireone.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
