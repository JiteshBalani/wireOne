const mongoose = require("mongoose");

const Days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DistanceBasedPriceSchema = new mongoose.Schema({
    day: { type: String, enum: Days },
    uptoKms: Number,
    price: Number,
});

const DistanceAdditionalPriceSchema = new mongoose.Schema({
    afterKms: Number,
    pricePerKm: Number,
});

const TimeMultiplierFactorScema = new mongoose.Schema({
    fromMinutes: Number,
    toMinutes: Number,
    multiplier: Number,
});

const WaitingChargeSchema = new mongoose.Schema({
    afterMinutes: Number,
    chargePerMinute: Number,
});

const PricingConfigSchema = new mongoose.Schema({
    name: String,
    createdBy: String,
    active: {type: Boolean, default: false},
    dbp: [DistanceBasedPriceSchema],
    dap: [DistanceAdditionalPriceSchema],
    tmf: [TimeMultiplierFactorScema],
    wc: [WaitingChargeSchema],
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("PricingConfig", PricingConfigSchema);