const mongoose = require("mongoose");

const statSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    labelKey: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stat", statSchema, "stats");
