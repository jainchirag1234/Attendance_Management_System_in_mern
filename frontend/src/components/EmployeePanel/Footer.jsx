import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="footer-container">
        {/* Left Side */}
        <div className="footer-left">
          <h3>Employee Panel</h3>
          <p>Employee Attendance Management System</p>
        </div>

        {/* Middle Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/employee/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/EmployeeAttendance">Attendance Sheet</Link>
            </li>
            <li>
              <Link to="/HolidayListReadable">Holiday List</Link>
            </li>
            <li>
              <Link to="/leaves">Leaves</Link>
            </li>
            <li>
              <Link to="/EmployeePoliciesReadable">Policy</Link>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          <p>© {new Date().getFullYear()} Employee Panel</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
