/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";
import Footer from "../../components/AdminLayout/Footer";
import "./EmployeeDetails.css";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // ================= Fetch Employee =================
  const fetchEmployee = async () => {
    try {
      const res = await API.get(`/attendance/${employeeId}`);
      setEmployee(res.data);
    } catch (error) {
      console.error(
        "Employee fetch error:",
        error.response?.data || error.message,
      );
    }
  };

  // ================= Fetch Attendance =================
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");

      // Extract the attendance array safely
      const attendanceData = Array.isArray(res.data)
        ? res.data
        : res.data?.data && Array.isArray(res.data.data)
          ? res.data.data
          : [];

      if (!Array.isArray(attendanceData)) {
        console.warn("Attendance data is not an array:", res.data);
      }

      setAttendance(attendanceData);
    } catch (error) {
      console.error(
        "Attendance fetch error:",
        error.response?.data || error.message,
      );
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchAttendance();
  }, [employeeId]);

  // ================= Filtered Attendance =================
  const filteredAttendance = Array.isArray(attendance)
    ? attendance.filter((rec) => {
        const recDate = new Date(rec.date);
        return (
          rec.employee?._id === employeeId &&
          recDate.getMonth() + 1 === Number(selectedMonth) &&
          recDate.getFullYear() === Number(selectedYear)
        );
      })
    : [];

  if (loading || !employee) return <p className="loading">Loading...</p>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="page">
          <h2 className="page-title">Employee Attendance</h2>

          {/* Employee Info */}
          <div className="employee-info-card">
            <h3 className="employee-name">{employee.name}</h3>
            <p className="employee-email">{employee.email}</p>
          </div>

          {/* Filters */}
          <div className="filter-row">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Attendance Table */}
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length ? (
                filteredAttendance.map((rec) => (
                  <tr key={rec._id}>
                    <td>{new Date(rec.date).toLocaleDateString("en-IN")}</td>
                    <td
                      className={
                        rec.status === "Present"
                          ? "status-present"
                          : rec.status === "Absent"
                            ? "status-absent"
                            : "status-leave"
                      }
                    >
                      {rec.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="no-records">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EmployeeDetails;
