import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users", // Base backend URL
});

export default API;
