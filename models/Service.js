const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    img: {
      type: String,
      required: false,
    },
    titleKey: {
      type: String,
      required: [true, "Please add a title key"],
      trim: true,
    },
    descKey: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema, "services");
