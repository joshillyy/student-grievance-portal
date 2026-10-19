
const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Academic",
        "Examination",
        "Infrastructure",
        "Hostel",
        "Fees",
        "Harassment",
        "Other",
      ],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Submitted",
    },
    adminRemarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Grievance",
  grievanceSchema
);
