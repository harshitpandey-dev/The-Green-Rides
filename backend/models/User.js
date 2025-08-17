const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNo: { type: Number },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "guard", "admin", "finance"],
    default: "student",
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
  },
  fine: { type: Number, default: 0 },
  profilePicture: { type: String, default: "" },
  location: {
    type: String,
    enum: ["east_campus", "west_campus"],
    default: "east_campus",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
