import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username: trimmedUsername,
        password: trimmedPassword,
      });

      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const decoded = decodeToken(accessToken);
      console.log("Decoded token:", decoded);

      const roles = decoded?.roles || [];
      const isAdmin = roles.includes("ROLE_ADMIN");

      console.log("Roles:", roles, "Is Admin:", isAdmin);

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("Xatolik:", err.response?.status, err.response?.data);
      setError(
        err.response?.data?.message || "Qayta urinib ko'ring."
      );
    }
  };

  return (
    <div className="container-login">
      <form className="form-control" onSubmit={submitLogin}>
        <p className="title">Kirish</p>
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "10px",
              textAlign: "center",
              padding: "8px",
              backgroundColor: "#ffe6e6",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}
        <div className="input-field">
          <input
            required
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="label" htmlFor="input">
            Username kiriting
          </label>
        </div>
        <div className="input-field">
          <input
            required
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="label" htmlFor="input">
            Parolingizni kiriting
          </label>
        </div>
        <button className="submit-btn">Kirish</button>
      </form>
    </div>
  );
}

export default Login;
