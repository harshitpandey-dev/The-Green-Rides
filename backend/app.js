require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Placeholder for JWT middleware
const jwtMiddleware = require("./middleware/auth");
app.use(jwtMiddleware);

const authRoutes = require("./routes/authRoutes");
const cycleRoutes = require("./routes/cycleRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cycles", cycleRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/users", userRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Green Rides Backend API");
});

// TODO: Add auth, user, cycle, rental routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
