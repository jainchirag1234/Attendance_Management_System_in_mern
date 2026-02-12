import React, { useState } from "react";
import API from "../api/api";

const AttendanceForm = () => {
  const [form, setForm] = useState({
    employeeId: "",
    date: "",
    status: "Present",
    checkIn: "",
    checkOut: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/attendance/mark", form);
      alert(res.data.message);
      setForm({
        employeeId: "",
        date: "",
        status: "Present",
        checkIn: "",
        checkOut: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="card">
      <h2>Mark Attendance</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option>Present</option>
          <option>Absent</option>
          <option>Leave</option>
          <option>Half Day</option>
        </select>

        <input
          type="time"
          name="checkIn"
          value={form.checkIn}
          onChange={handleChange}
        />

        <input
          type="time"
          name="checkOut"
          value={form.checkOut}
          onChange={handleChange}
        />

        <button type="submit">Save Attendance</button>
      </form>
    </div>
  );
};

export default AttendanceForm;
