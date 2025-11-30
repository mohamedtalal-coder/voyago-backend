const router = require("express").Router();
const TourPackage = require("../models/TourPackage");

router.get("/", async (req, res) => {
  try {
    const tourPackages = await TourPackage.find();
    res.json(tourPackages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tourPackage = await TourPackage.findById(req.params.id);
    if (!tourPackage) {
      return res.status(404).json({ message: "Tour package not found" });
    }
    res.json(tourPackage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
