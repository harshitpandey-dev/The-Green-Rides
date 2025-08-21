require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URLs?.split(",") || []
        : true,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/authRoutes");
const cycleRoutes = require("./routes/cycleRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const userRoutes = require("./routes/userRoutes");
const qrRoutes = require("./routes/qrRoutes");
const financeRoutes = require("./routes/financeRoutes");

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cycles", cycleRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/finance", financeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Green Rides Backend API",
    status: "running",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
