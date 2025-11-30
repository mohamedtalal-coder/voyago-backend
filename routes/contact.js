const router = require("express").Router();
const Contact = require("../models/Contact");

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ 
      message: "Thank you for your message! We will get back to you soon.",
      contact 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all contact submissions (admin only - add auth later)
// @route   GET /api/contact
// @access  Private (should be admin)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Mark contact as read
// @route   PATCH /api/contact/:id/read
// @access  Private (should be admin)
router.patch("/:id/read", async (req, res) => {
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

module.exports = router;
