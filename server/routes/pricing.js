const express = require("express");
const router = express.Router();
const PricingConfig = require("../models/PricingConfig");
const calculatePrice = require("../utils/calculatePrice");

router.post("/calculate", async(req, res) => {
    const { distanceKms, rideMinutes, waitingMinutes, rideDay } = req.body;

    const config = await PricingConfig.findOne({ active: true });
    if(!config) return res.status(404).json({ error: "No active pricing config" });

    const price = calculatePrice(config, distanceKms, rideMinutes, waitingMinutes, rideDay.toLowerCase());
    res.json({ totalPrice: price });
});

module.exports = router;