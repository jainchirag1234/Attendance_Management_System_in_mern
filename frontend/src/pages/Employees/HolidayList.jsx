/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getHolidays } from "../../api/holidayApi";
import Sidebar from "../../components/EmployeePanel/Sidebar";
import Navbar from "../../components/EmployeePanel/Navbar";
import Footer from "../../components/EmployeePanel/Footer";
import "./Holiday.css";

const HolidayListReadable = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await getHolidays();
      console.log("Holidays API response:", res); // Debug the API response

      // Check if res is an array directly or if it has a data property
      const holidayData = Array.isArray(res) ? res : res?.data;

      if (Array.isArray(holidayData)) {
        // Sort holidays by date ascending
        const sortedHolidays = holidayData.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        setHolidays(sortedHolidays);
      } else {
        console.error("Holiday data is not an array:", holidayData);
        setHolidays([]);
        setError("Invalid holiday data received from server.");
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setError("Failed to load holidays. Please try again later.");
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />

        <div className="page">
          <h2>Company Holidays</h2>

          {loading ? (
            <p className="info-text">Loading holidays...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : holidays.length === 0 ? (
            <p className="info-text">No holidays available.</p>
          ) : (
            <table className="holiday-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => (
                  <tr key={holiday._id}>
                    <td>
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>{holiday.title}</td>
                    <td>{holiday.description || "—"}</td>
                    <td>
                      {holiday.isPublicHoliday ? "Public Holiday" : "Optional"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HolidayListReadable;
