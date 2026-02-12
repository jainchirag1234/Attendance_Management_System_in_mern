const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendanceByMonth,
  getAttendanceByEmployee,
  getAllAttendance,
  getAllAttendanceWithEmployeeDetails,
} = require("../controllers/attendanceSheetController");

/* ================================
   1️⃣ Mark / Update Attendance
   POST: /api/attendance/mark
================================ */
router.post("/attendance/mark", markAttendance);

/* ================================
   2️⃣ Get all attendance (RAW)
   GET: /api/users/attendance
================================ */
router.get("/users/attendance", getAllAttendance);

/* ================================
   3️⃣ Get all attendance WITH employee details
   GET: /api/users/attendance/details
================================ */
router.get("/users/attendance/details", getAllAttendanceWithEmployeeDetails);

/* ================================
   4️⃣ Get all attendance of a specific employee
   GET: /api/users/attendance/:employeeId
================================ */
router.get("/users/attendance/:employeeId", getAttendanceByEmployee);

/* ================================
   5️⃣ Get month-wise attendance
   GET: /api/users/attendance/month/:employeeId/:month/:year
================================ */
router.get("/users/attendance/:employeeId/:month/:year", getAttendanceByMonth);

module.exports = router;
