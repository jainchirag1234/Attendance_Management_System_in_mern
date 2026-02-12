const mongoose = require("mongoose");

const dailyAttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Half Day"],
      required: true,
    },
    checkIn: String,
    checkOut: String,
  },
  { _id: false },
);

const attendanceSheetSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    attendance: [dailyAttendanceSchema],

    totalPresent: {
      type: Number,
      default: 0,
    },

    totalAbsent: {
      type: Number,
      default: 0,
    },

    totalLeave: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AttendanceSheet", attendanceSheetSchema);
