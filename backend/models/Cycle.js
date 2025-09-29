const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  cycleNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["available", "rented", "under_maintenance", "disabled"],
    default: "available",
  },
  location: {
    type: String,
    enum: ["east_campus", "west_campus"],
    required: true,
  },
  // Rental tracking
  currentRental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },
  totalRentCount: { type: Number, default: 0 },

  // Rating system
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },

  // Maintenance tracking
  needsMaintenance: { type: Boolean, default: false },
  maintenanceReason: {
    type: String,
    enum: ["low_rating", "high_usage", "manual", "damage"],
  },
  lastMaintenanceAt: { type: Date },
  total_maintenanceCount: { type: Number, default: 0 },

  // Metadata
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for performance
cycleSchema.index({ location: 1, status: 1 });
cycleSchema.index({ cycleNumber: 1 });
cycleSchema.index({ needsMaintenance: 1 });

cycleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update average rating
cycleSchema.methods.updateRating = function (newRating) {
  this.totalRatings += 1;
  this.averageRating =
    (this.averageRating * (this.totalRatings - 1) + newRating) /
    this.totalRatings;

  // Check if needs maintenance due to low rating
  if (this.averageRating < 2.5 && this.totalRatings >= 5) {
    this.needsMaintenance = true;
    this.maintenanceReason = "low_rating";
  }
};

// Method to check if needs maintenance due to high usage
cycleSchema.methods.checkUsageMaintenance = function () {
  if (this.totalRentCount >= 50) {
    this.needsMaintenance = true;
    this.maintenanceReason = "high_usage";
  }
};

module.exports = mongoose.model("Cycle", cycleSchema);
