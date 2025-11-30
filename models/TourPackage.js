const mongoose = require("mongoose");

const tourPackageSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: false,
    },
    titleKey: {
      type: String,
      required: [true, "Please add a title key"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Please add a price"],
    },
    img: {
      type: String,
      required: false,
    },
    duration: {
      type: String,
      required: false,
    },
    groupKey: {
      type: String,
      required: false,
    },
    rating: {
      type: String,
      default: "0",
    },
    subimages: {
      type: [String],
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    longDescKey: {
      type: String,
      required: false,
    },
    gallery: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TourPackage", tourPackageSchema, "tourPackages");
