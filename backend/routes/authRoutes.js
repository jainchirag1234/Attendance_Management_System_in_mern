const express = require("express");
const router = express.Router();

const {
  adminLogin,
  registerEmployee,
  employeeLogin,
} = require("../controllers/authController");

// ADMIN
router.post("/admin/login", adminLogin);

// EMPLOYEE
router.post("/register", registerEmployee);
router.post("/login", employeeLogin);

module.exports = router;
