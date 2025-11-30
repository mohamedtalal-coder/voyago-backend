const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    avatar: {
      type: String,
      required: false,
    },
    tourPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourPackage",
      required: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema, "reviews");
