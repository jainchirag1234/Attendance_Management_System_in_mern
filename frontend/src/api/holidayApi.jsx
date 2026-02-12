import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/users", // matches backend route
});

// GET all holidays
export const getHolidays = async () => {
  try {
    const response = await API.get("/holidays");
    return response.data; // directly return data
  } catch (error) {
    console.error(
      "Error fetching holidays:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// POST new holiday
export const addHoliday = async (data) => {
  try {
    const response = await API.post("/holidays", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding holiday:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// PUT update holiday
export const updateHoliday = async (id, data) => {
  try {
    const response = await API.put(`/holidays/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating holiday with id ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// DELETE holiday
export const deleteHoliday = async (id) => {
  try {
    const response = await API.delete(`/holidays/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting holiday with id ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};
