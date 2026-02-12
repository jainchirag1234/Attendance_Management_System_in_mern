import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/admin/login",
        {
          email: form.email,
          password: form.password,
        },
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));

        setMsg("Login successful ✅");
      } else {
        setMsg(res.data.message || "Login failed ❌");
      }
    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || "Something went wrong ❌");
    }
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
}

export default Login;
