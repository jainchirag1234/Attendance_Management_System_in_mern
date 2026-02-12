/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import API from "../../api/leaves";
import Sidebar from "../../components/EmployeePanel/Sidebar";
import Navbar from "../../components/EmployeePanel/Navbar";
import Footer from "../../components/EmployeePanel/Footer";
import "./Leaves.css";

const Leaves = () => {
  // Logged-in employee
  const user = JSON.parse(localStorage.getItem("employee"));
  const employeeId = user?.id || "";

  // Get tomorrow's date (YYYY-MM-DD)
  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  // Form state
  const [form, setForm] = useState({
    employeeId,
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // UI states
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If fromDate changes, reset toDate
    if (name === "fromDate") {
      setForm({ ...form, fromDate: value, toDate: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Fetch logged-in employee leaves
  const fetchLeaves = async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/my-leaves/${employeeId}`);

      const sortedLeaves = Array.isArray(res.data)
        ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setLeaves(sortedLeaves);
    } catch (err) {
      console.error(err);
      setError("Failed to load leave records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [refresh]);

  // Submit leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { leaveType, fromDate, toDate, reason } = form;

    if (!leaveType || !fromDate || !toDate || !reason) {
      setError("All fields are required.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError("From Date cannot be after To Date.");
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/apply", form);

      setMessage("Leave applied successfully.");

      // Reset form but keep employeeId
      setForm({
        employeeId,
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setRefresh((prev) => !prev);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply leave.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="page">
          <h2>My Leaves</h2>

          {/* Leave Form */}
          <div className="leave-form">
            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="leaveType"
                placeholder="Leave Type (Sick, Casual)"
                value={form.leaveType}
                onChange={handleChange}
              />

              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                min={getTomorrowDate()} // ✅ only future dates
                onChange={handleChange}
              />

              <input
                type="date"
                name="toDate"
                value={form.toDate}
                min={form.fromDate || getTomorrowDate()} // ✅ >= fromDate
                onChange={handleChange}
              />

              <textarea
                name="reason"
                placeholder="Reason"
                value={form.reason}
                onChange={handleChange}
              />

              <button type="submit" disabled={submitting}>
                {submitting ? "Applying..." : "Apply Leave"}
              </button>
            </form>
          </div>

          {/* Leave List */}
          {loading ? (
            <p>Loading leaves...</p>
          ) : leaves.length === 0 ? (
            <p>No leave records found.</p>
          ) : (
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td className={leave.status?.toLowerCase()}>
                      {leave.status}
                    </td>
                    <td>{leave.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Leaves;
