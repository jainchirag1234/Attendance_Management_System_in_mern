/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { fetchPolicies } from "../../api/policies";
import Sidebar from "../../components/EmployeePanel/Sidebar";
import Navbar from "../../components/EmployeePanel/Navbar";
import Footer from "../../components/EmployeePanel/Footer";

const EmployeePoliciesReadable = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const res = await fetchPolicies();
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load policies.");
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
          <h2>Company Policies</h2>

          {loading && <p>Loading policies...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && policies.length === 0 && <p>No policies available.</p>}

          {!loading && policies.length > 0 && (
            <div className="policy-list">
              {policies.map((policy) => (
                <div className="policy-card" key={policy._id}>
                  <h3>{policy.title}</h3>
                  <p>{policy.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default EmployeePoliciesReadable;
