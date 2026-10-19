
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const grievanceRoutes = require("./routes/grievances");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);
// Home route
app.get("/", (req, res) => {
  res.send("Student Grievance Redressal Portal API is running!");
});

// Health-check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working correctly",
  });
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect(
  process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/student_grievance_portal"
    )

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();
