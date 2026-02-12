const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      // 🔹 link to employee
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employeeName: {
      // 🔹 store name at the time of leave
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: {
      type: String,
    },
    rejectReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Leave", leaveSchema);
