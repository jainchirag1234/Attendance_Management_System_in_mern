const express = require("express");
const router = express.Router();

/* =========================
   CONTROLLER IMPORTS
========================= */
const {
  // Employee
  getEmployees,
  addEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,

  // Attendance
  markAttendance,
  getAttendance,
  getAttendanceById,

  // Leaves
  getLeaves,
  addLeave,
  statusLeave,

  // Holidays
  getHolidays,
  addHolidays,
  updateHolidays,
  deleteHolidays,

  // Policies
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} = require("../controllers/userController");

/* =========================
   EMPLOYEE ROUTES
========================= */
router.get("/employees", getEmployees);
router.post("/employees", addEmployee);
router.put("/employees/:id", updateEmployee);
router.put("/employees/status/:id", updateEmployeeStatus);
router.delete("/employees/:id", deleteEmployee);

/* =========================
   LEAVE ROUTES
========================= */
router.get("/leaves", getLeaves);
router.post("/leaves", addLeave);
router.put("/leaves/status/:id", statusLeave);

/* =========================
   HOLIDAY ROUTES
========================= */
router.get("/holidays", getHolidays);
router.post("/holidays", addHolidays);
router.put("/holidays/:id", updateHolidays);
router.delete("/holidays/:id", deleteHolidays);

/* =========================
   POLICY ROUTES
========================= */
router.get("/policies", getPolicies);
router.get("/policies/:id", getPolicyById);
router.post("/policies", createPolicy);
router.put("/policies/:id", updatePolicy);
router.delete("/policies/:id", deletePolicy);

module.exports = router;
