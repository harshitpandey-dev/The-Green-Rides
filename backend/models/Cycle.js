const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  cycleId: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "damaged"],
    default: "available",
  },
  addedBy: { type: JSON, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cycle", cycleSchema);
