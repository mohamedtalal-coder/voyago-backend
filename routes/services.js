const router = require("express").Router();
const Service = require("../models/Service");

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
