const express = require("express");
const router = express.Router();
const {
  getEmployeeLeaves,
  applyLeave,
} = require("../controllers/leaveController");

// 1️⃣ Get all leaves of logged-in employee
router.get("/my-leaves/:employeeId", getEmployeeLeaves);

// 2️⃣ Apply leave
router.post("/apply", applyLeave);

module.exports = router;
