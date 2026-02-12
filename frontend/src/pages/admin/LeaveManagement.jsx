/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";
import Footer from "../../components/AdminLayout/Footer";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Reject Modal State
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves");
      setLeaves(res.data);
    } catch (error) {
      console.log(error);

      alert("Failed to fetch leaves");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);

      alert("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      return alert("To Date cannot be earlier than From Date");
    }

    const selectedEmployee = employees.find(
      (emp) => emp._id === formData.employeeId,
    );

    if (!selectedEmployee) return alert("Select valid employee");

    const payload = {
      ...formData,
      employeeName: selectedEmployee.name,
    };

    try {
      setLoading(true);
      await API.post("/leaves/add", payload);
      setFormData({
        employeeId: "",
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
      fetchLeaves();
    } catch (error) {
      console.log(error);

      alert("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */
  const approveLeave = async (id) => {
    try {
      setLoading(true);
      await API.put(`/leaves/status/${id}`, { status: "Approved" });
      fetchLeaves();
    } catch (error) {
      console.log(error);

      alert("Failed to approve leave");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setRejectReason("");
    setShowModal(true);
  };

  const rejectLeave = async () => {
    if (!rejectReason.trim()) return alert("Enter reject reason");

    try {
      setLoading(true);
      await API.put(`/leaves/status/${selectedLeaveId}`, {
        status: "Rejected",
        rejectReason,
      });
      setShowModal(false);
      setSelectedLeaveId(null);
      fetchLeaves();
    } catch (error) {
      console.log(error);

      alert("Failed to reject leave");
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
          <h2>Leave Management</h2>

          {/* ================= FORM ================= */}
          <form className="leave-form" onSubmit={handleSubmit}>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
            >
              <option value="">Leave Type</option>
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Paid">Paid</option>
            </select>

            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-add" disabled={loading}>
              Apply Leave
            </button>
          </form>

          {/* ================= TABLE ================= */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Reject Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty">
                      No leave requests found
                    </td>
                  </tr>
                )}

                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td>{l.employeeName}</td>
                    <td>{l.leaveType}</td>
                    <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(l.toDate).toLocaleDateString()}</td>
                    <td>{l.reason}</td>
                    <td className={`status ${l.status.toLowerCase()}`}>
                      {l.status}
                    </td>
                    <td>{l.status === "Rejected" ? l.rejectReason : "-"}</td>
                    <td>
                      {l.status === "Pending" && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => approveLeave(l._id)}
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => openRejectModal(l._id)}
                            disabled={loading}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Footer />
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Reject Leave</h3>
            <input
              type="text"
              placeholder="Reject reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-reject" onClick={rejectLeave}>
                Reject
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
