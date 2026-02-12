import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Get all policies
export const fetchPolicies = () => API.get("/policies");

// Get policy by id (optional, future use)
export const fetchPolicyById = (id) => API.get(`/policies/${id}`);
