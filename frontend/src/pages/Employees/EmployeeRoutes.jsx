const EmployeeRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  return role === "employee" ? children : <Navigate to="/login" />;
};

export default EmployeeRoute;
