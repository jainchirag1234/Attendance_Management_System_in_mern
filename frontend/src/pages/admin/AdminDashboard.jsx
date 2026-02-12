/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";
import API from "../../api/api";
import "./Dashboard.css";
import Footer from "../../components/AdminLayout/Footer";

const Dashboard = () => {
  const navigate = useNavigate();

  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [inactiveEmployees, setInactiveEmployees] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [rejectedLeaves, setRejectedLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState(0);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
    fetchLeaves();
  }, []);

  // ================= Logout =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login", { replace: true }); // ✅ Admin Login
  };

  // ================= Attendance =================
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      const today = new Date().toISOString().split("T")[0];

      const todayAttendance = res.data.filter(
        (a) => a.date.split("T")[0] === today,
      );

      setPresentCount(
        todayAttendance.filter((a) => a.status === "Present").length,
      );

      setAbsentCount(
        todayAttendance.filter((a) => a.status === "Absent").length,
      );
    } catch (error) {
      console.log(error);
      // console.error("Attendance fetch error:", error);
    }
  };

  // ================= Employees =================
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      const employees = res.data;

      setTotalEmployees(employees.length);

      setActiveEmployees(
        employees.filter((emp) => emp.status?.toLowerCase() === "active")
          .length,
      );

      setInactiveEmployees(
        employees.filter((emp) => emp.status?.toLowerCase() === "inactive")
          .length,
      );
    } catch (error) {
      console.error("Employees fetch error:", error);
    }
  };

  // ================= Leaves =================
  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves");
      const leaves = res.data;

      setPendingLeaves(
        leaves.filter((leave) => leave.status === "Pending").length,
      );

      setRejectedLeaves(
        leaves.filter((leave) => leave.status === "Rejected").length,
      );

      setApprovedLeaves(
        leaves.filter((leave) => leave.status === "Approved").length,
      );
    } catch (error) {
      console.error("Leaves fetch error:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />
        <button className="logout-fixed-btn" onClick={handleLogout}>
          Logout
        </button>
        <div className="page">
          <h2>Dashboard</h2>

          <div className="dashboard-grid">
            <div
              className="dashboard-card total"
              onClick={() => navigate("/employees")}
            >
              <h4>Total Employees</h4>
              <p>{totalEmployees}</p>
            </div>

            <div
              className="dashboard-card active"
              onClick={() => navigate("/employees")}
            >
              <h4>Active Employees</h4>
              <p>{activeEmployees}</p>
            </div>

            <div
              className="dashboard-card inactive"
              onClick={() => navigate("/employees")}
            >
              <h4>Inactive Employees</h4>
              <p>{inactiveEmployees}</p>
            </div>

            <div
              className="dashboard-card present"
              onClick={() => navigate("/attendance")}
            >
              <h4>Present Today</h4>
              <p>{presentCount}</p>
            </div>

            <div
              className="dashboard-card absent"
              onClick={() => navigate("/attendance")}
            >
              <h4>Absent Today</h4>
              <p>{absentCount}</p>
            </div>

            <div
              className="dashboard-card pending"
              onClick={() => navigate("/leaves")}
            >
              <h4>Total Pending Leaves</h4>
              <p>{pendingLeaves}</p>
            </div>

            <div
              className="dashboard-card rejected"
              onClick={() => navigate("/leaves")}
            >
              <h4>Total Rejected Leaves</h4>
              <p>{rejectedLeaves}</p>
            </div>

            <div
              className="dashboard-card approved"
              onClick={() => navigate("/leaves")}
            >
              <h4>Total Approved Leaves</h4>
              <p>{approvedLeaves}</p>
            </div>
          </div>
          {/* Fixed Logout Button */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
