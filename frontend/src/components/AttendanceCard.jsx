// src/components/AttendanceCard.jsx
import React from "react";

const AttendanceCard = ({ date, status }) => {
  const color = status === "Present" ? "green" : "red";

  return (
    <div
      style={{
        border: `2px solid ${color}`,
        padding: "10px",
        margin: "10px",
        borderRadius: "8px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <h4>{new Date(date).toLocaleDateString()}</h4>
      <p style={{ color, fontWeight: "bold" }}>{status}</p>
    </div>
  );
};

export default AttendanceCard;
