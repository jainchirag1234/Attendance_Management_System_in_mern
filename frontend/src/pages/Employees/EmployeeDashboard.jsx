/* eslint-disable react-hooks/immutability */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../../components/EmployeePanel/Sidebar";
import Navbar from "../../components/EmployeePanel/Navbar";
import Footer from "../../components/EmployeePanel/Footer";
import "./EmployeeDashboard.css";
const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= Fetch Employee Data =================
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/employee/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEmployeeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  // ================= Logout =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    navigate("/login", { replace: true });
  };

  // ================= Format Date =================
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        <button className="logout-fixed-btn" onClick={handleLogout}>
          Logout
        </button>

        <div className="page">
          <h2>Employee Dashboard</h2>

          {employeeData && (
            <div className="employee-info-container">
              <div className="profile-card">
                <h3>My Profile</h3>

                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{employeeData.name}</span>
                  </div>

                  <div className="info-item">
                    <label>Email:</label>
                    <span>{employeeData.email}</span>
                  </div>

                  <div className="info-item">
                    <label>Position:</label>
                    <span>{employeeData.position || "N/A"}</span>
                  </div>

                  <div className="info-item">
                    <label>Department:</label>
                    <span>{employeeData.department || "N/A"}</span>
                  </div>

                  <div className="info-item">
                    <label>Joining Date:</label>
                    <span>{formatDate(employeeData.joining_date)}</span>
                  </div>

                  <div className="info-item">
                    <label>Status:</label>
                    <span className={`status-badge ${employeeData.status}`}>
                      {employeeData.status}
                    </span>
                  </div>

                  <div className="info-item">
                    <label>Role:</label>
                    <span>{employeeData.role}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
