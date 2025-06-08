const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pricingRoutes = require("./routes/pricing");
const configRoutes = require("./routes/config");
const app = express();

const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: ['http://localhost:5173', 'https://wireone.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
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
