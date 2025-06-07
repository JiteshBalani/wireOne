const PricingConfig = require("../models/PricingConfig");

const calculatePrice = (config, distanceKms, rideMinutes, waitingMinutes, rideDay) => {
    try {
        // Convert day name to abbreviated format for matching
        const dayMap = {
            'monday': 'mon',
            'tuesday': 'tue', 
            'wednesday': 'wed',
            'thursday': 'thu',
            'friday': 'fri',
            'saturday': 'sat',
            'sunday': 'sun'
        };
        
        const dayAbbr = dayMap[rideDay.toLowerCase()] || rideDay.toLowerCase();
        
        // Find distance-based price for the specific day
        const dbp = config.dbp.find(d => d.day === dayAbbr);
        if (!dbp) {
            throw new Error(`No pricing config found for day: ${rideDay}`);
        }

        // Get distance additional price (assuming first element)
        const dap = config.dap[0];
        if (!dap) {
            throw new Error("No distance additional pricing config found");
        }

        // Get waiting charge config (assuming first element)
        const wc = config.wc[0];
        if (!wc) {
            throw new Error("No waiting charge config found");
        }

        // Calculate base price
        const basePrice = distanceKms <= dbp.uptoKms ? dbp.price : dbp.price;
        
        // Calculate additional distance cost
        const extraDistance = Math.max(0, distanceKms - dbp.uptoKms);
        const additionalDistance = extraDistance * dap.pricePerKm;

        // Find time multiplier factor
        let multiplier = 1;
        for (const tmf of config.tmf) {
            if (rideMinutes >= tmf.fromMinutes && rideMinutes <= tmf.toMinutes) {
                multiplier = tmf.multiplier;
                break;
            }
        }

        // Calculate time charges (applying multiplier to base + additional distance)
        const baseAndDistanceTotal = basePrice + additionalDistance;
        const timeCharges = baseAndDistanceTotal * (multiplier - 1); // Only the additional charge from multiplier

        // Calculate waiting charges
        const waitingCharges = waitingMinutes > wc.afterMinutes
            ? (waitingMinutes - wc.afterMinutes) * wc.chargePerMinute 
            : 0;

        // Calculate total
        const totalPrice = baseAndDistanceTotal * multiplier + waitingCharges;

        return {
            totalPrice: parseFloat(totalPrice.toFixed(2)),
            details: {
                basePrice: parseFloat(basePrice.toFixed(2)),
                additionalDistance: parseFloat(additionalDistance.toFixed(2)),
                timeCharges: parseFloat(timeCharges.toFixed(2)),
                waitingCharges: parseFloat(waitingCharges.toFixed(2)),
            }
        };

    } catch (error) {
        console.error("Error in calculatePrice utility:", error);
        throw error;
    }
};
// const calculatePrice = (config, distanceKms, rideMinutes, waitingMinutes, rideDay) => {
//     const dbp = config.dbp.find(d => d.day === rideDay);
//     const dap = config.dap[0];
//     const wc = config.wc[0];

//     const basePrice = dbp && distanceKms <= dbp.uptoKms ? dbp.price : (dbp?.price || 0);
//     const extraDistance = Math.max(0, distanceKms - dbp.uptoKms);
//     const distanceCost = extraDistance * dap.pricePerKm;

//     let multiplier = 1;
//     for(const t of config.tmf) {
//         if(rideMinutes >= t.fromMinutes && rideMinutes <= t.toMinutes) {
//             multiplier = t.multiplier;
//             break;
//         }
//     }

//     const waitCharge = waitingMinutes > wc.afterMinutes
//         ? (waitingMinutes - wc.afterMinutes) * wc.chargePerMinute : 0;

//     const total = (basePrice + distanceCost) * multiplier + waitCharge;
//     return parseFloat(total.toFixed(2));
// }

module.exports = calculatePrice;