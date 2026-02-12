import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/* ===============================
   GET all attendance of a single employee
================================ */
export const getEmployeeAttendance = (employeeId) =>
  axios.get(`${API_BASE_URL}/users/attendance/${employeeId}`);

/* ===============================
   GET attendance of a specific employee (alternate name)
================================ */
export const getAttendanceByEmployee = (employeeId) =>
  axios.get(`${API_BASE_URL}/users/attendance/${employeeId}`);

/* ===============================
   GET month-wise attendance of an employee
================================ */
export const getEmployeeAttendanceByMonth = (employeeId, month, year) => {
  const cleanId = employeeId.trim(); // space hatao

  return axios.get(
    `${API_BASE_URL}/users/attendance/${cleanId}/${month}/${year}`,
  );
};
/* ===============================
   POST / mark attendance
================================ */
export const markAttendance = (attendanceData) =>
  axios.post(`${API_BASE_URL}/attendance/mark`, attendanceData);

/* ===============================
   GET all attendance (admin)
================================ */
export const getAllAttendance = () =>
  axios.get(`${API_BASE_URL}/users/attendance`);
