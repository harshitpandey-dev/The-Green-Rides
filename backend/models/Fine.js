const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: true,
    },
    cycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cycle",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    fineType: {
      type: String,
      enum: [
        "late_return",
        "damage",
        "parking_violation",
        "lost_cycle",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "waived"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "card"],
    },
    description: {
      type: String,
      trim: true,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
fineSchema.index({ student: 1, status: 1 });
fineSchema.index({ dueDate: 1, status: 1 });
fineSchema.index({ createdAt: -1 });

// Virtual to get student roll number
fineSchema.virtual("studentRollNo").get(function () {
  return this.student?.rollNumber;
});

module.exports = mongoose.model("Fine", fineSchema);
