import React, { useState } from "react";
import {
  getEmployeeAttendance,
  getEmployeeAttendanceByMonth,
  getAllAttendance,
} from "../../api/attendanceApi";

import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";
import Footer from "../../components/AdminLayout/Footer";

import "./Attendance.css";

const Attendance = () => {
  /* ========================
     STATE
  ======================== */
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ========================
     MONTH & YEAR OPTIONS
  ======================== */
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i);
  }

  /* ========================
     GET MONTH NAME
  ======================== */
  const getMonthName = (monthNum) => {
    const m = months.find((x) => x.value === Number(monthNum));
    return m ? m.label : monthNum;
  };

  /* ========================
     GET EMPLOYEE (ALL MONTHS)
  ======================== */
  const handleGetAttendance = async () => {
    if (!employeeId) {
      setMessage("Please enter Employee ID");
      return;
    }

    setLoading(true);
    setMessage("");
    setRecords([]);

    try {
      const res = await getEmployeeAttendance(employeeId);

      if (!res.data || res.data.length === 0) {
        setMessage("Employee not found");
      } else {
        setRecords(res.data);
      }
    } catch (error) {
      console.log(error);
      // setMessage("Employee not found");
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     GET MONTH WISE ATTENDANCE
  ======================== */
  const handleGetByMonth = async () => {
    if (!employeeId || !month || !year) {
      setMessage("Please select Employee ID, Month and Year");
      return;
    }

    setLoading(true);
    setMessage("");
    setRecords([]);

    try {
      const res = await getEmployeeAttendanceByMonth(employeeId, month, year);

      if (!res.data) {
        setMessage("No attendance found for this month");
      } else {
        setRecords([res.data]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("No attendance found for this month");
      } else {
        setMessage("Employee not found");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     GET ALL ATTENDANCE
  ======================== */
  const handleGetAllAttendance = async () => {
    setLoading(true);
    setMessage("");
    setRecords([]);

    try {
      const res = await getAllAttendance();
      setRecords(res.data || []);
    } catch (error) {
      console.log(error);
      // setMessage("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     CLEAR FILTERS
  ======================== */
  const handleClearFilters = () => {
    setEmployeeId("");
    setMonth("");
    setYear("");
    setRecords([]);
    setMessage("");
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="page">
          <h2>Admin Attendance Panel</h2>

          {/* FILTER CARD */}
          <div className="card">
            <h3>View Attendance</h3>

            <div className="filter-row">
              <input
                type="text"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />

              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="btn-group">
              <button onClick={handleGetAttendance} className="btn btn-success">
                Get Employee Records
              </button>

              <button onClick={handleGetByMonth} className="btn btn-info">
                Get Month Wise
              </button>

              <button
                onClick={handleGetAllAttendance}
                className="btn btn-primary"
              >
                Get All Attendance
              </button>

              <button
                onClick={handleClearFilters}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* RESULT */}
          <div className="card">
            <h3>Attendance Records</h3>

            {loading && <p className="info">Loading...</p>}

            {!loading && message && <p className="error-message">{message}</p>}

            {!loading &&
              records.map((sheet) => (
                <div key={sheet._id} className="sheet-box">
                  <h4 className="attendance-header">
                    Employee: <b>{sheet.name}</b> | ID:{" "}
                    <b>{sheet.employeeId}</b> | {getMonthName(sheet.month)}{" "}
                    {sheet.year}
                    <br />
                    Present:{" "}
                    <span className="text-success">{sheet.totalPresent}</span> |
                    Absent:{" "}
                    <span className="text-danger">{sheet.totalAbsent}</span> |
                    Leave:{" "}
                    <span className="text-warning">{sheet.totalLeave}</span>
                  </h4>

                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.attendance?.length > 0 ? (
                        sheet.attendance.map((a, i) => {
                          const d = new Date(a.date);
                          return (
                            <tr key={i}>
                              <td>{d.toLocaleDateString()}</td>
                              <td>
                                {d.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </td>
                              <td>{a.status}</td>
                              <td>{a.checkIn || "-"}</td>
                              <td>{a.checkOut || "-"}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" align="center">
                            No attendance data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Attendance;
