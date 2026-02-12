import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ================= Admin Pages =================
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeList from "./pages/admin/EmployeeList";
import Attendance from "./pages/admin/Attendance";
import LeaveManagement from "./pages/admin/LeaveManagement";
import HolidayManagement from "./pages/admin/Holiday";
import PolicyManagement from "./pages/admin/PolicyManagement";

// ================= Employee Pages =================
import Register from "./pages/Employees/Register";
import Login from "./pages/Employees/Login";
import EmployeeDashboard from "./pages/Employees/EmployeeDashboard";
import EmployeeAttendance from "./pages/Employees/EmployeeAttendance";
import HolidayList from "./pages/Employees/HolidayList";
import Leaves from "./pages/Employees/Leaves";
import EmployeePolicies from "./pages/Employees/EmployeePoliciesReadable";
import EmployeeDetails from "./pages/admin/EmployeeDetails";

const App = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />

      {/* Employees */}
      <Route path="/employees" element={<EmployeeList />} />

      {/* 🔥 ATTENDANCE ROUTES */}
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/attendance/:employeeId" element={<EmployeeDetails />} />

      <Route path="/leavesmanagement" element={<LeaveManagement />} />
      <Route path="/policy" element={<PolicyManagement />} />
      <Route path="/holidays" element={<HolidayManagement />} />

      {/* Employee Side */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/EmployeeAttendance" element={<EmployeeAttendance />} />
      <Route path="/HolidayListReadable" element={<HolidayList />} />
      <Route path="/leaves" element={<Leaves />} />
      <Route path="/EmployeePoliciesReadable" element={<EmployeePolicies />} />
    </Routes>
  );
};

export default App;
