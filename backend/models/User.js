const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNo: { type: Number },
  phone: { type: String },
  password: { type: String },
  googleId: { type: String },
  role: {
    type: String,
    enum: ["student", "guard", "super_admin", "finance_admin"],
    default: "student",
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
  },
  fine: { type: Number, default: 0 },
  totalTimesRented: { type: Number, default: 0 },
  totalDurationOfRent: { type: Number, default: 0 },
  profilePicture: { type: String, default: "" },
  location: {
    type: String,
    enum: ["east_campus", "west_campus"],
    default: "east_campus",
  },
  guardShift: {
    type: String,
    enum: ["morning", "evening"],
    default: "morning",
  },
  // OTP for password reset
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpires: { type: Date },
  // Email verification
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  // Account creation
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ rollNo: 1 });
userSchema.index({ role: 1, status: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next(); // Skip if password is not set (Google OAuth)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to validate HBTU email
userSchema.statics.validateHBTUEmail = function (email) {
  return email.endsWith("@hbtu.ac.in");
};

module.exports = mongoose.model("User", userSchema);
