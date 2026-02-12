import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ employeeName = "RA" }) => {
  // employeeName as prop
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // First letter of employee name
  const userInitial = employeeName.charAt(0).toUpperCase();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <img
            src="/logo2.png"
            alt="Company Logo"
            style={{
              height: "100px",
              width: "100px",
              objectFit: "contain",
              borderRadius: "5px",
              backgroundColor: "#fff",
              padding: "5px",
              marginRight: "15px",
              cursor: "pointer",
            }}
          />
        </Link>

        <h1>Attendance System</h1>

        {isAdmin && (
          <Link
            to="/admin"
            style={{
              color: "#fff",
              textDecoration: "none",
              marginLeft: "15px",
            }}
          >
            Employee Dashboard
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* User Initial Circle */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title={employeeName}
        >
          {userInitial}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
