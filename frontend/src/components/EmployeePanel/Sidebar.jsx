import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "250px",
        background: "linear-gradient(180deg, #ff6b6b, #feca57, #1dd1a1",
        color: "#fff",
        minHeight: "80vh",
        padding: "30px",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "15px", color: "#110f0f" }}>Employee Panel</h3>

      <nav style={{ marginTop: "10px" }}>
        <p>
          <Link to="/employee/dashboard" style={linkStyle}>
            Dashboard
          </Link>
        </p>
        <p>
          <Link to="/EmployeeAttendance" style={linkStyle}>
            Attendance Sheet
          </Link>
        </p>
        <p>
          <Link to="/HolidayListReadable" style={linkStyle}>
            Holiday List
          </Link>
        </p>
        <p>
          <Link to="/leaves" style={linkStyle}>
            Leaves
          </Link>
        </p>
        <p>
          <Link to="/EmployeePoliciesReadable" style={linkStyle}>
            Policy
          </Link>
        </p>
      </nav>
    </div>
  );
};

const linkStyle = {
  color: "#000000",
  textDecoration: "none",
  fontWeight: "500",
};

export default Sidebar;
