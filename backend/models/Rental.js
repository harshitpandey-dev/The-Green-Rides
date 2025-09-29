const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },

  // Rental details
  duration: { type: Number, required: true },
  rentedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date },

  // Location tracking
  rentedLocation: {
    type: String,
    enum: ["east_campus", "west_campus"],
    required: true,
  },
  returnedLocation: {
    type: String,
    enum: ["east_campus", "west_campus"],
  },

  // Guard information
  rentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Guard who rented
    required: true,
  },
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Guard who processed return
  },

  // Fine calculation
  fine: { type: Number, default: 0 },
  actualDuration: { type: Number }, // in minutes

  // Rating and feedback
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  ratedAt: { type: Date },

  // Status
  isActive: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["active", "returned", "overdue"],
    default: "active",
  },

  // QR Code tracking
  rentalToken: { type: String }, // For QR code generation
  returnToken: { type: String }, // For return QR code
  tokenExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
rentalSchema.index({ student: 1, isActive: 1 });
rentalSchema.index({ cycle: 1, isActive: 1 });
rentalSchema.index({ guard: 1 });
rentalSchema.index({ status: 1 });
rentalSchema.index({ rentedAt: 1 });

rentalSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for time left
rentalSchema.virtual("timeLeft").get(function () {
  if (this.returnedAt) return 0;
  const now = new Date();
  const rentedTime = new Date(this.rentedAt);
  const elapsedMinutes = Math.floor((now - rentedTime) / (1000 * 60));
  return Math.max(0, this.duration - elapsedMinutes);
});

// Virtual for calculating fine
rentalSchema.virtual("calculateFine").get(function () {
  if (this.returnedAt) return this.fine;
  const now = new Date();
  const rentedTime = new Date(this.rentedAt);
  const elapsedMinutes = Math.floor((now - rentedTime) / (1000 * 60));
  const overdueMinutes = Math.max(0, elapsedMinutes - this.duration);
  return overdueMinutes * 1; // ₹1 per minute
});

// Method to calculate actual duration and fine on return
rentalSchema.methods.processReturn = function () {
  if (!this.returnedAt) {
    this.returnedAt = new Date();
  }

  const rentedTime = new Date(this.rentedAt);
  const returnedTime = new Date(this.returnedAt);
  this.actualDuration = Math.floor((returnedTime - rentedTime) / (1000 * 60));

  const overdueMinutes = Math.max(0, this.actualDuration - this.duration);
  this.fine = overdueMinutes * 1; // ₹1 per minute
  this.status = "returned";
  this.isActive = false;

  return this.fine;
};

module.exports = mongoose.model("Rental", rentalSchema);
