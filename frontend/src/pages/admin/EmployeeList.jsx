/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import API from "../../api/api";

import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";
import Footer from "../../components/AdminLayout/Footer";

import "./Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [showModal, setShowModal] = useState(false);

  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "IT",
    "Customer Support",
    "Legal",
    "Product",
    "Other",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    joining_date: "",
    password: "",
    phone: "",
    salary: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterDepartment) params.department = filterDepartment;

      const res = await API.get("/employees", { params });

      const formatted = res.data.map((emp) => ({
        ...emp,
        isActive: emp.status === "active",
      }));

      setEmployees(formatted);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, filterDepartment]);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.joining_date) {
      newErrors.joining_date = "Joining date is required";
    }

    if (!editId && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!editId && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (formData.salary && formData.salary < 0) {
      newErrors.salary = "Salary cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      joining_date: formData.joining_date,
      status: formData.isActive ? "active" : "inactive",
      phone: formData.phone || undefined,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
    };

    try {
      setLoading(true);

      if (editId) {
        await API.put(`/employees/${editId}`, payload);
        setSuccess("Employee updated successfully!");
      } else {
        await API.post("/employees", {
          ...payload,
          password: formData.password,
        });
        setSuccess("Employee added successfully!");
      }

      handleCloseModal();
      fetchEmployees();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Operation failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ================= OPEN ADD MODAL ================= */
  const handleAddNew = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      joining_date: "",
      password: "",
      phone: "",
      salary: "",
      isActive: true,
    });
    setEditId(null);
    setError("");
    setSuccess("");
    setErrors({});
    setShowModal(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (emp) => {
    setEditId(emp._id);
    setError("");
    setSuccess("");
    setErrors({});

    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      joining_date: emp.joining_date?.slice(0, 10),
      password: "",
      phone: emp.phone || "",
      salary: emp.salary || "",
      isActive: emp.status === "active",
    });

    setShowModal(true);
  };

  /* ================= CLOSE MODAL ================= */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setError("");
    setSuccess("");
    setErrors({});

    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      joining_date: "",
      password: "",
      phone: "",
      salary: "",
      isActive: true,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      setLoading(true);
      await API.delete(`/employees/${id}`);
      setSuccess("Employee deleted successfully!");
      fetchEmployees();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (id, currentStatus) => {
    try {
      // Optimistic update
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, isActive: !currentStatus } : emp,
        ),
      );

      await API.put(`/employees/status/${id}`, {
        isActive: !currentStatus,
      });

      setSuccess("Status updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchEmployees();
      setError("Status update failed");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="page">
          <div className="page-header">
            <h2>Employee Management</h2>
            <button className="add-employee-btn" onClick={handleAddNew}>
              + Add Employee
            </button>
          </div>

          {/* ===== MESSAGES ===== */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* ===== FILTERS ===== */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* ===== TABLE ===== */}
          {loading && <div className="loading">Loading...</div>}

          {!loading && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Phone</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.length ? (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>{emp.phone || "N/A"}</td>
                      <td>{new Date(emp.joining_date).toLocaleDateString()}</td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={emp.isActive}
                            onChange={() => toggleStatus(emp._id, emp.isActive)}
                          />
                          <span className="slider round"></span>
                        </label>

                        <span
                          style={{
                            marginLeft: "8px",
                            color: emp.isActive ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {emp.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(emp._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <Footer />
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Update Employee" : "Add Employee"}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form className="employee-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? "error" : ""}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="error-text">{errors.department}</span>
                )}
              </div>

              <div className="form-group">
                <label>Position *</label>
                <input
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleChange}
                  className={errors.position ? "error" : ""}
                />
                {errors.position && (
                  <span className="error-text">{errors.position}</span>
                )}
              </div>

              <div className="form-group">
                <label>Joining Date *</label>
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  className={errors.joining_date ? "error" : ""}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.joining_date && (
                  <span className="error-text">{errors.joining_date}</span>
                )}
              </div>

              {!editId && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary (Optional)"
                  value={formData.salary}
                  onChange={handleChange}
                  className={errors.salary ? "error" : ""}
                  min="0"
                  step="0.01"
                />
                {errors.salary && (
                  <span className="error-text">{errors.salary}</span>
                )}
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActive">Active Status</label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editId
                      ? "Update Employee"
                      : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
