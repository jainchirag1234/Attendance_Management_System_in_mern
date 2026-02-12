const Attendance = require("../models/attendanceSheet");

/* ================================
   Utility: Calculate totals
================================ */

/* ================================
   1️⃣ Mark or Update Attendance
================================ */
function calculateTotals(attendance) {
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLeave = 0;

  attendance.forEach((record) => {
    if (record.status === "Present") totalPresent++;
    else if (record.status === "Absent") totalAbsent++;
    else if (record.status === "Leave") totalLeave++;
    // Add more statuses here if needed
  });

  return { totalPresent, totalAbsent, totalLeave };
}

// ================================
// Controller: Mark or Update Attendance
// ================================
const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut } = req.body;

    // 1️⃣ Validate required fields
    if (!employeeId || !date || !status) {
      return res.status(400).json({
        message: "employeeId, date and status are required",
      });
    }

    // 2️⃣ Normalize date to midnight (avoid timezone duplicates)
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const month = attendanceDate.getMonth() + 1;
    const year = attendanceDate.getFullYear();

    // 3️⃣ Find or create monthly attendance sheet
    let sheet = await Attendance.findOne({ employeeId, month, year });

    if (!sheet) {
      sheet = new Attendance({
        employeeId,
        month,
        year,
        attendance: [],
        totalPresent: 0,
        totalAbsent: 0,
        totalLeave: 0,
      });
    }

    // 4️⃣ Check if attendance already exists for the day
    const existing = sheet.attendance.find(
      (a) =>
        new Date(a.date).toISOString().slice(0, 10) ===
        attendanceDate.toISOString().slice(0, 10),
    );

    // 5️⃣ Update or insert attendance
    if (existing) {
      if (checkIn) existing.checkIn = checkIn;
      if (checkOut) existing.checkOut = checkOut;
      existing.status = status;
    } else {
      sheet.attendance.push({
        date: attendanceDate,
        status,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
      });
    }

    // 6️⃣ Recalculate totals
    const totals = calculateTotals(sheet.attendance);
    sheet.totalPresent = totals.totalPresent;
    sheet.totalAbsent = totals.totalAbsent;
    sheet.totalLeave = totals.totalLeave;

    // 7️⃣ Save sheet
    await sheet.save();

    res.status(200).json({
      message: "Attendance saved successfully",
      sheet,
    });
  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/* ================================
   2️⃣ Get all attendance (RAW)
================================ */
const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   3️⃣ Get all attendance WITH employee details
================================ */
const getAllAttendanceWithEmployeeDetails = async (req, res) => {
  try {
    const data = await Attendance.find().populate({
      path: "employeeId",
      select:
        "name email role position department joining_date status createdAt",
    });

    const result = data.map((item) => ({
      _id: item._id,
      month: item.month,
      year: item.year,
      attendance: item.attendance,
      totalPresent: item.totalPresent,
      totalAbsent: item.totalAbsent,
      totalLeave: item.totalLeave,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      employeeDetails: item.employeeId,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   4️⃣ Get attendance of a specific employee
================================ */
const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const records = await Attendance.find({ employeeId });

    res.status(200).json(records); // empty array bhi valid response
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance records",
      error: error.message,
    });
  }
};

/* ================================
   5️⃣ Get month-wise attendance
================================ */
const getAttendanceByMonth = async (req, res) => {
  try {
    let { employeeId, month, year } = req.params;

    // safety trim
    employeeId = employeeId?.trim();

    if (!employeeId) {
      return res.status(400).json({ message: "Invalid employeeId" });
    }

    const record = await Attendance.findOne({
      employeeId,
      month: Number(month),
      year: Number(year),
    });

    if (!record) {
      return res.status(404).json({
        message: "No records for this month",
      });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Month wise error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  getAttendanceByMonth,
  getAllAttendanceWithEmployeeDetails,
};
