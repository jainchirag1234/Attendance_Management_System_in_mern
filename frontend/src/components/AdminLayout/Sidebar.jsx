import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "250px",
        background: "#1e293b",
        color: "#fff",

        minHeight: "80vh",
        padding: "30px",
        borderRadius: "5px",
        // marginTop: "100px",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Admin Panel</h3>

      <nav style={{ marginTop: "10px" }}>
        <p style={{ margin: "10px 0" }}>
          <Link
            to="/dashboard"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Dashboard
          </Link>
        </p>
        <p style={{ margin: "10px 0" }}>
          <Link
            to="/employees"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Employee List
          </Link>
        </p>
        <p style={{ margin: "10px 0" }}>
          <Link
            to="/attendance"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Attendance
          </Link>
        </p>
        <p style={{ margin: "10px 0" }}>
          <Link
            to="/leavesmanagement"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Leave Management
          </Link>
        </p>
        <p style={{ margin: "10px 0" }}>
          <Link to="/policy" style={{ color: "#fff", textDecoration: "none" }}>
            Policy Management
          </Link>
        </p>
        <p style={{ margin: "10px 0" }}>
          <Link
            to="/holidays"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Holiday List
          </Link>
        </p>
      </nav>
    </div>
  );
};

export default Sidebar;
