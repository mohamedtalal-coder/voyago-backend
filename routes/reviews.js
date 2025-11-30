const router = require("express").Router();
const Review = require("../models/Review");

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/tour/:tourId", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      tourPackageId: req.params.tourId,
      isApproved: true 
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, comment, rating, avatar, tourPackageId } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ message: "Name and comment are required" });
    }

    const review = await Review.create({
      name,
      comment,
      rating: rating || 5,
      avatar,
      tourPackageId,
      isApproved: true,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
