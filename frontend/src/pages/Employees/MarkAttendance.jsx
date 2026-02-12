import React, { useState } from "react";
import { getAttendanceByMonth } from "../api/attendanceApi";

const MonthAttendance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState(null);

  const fetchAttendance = async () => {
    try {
      const res = await getAttendanceByMonth(employeeId, month, year);
      setData(res.data.data);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
      setData(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>View Month Attendance</h2>
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Month (1-12)"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button onClick={fetchAttendance}>Fetch Attendance</button>

      {data && (
        <div>
          <h3>
            Attendance for {month}/{year} | Total Present: {data.totalPresent},
            Absent: {data.totalAbsent}, Leave: {data.totalLeave}
          </h3>
          <table border="1">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {data.attendance.map((a, i) => (
                <tr key={i}>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.status}</td>
                  <td>{a.checkIn}</td>
                  <td>{a.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonthAttendance;
