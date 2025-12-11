const router = require("express").Router();
const Stat = require("../models/Stat");

router.get("/", async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:key", async (req, res) => {
  try {
    const { value, labelKey, icon, order } = req.body;
    
    const stat = await Stat.findOneAndUpdate(
      { key: req.params.key },
      { value, labelKey, icon, order },
      { new: true, upsert: true }
    );
    
    res.json(stat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
