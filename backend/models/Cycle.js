const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  cycleId: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "under_maintenance"],
    default: "available",
  },
  location: {
    type: String,
    enum: ["east_campus", "west_campus"],
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cycle", cycleSchema);
