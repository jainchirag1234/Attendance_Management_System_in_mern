/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";
import "./Holiday.css";
import Footer from "../../components/AdminLayout/Footer";

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
    isPublicHoliday: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ================= Fetch Holidays =================
  const fetchHolidays = async () => {
    try {
      const res = await API.get("/holidays");
      setHolidays(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // ================= Handle Input =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= Submit Holiday (Add/Update) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/holidays/${editingId}`, formData);
        setEditingId(null);
      } else {
        await API.post("/holidays", formData);
      }
      setFormData({
        date: "",
        title: "",
        description: "",
        isPublicHoliday: true,
      });
      setShowModal(false);
      fetchHolidays();
    } catch (err) {
      console.error(err);
      alert("Holiday already exists or error occurred");
    }
  };

  // ================= Edit Holiday =================
  const handleEdit = (holiday) => {
    setFormData({
      date: new Date(holiday.date).toISOString().split("T")[0],
      title: holiday.title,
      description: holiday.description,
      isPublicHoliday: holiday.isPublicHoliday,
    });
    setEditingId(holiday._id);
    setShowModal(true);
  };

  // ================= Delete Holiday =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        await API.delete(`/holidays/${id}`);
        fetchHolidays();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ================= Open Add Modal =================
  const handleAddNew = () => {
    setFormData({
      date: "",
      title: "",
      description: "",
      isPublicHoliday: true,
    });
    setEditingId(null);
    setShowModal(true);
  };

  // ================= Close Modal =================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      date: "",
      title: "",
      description: "",
      isPublicHoliday: true,
    });
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="page">
          <div className="page-header">
            <h2>Holiday Management</h2>
            <button className="add-holiday-btn" onClick={handleAddNew}>
              + Add Holiday
            </button>
          </div>

          <table className="holiday-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Description</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.length ? (
                holidays.map((h) => (
                  <tr key={h._id}>
                    <td>{new Date(h.date).toLocaleDateString()}</td>
                    <td>{h.title}</td>
                    <td>{h.description || "-"}</td>
                    <td>
                      <span
                        className={`badge ${h.isPublicHoliday ? "public" : "optional"}`}
                      >
                        {h.isPublicHoliday ? "Public" : "Optional"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(h)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(h._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No holidays found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>

      {/* ================= Modal ================= */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Update Holiday" : "Add Holiday"}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form className="holiday-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Holiday Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="isPublicHoliday"
                  id="isPublicHoliday"
                  checked={formData.isPublicHoliday}
                  onChange={handleChange}
                />
                <label htmlFor="isPublicHoliday">Public Holiday</label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingId ? "Update Holiday" : "Add Holiday"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayManagement;
