const Leave = require("../models/Leave");
const User = require("../models/User");

// Get leaves of a specific employee
exports.getEmployeeLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const leaves = await Leave.find({ employeeId }).sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (err) {
    console.error("Get Employee Leaves Error:", err);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

// Employee applies for leave
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    // 1️⃣ Validate input
    if (!employeeId || !leaveType || !fromDate || !toDate || !reason) {
      // return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Fetch employee
    const employee = await User.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 3️⃣ Create leave
    const leave = new Leave({
      employeeId: employee._id,
      employeeName: employee.name,
      leaveType,
      fromDate,
      toDate,
      reason,
      status: "Pending",
    });

    await leave.save();

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    console.error("Apply Leave Error:", err);
    res.status(500).json({ message: "Failed to apply leave" });
  }
};
