const express = require("express");
const router = express.Router();
const PricingConfig = require("../models/PricingConfig");
const calculatePrice = require("../utils/calculatePrice");

router.post("/calculate", async (req, res) => {
  try {
    const { distanceKms, rideMinutes, waitingMinutes, rideDay } = req.body;

    const config = await PricingConfig.findOne({ active: true });
    if (!config)
      return res.status(404).json({ error: "No active pricing config" });

    const result = calculatePrice(
      config,
      distanceKms,
      rideMinutes,
      waitingMinutes,
      rideDay.toLowerCase()
    );

    res.json({
      totalPrice: result.totalPrice,
      configUsed: config.name,
      details: result.details,
    });
  } catch (error) {
    console.error("Error in price calculation route:", error);
    res.status(500).json({ error: "Server error calculating price" });
  }
});

module.exports = router;
