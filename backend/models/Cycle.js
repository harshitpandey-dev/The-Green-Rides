const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  cycleNo: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "damaged"],
    default: "available",
  },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cycle", cycleSchema);
