import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/leaves", // backend base + leave routes
});

export default API;
