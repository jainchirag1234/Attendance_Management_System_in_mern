/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Sidebar from "../../components/AdminLayout/Sidebar";
import Navbar from "../../components/AdminLayout/Navbar";

import "./PolicyManagement.css";
import Footer from "../../components/AdminLayout/Footer";

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ================= Fetch Policies =================
  const fetchPolicies = async () => {
    try {
      const res = await API.get("/policies");
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ================= Handle Input =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= Submit Policy (Add/Update) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/policies/${editingId}`, formData);
        setEditingId(null);
      } else {
        await API.post("/policies", formData);
      }
      setFormData({
        title: "",
        description: "",
      });
      setShowModal(false);
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert("Policy already exists or error occurred");
    }
  };

  // ================= Edit Policy =================
  const handleEdit = (policy) => {
    setFormData({
      title: policy.title,
      description: policy.description,
    });
    setEditingId(policy._id);
    setShowModal(true);
  };

  // ================= Delete Policy =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await API.delete(`/policies/${id}`);
        fetchPolicies();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ================= Open Add Modal =================
  const handleAddNew = () => {
    setFormData({
      title: "",
      description: "",
    });
    setEditingId(null);
    setShowModal(true);
  };

  // ================= Close Modal =================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
    });
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="page">
          <div className="page-header">
            <h2>Policy Management</h2>
            <button className="add-policy-btn" onClick={handleAddNew}>
              + Add Policy
            </button>
          </div>

          <table className="policy-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.length ? (
                policies.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.description}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No policies found</td>
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
              <h3>{editingId ? "Update Policy" : "Add Policy"}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form className="policy-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Policy Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  placeholder="Policy Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
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
                  {editingId ? "Update Policy" : "Add Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
