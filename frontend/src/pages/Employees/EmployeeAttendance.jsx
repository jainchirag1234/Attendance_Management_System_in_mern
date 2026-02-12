/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/EmployeePanel/Sidebar";
import Navbar from "../../components/EmployeePanel/Navbar";
import Footer from "../../components/EmployeePanel/Footer";
import {
  getAttendanceByEmployee,
  markAttendance,
} from "../../api/attendanceApi";
import "./EmployeeAttendance.css";

const EmployeeAttendance = () => {
  const [employee, setEmployee] = useState(null);
  const [records, setRecords] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [status, setStatus] = useState("Present");
  const [todayStatus, setTodayStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  // console.log(loading);
  // ✅ Load employee from localStorage safely
  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    console.log(storedEmployee);
    if (!storedEmployee) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
      return;
    }
    setEmployee(JSON.parse(storedEmployee));
  }, []);

  const employeeId = employee?.id;

  // 📥 Load attendance
  const loadAttendance = async () => {
    if (!employeeId) return;

    try {
      const res = await getAttendanceByEmployee(employeeId);
      const sheets = res.data || [];
      setRecords(sheets);

      // ✅ Find today's attendance
      const todayStr = new Date().toDateString();
      let found = null;

      sheets.forEach((sheet) => {
        sheet.attendance.forEach((a) => {
          const recordDateStr = new Date(a.date).toDateString();
          if (recordDateStr === todayStr) {
            found = a;
          }
        });
      });

      setTodayAttendance(found);
      if (found) setTodayStatus(found.status);
    } catch (error) {
      console.log("Attendance load error:", error.response?.data || error);
      alert("Unable to fetch attendance");
    }
  };

  useEffect(() => {
    if (employeeId) loadAttendance();
  }, [employeeId]);

  // ✅ Check In
  const handleCheckIn = async () => {
    if (!employeeId) return;
    setLoading(true);

    try {
      await markAttendance({
        employeeId,
        date: new Date().toISOString(),
        status,
        checkIn: new Date().toLocaleTimeString(),
      });
      alert("Checked in successfully");
      await loadAttendance();
    } catch (error) {
      console.log("Check-in error:", error.response?.data || error);
      alert(error.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check Out
  const handleCheckOut = async () => {
    if (!todayAttendance || !employeeId) return;
    setLoading(true);

    try {
      await markAttendance({
        employeeId,
        date: new Date().toISOString(),
        status: todayStatus,
        checkOut: new Date().toLocaleTimeString(),
      });
      alert("Checked out successfully");
      await loadAttendance();
    } catch (error) {
      console.error("Check-out error:", error.response?.data || error);
      alert(error.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />

        <div className="page">
          <h2 className="page-title">My Attendance</h2>

          {/* Check In Section */}
          {!todayAttendance && (
            <div className="check-in-section">
              <div className="check-in-card">
                <h3>Mark Today's Attendance</h3>
                <div className="check-in-form">
                  <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="status-select"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                  <button
                    className="btn-check-in"
                    onClick={handleCheckIn}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Check In"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Check Out Section */}
          {todayAttendance && !todayAttendance.checkOut && (
            <div className="check-out-section">
              <div className="check-out-card">
                <h3>Today's Status: {todayStatus}</h3>
                <p className="check-in-time">
                  Checked In at: <strong>{todayAttendance.checkIn}</strong>
                </p>
                <button
                  className="btn-check-out"
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Check Out"}
                </button>
              </div>
            </div>
          )}

          {/* Attendance Completed */}
          {todayAttendance && todayAttendance.checkOut && (
            <div className="attendance-complete">
              <div className="complete-card">
                <div className="success-icon">✅</div>
                <h3>Attendance Completed for Today</h3>
                <div className="time-details">
                  <p>
                    <span>Check In:</span>{" "}
                    <strong>{todayAttendance.checkIn}</strong>
                  </p>
                  <p>
                    <span>Check Out:</span>{" "}
                    <strong>{todayAttendance.checkOut}</strong>
                  </p>
                  <p>
                    <span>Status:</span> <strong>{todayStatus}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attendance History */}
          <div className="attendance-history">
            <hr className="divider" />
            <h3 className="history-title">Attendance History</h3>

            {records.length === 0 && (
              <p className="no-records">No attendance records found.</p>
            )}

            {records.map((sheet) => (
              <div key={sheet._id} className="attendance-sheet">
                <h4 className="sheet-header">
                  📅 {sheet.month} / {sheet.year}
                </h4>
                <div className="table-container">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.attendance.map((a, i) => (
                        <tr key={i}>
                          <td>{new Date(a.date).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={`status-badge status-${a.status.toLowerCase()}`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td>{a.checkIn || "-"}</td>
                          <td>{a.checkOut || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default EmployeeAttendance;
