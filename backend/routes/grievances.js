
const express = require("express");
const crypto = require("crypto");
const Grievance = require("../models/Grievance");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// STUDENT: Submit a grievance
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { category, subject, description, priority } = req.body;

    const allowedCategories = [
      "Academic",
      "Examination",
      "Infrastructure",
      "Hostel",
      "Fees",
      "Harassment",
      "Other",
    ];

    const allowedPriorities = ["Low", "Medium", "High"];

    if (
      !allowedCategories.includes(category) ||
      !subject?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide a valid category, subject, and description",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    const grievance = await Grievance.create({
      referenceId: `GRV-${crypto.randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`,
      student: req.user.id,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority: priority || "Medium",
    });

    res.status(201).json({
      message: "Grievance submitted successfully",
      grievance,
    });
  } catch (error) {
    console.error("Grievance submission error:", error.message);

    res.status(500).json({
      message: "Could not submit grievance",
    });
  }
});

// STUDENT: View their own grievances
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const grievances = await Grievance.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      count: grievances.length,
      grievances,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch your grievances",
    });
  }
});

// ADMIN: View all grievances
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const grievances = await Grievance.find()
        .populate("student", "name email")
        .sort({ createdAt: -1 });

      res.json({
        count: grievances.length,
        grievances,
      });
    } catch (error) {
      res.status(500).json({
        message: "Could not fetch grievances",
      });
    }
  }
);

// ADMIN: Update grievance status and remarks
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status, adminRemarks } = req.body;

      const allowedStatuses = [
        "Submitted",
        "In Progress",
        "Resolved",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid grievance status",
        });
      }

      const updates = { status };

      if (typeof adminRemarks === "string") {
        updates.adminRemarks = adminRemarks.trim();
      }

      const grievance = await Grievance.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );

      if (!grievance) {
        return res.status(404).json({
          message: "Grievance not found",
        });
      }

      res.json({
        message: "Grievance updated successfully",
        grievance,
      });
    } catch (error) {
      res.status(500).json({
        message: "Could not update grievance",
      });
    }
  }
);

module.exports = router;
