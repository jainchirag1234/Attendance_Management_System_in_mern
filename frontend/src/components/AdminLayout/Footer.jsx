import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="footer-container">
        {/* Left Side */}
        <div className="footer-left">
          <h3>Admin Panel</h3>
          <p>Employee Attendance Management System</p>
        </div>

        {/* Middle Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/employees">Employee List</Link>
            </li>
            <li>
              <Link to="/attendance">Attendance</Link>
            </li>
            <li>
              <Link to="/leavesmanagement">Leave Management</Link>
            </li>
            <li>
              <Link to="/policy">Policy Management</Link>
            </li>
            <li>
              <Link to="/holidays">Holiday List</Link>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          <p>© {new Date().getFullYear()} Admin Panel</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
