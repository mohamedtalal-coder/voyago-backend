const router = require("express").Router();
const { protect, admin } = require("../middleware/authMiddleware");
const TourPackage = require("../models/TourPackage");
const Review = require("../models/Review");
const Contact = require("../models/Contact");
const Stat = require("../models/Stat");
const User = require("../models/User");
const Service = require("../models/Service");

// Dashboard

router.get("/dashboard", protect, admin, async (req, res) => {
  try {
    const [
      totalPackages,
      totalServices,
      totalReviews,
      pendingReviews,
      unreadContacts,
      totalUsers
    ] = await Promise.all([
      TourPackage.countDocuments(),
      Service.countDocuments(),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false }),
      Contact.countDocuments({ isRead: false }),
      User.countDocuments()
    ]);

    res.json({
      totalPackages,
      totalServices,
      totalReviews,
      pendingReviews,
      unreadContacts,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tour Packages

router.get("/packages", protect, admin, async (req, res) => {
  try {
    const packages = await TourPackage.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/packages", protect, admin, async (req, res) => {
  try {
    const tourPackage = await TourPackage.create(req.body);
    res.status(201).json(tourPackage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/packages/:id", protect, admin, async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tourPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(tourPackage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/packages/:id", protect, admin, async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByIdAndDelete(req.params.id);
    if (!tourPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reviews

router.get("/reviews", protect, admin, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/reviews/:id/approve", protect, admin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/reviews/:id/reject", protect, admin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/reviews/:id", protect, admin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Contacts

router.get("/contacts", protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/contacts/:id/read", protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/contacts/:id/replied", protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isReplied: true, isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/contacts/:id", protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats

router.get("/stats", protect, admin, async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/stats/:id", protect, admin, async (req, res) => {
  try {
    const { value, labelKey, order } = req.body;
    const stat = await Stat.findByIdAndUpdate(
      req.params.id,
      { value, labelKey, order },
      { new: true }
    );
    if (!stat) {
      return res.status(404).json({ message: "Stat not found" });
    }
    res.json(stat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Users

router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/users/:id/toggle-admin", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own admin status" });
    }
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Services

router.get("/services", protect, admin, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/services", protect, admin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/services/:id", protect, admin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/services/:id", protect, admin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
