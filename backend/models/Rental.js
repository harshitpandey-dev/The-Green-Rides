const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },
  duration: { type: Number, required: true },
  returnedAt: { type: Date },
  rentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rentedLocation: {
    type: String,
    enum: ["east_campus", "west_campus"],
    required: true,
  },
  returnedLocation: {
    type: String,
    enum: ["east_campus", "west_campus"],
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: false },
  isActive: { type: boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rental", rentalSchema);
