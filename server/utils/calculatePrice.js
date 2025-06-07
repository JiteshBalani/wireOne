const calculatePrice = (config, distanceKms, rideMinutes, waitingMinutes, rideDay) => {
    const dbp = config.dbp.find(d => d.day === rideDay);
    const dap = config.dap[0];
    const wc = config.wc[0];

    const basePrice = dbp && distanceKms <= dbp.uptoKms ? dbp.price : (dbp?.price || 0);
    const extraDistance = Math.max(0, distanceKms - dbp.uptoKms);
    const distanceCost = extraDistance * dap.pricePerKm;

    let multiplier = 1;
    for(const t of config.tmf) {
        if(rideMinutes >= t.fromMinutes && rideMinutes <= t.toMinutes) {
            multiplier = t.multiplier;
            break;
        }
    }

    const waitCharge = waitingMinutes > wc.afterMinutes
        ? (waitingMinutes - wc.afterMinutes) * wc.chargePerMinute : 0;

    const total = (basePrice + distanceCost) * multiplier + waitCharge;
    return parseFloat(total.toFixed(2));
}

module.exports = calculatePrice;