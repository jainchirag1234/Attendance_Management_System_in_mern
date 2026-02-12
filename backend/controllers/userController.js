const User = require("../models/User");

const bcrypt = require("bcryptjs");

const Leave = require("../models/Leave");
const Holiday = require("../models/Holiday");
const Policy = require("../models/Policy");
/* ======================================================
   EMPLOYEE
====================================================== */

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add employee
exports.addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      position,
      department,
      joining_date,
      status,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email and Password are required",
      });
    }

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔐 Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = new User({
      name,
      email,
      password: hashedPassword, // 👈 encrypted password
      role: "employee",
      position,
      department,
      joining_date,
      status: status || "active",
    });

    await employee.save();

    // Do NOT send password back
    res.status(201).json({
      message: "Employee added successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        position: employee.position,
        department: employee.department,
        joining_date: employee.joining_date,
        status: employee.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update employee details
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEmployee = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle employee status (ACTIVE / INACTIVE)
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.status = employee.status === "active" ? "inactive" : "active";
    await employee.save();

    res.status(200).json({
      message: `Employee status updated to ${employee.status}`,
      status: employee.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   LEAVE
====================================================== */

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(leaves);
  } catch (err) {
    console.error("Get Leaves Error:", err);
    res.status(500).json({
      message: "Failed to fetch leaves",
    });
  }
};

exports.addLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    // 🔒 Basic validation
    if (!employeeId || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Fetch employee name
    const employee = await User.findById(employeeId).select("name");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leave = new Leave({
      employeeId,
      employeeName: employee.name, // store name in leave
      leaveType,
      fromDate,
      toDate,
      reason,
      status: "Pending", // default
    });

    await leave.save();

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    console.error("Add Leave Error:", err);
    res.status(500).json({ message: "Failed to apply leave" });
  }
};
exports.statusLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectReason } = req.body;

    // ✅ Allowed statuses
    const allowedStatus = ["Approved", "Rejected"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'Approved' or 'Rejected'",
      });
    }

    // 🔍 Find the leave by ID
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // ⛔ Prevent updating already processed leave
    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: `Leave is already ${leave.status}`,
      });
    }

    // 🧠 Prepare update object
    const updateData = { status };

    if (status === "Rejected") {
      // ❌ Require reason for rejection
      if (!rejectReason || rejectReason.trim() === "") {
        return res
          .status(400)
          .json({ message: "Reject reason is required for rejection" });
      }
      updateData.rejectReason = rejectReason; // Save reason
      updateData.approvedAt = null; // Clear approved date
    }

    if (status === "Approved") {
      updateData.rejectReason = ""; // Clear reject reason
      updateData.approvedAt = new Date(); // Save approval date
    }

    // 💾 Update leave in DB
    const updatedLeave = await Leave.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      message:
        status === "Approved"
          ? "Leave approved successfully"
          : "Leave rejected successfully",
      leave: updatedLeave,
    });
  } catch (err) {
    console.error("Update Leave Status Error:", err);
    res.status(500).json({ message: "Failed to update leave status" });
  }
};

/* ======================================================
   HOLIDAYS
====================================================== */

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json(holidays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addHolidays = async (req, res) => {
  try {
    const holiday = new Holiday(req.body);
    await holiday.save();
    res.status(201).json({
      message: "Holiday added successfully",
      holiday,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.updateHolidays = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json({
      message: "Holiday updated successfully",
      holiday,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.deleteHolidays = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByIdAndDelete(id);
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json({ message: "Holiday deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Get Policy By ID =================
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Create Policy =================
exports.createPolicy = async (req, res) => {
  try {
    const policy = new Policy(req.body);
    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= Update Policy =================
exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.json(policy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.json({ message: "Policy deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
