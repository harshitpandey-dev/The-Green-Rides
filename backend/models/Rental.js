const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rental", rentalSchema);
