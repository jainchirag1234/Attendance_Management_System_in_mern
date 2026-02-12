import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeDetails from "./EmployeeDetails";
import "./EmployeeCardGrid.css";

const EmployeeCardGrid = ({
  employees = [],
  attendance = [],
  selectedMonth,
  selectedYear,
}) => {
  const navigate = useNavigate();
  const { employeeId } = useParams(); // URL se employeeId

  const handleCardClick = (empId, isActive) => {
    if (!isActive) return;
    navigate(`/attendance/${empId}`);
  };

  return (
    <div className="employee-grid">
      {employees.length === 0 && <p className="no-data">No employees found</p>}

      {employees.map((emp) => (
        <div
          key={emp._id}
          className={`employee-card ${
            !emp.isActive ? "inactive" : ""
          } ${employeeId === emp._id ? "selected" : ""}`}
          onClick={() => handleCardClick(emp._id, emp.isActive)}
        >
          {/* Avatar */}
          <div className="avatar">
            {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
          </div>

          {/* Basic Info */}
          <h4>{emp.name}</h4>
          <p>{emp.designation || "Employee"}</p>

          {/* Status */}
          <span className={emp.isActive ? "active" : "inactive-text"}>
            {emp.isActive ? "Active" : "Inactive"}
          </span>

          {/* Attendance Details (Only when URL ID matches) */}
          {employeeId === emp._id && (
            <EmployeeDetails
              employee={emp}
              attendance={attendance}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployeeCardGrid;
