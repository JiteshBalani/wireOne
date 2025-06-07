const express = require("express");
const router = express.Router();
const PricingConfig = require("../models/PricingConfig");

//Fetch all pricing configurations
router.get("/existing-configs", async(req, res) => {
    try{
        const configs = await PricingConfig.find().sort({createdAt: -1});
        res.json(configs);
    } catch(error) {
        console.error("Error fetching configs:", error);
        res.status(500).json({ error: " Failed to fetch configurations" });
    }
});

//Fetch single pricing config by ID
router.get("/:id", async(req, res) => {
    try{
        const config = await PricingConfig.findById(req.params.id);
        if(!config){
            return res.status(404).json({error: "Configuration not found"});
        }
        res.json(config);
    } catch(error) {
        console.error("Error fetching config:", error);
        res.status(500).json({error: "Failed to fetch configuration"});
    }
});

//Create new pricing configuration
router.post("/new-config", async(req, res) => {
    try{
        const {name, createdBy, dbp, dap, tmf, wc} = req.body;

        if(!name || !createdBy || !dbp || !dap || !tmf || !wc) {
            return res.status(400).json({
                error: "Missing required fields: name, createdBy, dbp, dap, tmf, wc"
            });
        }

        const requiredDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const providedDays = dbp.map(d => d.day);
        const missingDays = requiredDays.filter(day => !providedDays.includes(day));

        if(missingDays.length > 0) {
            return res.status(400).json({
                error: `Missing pricing for days: ${missingDays.join(', ')}`
            });
        }
        let active = req.body.active || false;
        if(active){
            await PricingConfig.updateMany({}, { active: false });
        }

        const newConfig = new PricingConfig({name, createdBy, active, dbp, dap, tmf, wc});

        const savedConfig = await newConfig.save();
        res.status(201).json(savedConfig);
    } catch(error) {
        console.error("Error creating config:", error);
        if(error.name === 'ValidationError') {
            return res.status(400).json({
                error: "Validation error",
                details: error.message
            });
        }
        res.status(500).json({ error: "Failed to create configuration" });
    }
});

//Update pricing configuration
router.put("/update-config/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If setting this config to active, deactivate all others first
        if (updateData.active) {
            await PricingConfig.updateMany({ _id: { $ne: id } }, { active: false });
        }

        const updatedConfig = await PricingConfig.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedConfig) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        res.json(updatedConfig);

    } catch (error) {
        console.error("Error updating config:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: "Validation error", 
                details: error.message 
            });
        }
        res.status(500).json({ error: "Failed to update configuration" });
    }
});

//Delete a config
router.delete("/delete-config/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const config = await PricingConfig.findById(id);
        if (!config) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        // Don't allow deletion of active config
        if (config.active) {
            return res.status(400).json({ 
                error: "Cannot delete active configuration. Please activate another config first." 
            });
        }

        await PricingConfig.findByIdAndDelete(id);
        res.json({ message: "Configuration deleted successfully" });

    } catch (error) {
        console.error("Error deleting config:", error);
        res.status(500).json({ error: "Failed to delete configuration" });
    }
});

//Toggle active status
router.patch("/:id/toggle-active", async (req, res) => {
    try {
        const { id } = req.params;
        
        const config = await PricingConfig.findById(id);
        if (!config) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        // If making this active, deactivate all others
        if (!config.active) {
            await PricingConfig.updateMany({}, { active: false });
            config.active = true;
        } else {
            config.active = false;
        }

        await config.save();
        res.json(config);

    } catch (error) {
        console.error("Error toggling active status:", error);
        res.status(500).json({ error: "Failed to toggle active status" });
    }
});

module.exports = router;