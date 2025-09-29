const mongoose = require("mongoose");

const qrTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["rental", "return"],
    required: true,
  },

  // For rental tokens
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  guard: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  duration: { type: Number }, // in minutes
  location: {
    type: String,
    enum: ["east_campus", "west_campus"],
  },

  // For return tokens
  rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },

  // Token validity
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

// Auto-expire tokens after expiry
qrTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if token is valid
qrTokenSchema.methods.isValid = function () {
  return !this.isUsed && new Date() < this.expiresAt;
};

// Method to mark token as used
qrTokenSchema.methods.markAsUsed = function () {
  this.isUsed = true;
  this.usedAt = new Date();
};

module.exports = mongoose.model("QRToken", qrTokenSchema);
