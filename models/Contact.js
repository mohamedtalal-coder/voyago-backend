const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: false,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please add your message"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isReplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema, "contacts");
