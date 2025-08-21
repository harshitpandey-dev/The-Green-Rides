const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Green Rides - Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Green Rides - Password Reset</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Please use the following OTP:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 36px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>This OTP will expire in 10 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Green Rides Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Student self-registration (only for @hbtu.ac.in emails)
exports.register = async ({ name, email, rollNo, password, phone }) => {
  // Validate HBTU email
  if (!User.validateHBTUEmail(email)) {
    throw new Error(
      "Only @hbtu.ac.in email addresses are allowed for student registration"
    );
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { rollNo }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already in use");
    }
    if (existingUser.rollNo === rollNo) {
      throw new Error("Roll number already registered");
    }
  }

  const user = new User({
    name,
    email,
    rollNo,
    password,
    phone,
    role: "student", // Only students can self-register
    emailVerified: false, // Require email verification
  });

  await user.save();

  return {
    message: "Registration successful. You can now log in.",
    userId: user._id,
  };
};

// Google OAuth registration/login
exports.googleAuth = async ({ googleId, name, email }) => {
  // Validate HBTU email for students
  if (!User.validateHBTUEmail(email)) {
    throw new Error("Only @hbtu.ac.in email addresses are allowed");
  }

  let user = await User.findOne({
    $or: [{ email }, { googleId }],
  });

  if (!user) {
    // Create new user
    user = new User({
      name,
      email,
      googleId,
      role: "student",
      emailVerified: true, // Google accounts are pre-verified
    });
    await user.save();
  } else if (!user.googleId) {
    // Link existing account with Google
    user.googleId = googleId;
    user.emailVerified = true;
    await user.save();
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    email: user.email,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
      role: user.role,
      fine: user.fine,
      totalTimesRented: user.totalTimesRented,
      totalDurationOfRent: user.totalDurationOfRent,
    },
    token,
  };
};

// Regular login
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (!user.password) {
    throw new Error("Please use Google Sign-In or reset your password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (user.status === "disabled") {
    throw new Error("Account is disabled. Please contact admin.");
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    email: user.email,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
      role: user.role,
      fine: user.fine,
      totalTimesRented: user.totalTimesRented,
      totalDurationOfRent: user.totalDurationOfRent,
      location: user.location,
    },
    token,
  };
};

// Forgot password - Send OTP
exports.forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email address");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = otpExpiry;
  await user.save();

  await sendOTPEmail(email, otp, user.name);

  return {
    message: "OTP sent to your email address",
  };
};

// Verify OTP and reset password
exports.resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;
  await user.save();

  return {
    message: "Password reset successful",
  };
};

// Change password from profile
exports.changePassword = async ({ userId, oldPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.password && !(await user.comparePassword(oldPassword))) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return {
    message: "Password changed successfully",
  };
};

// Update profile
exports.updateProfile = async ({ userId, name, phone, location }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (location) user.location = location;

  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
      phone: user.phone,
      role: user.role,
      fine: user.fine,
      totalTimesRented: user.totalTimesRented,
      totalDurationOfRent: user.totalDurationOfRent,
      location: user.location,
    },
  };
};
