import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

function Register() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitLogin = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedFirstname = firstname.trim();
    const trimmedLastname = lastname.trim();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: trimmedUsername,
        password: trimmedPassword,
        firstName: trimmedFirstname,
        lastName: trimmedLastname,
      });

      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/");
    } catch (err) {
      console.log(err.response?.status, err.response?.data);
    }
  };

  return (
    <div className="container-register">
      <form className="form-register" onSubmit={submitLogin}>
        <p className="title">Registratsiya</p>
        <div className="input-field-register">
          <input
            required
            className="input-register"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <label className="label" htmlFor="input">
            Ismingizni kiriting
          </label>
        </div>
        <div className="input-field-register">
          <input
            required
            className="input-register"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <label className="label" htmlFor="input">
            Familiyangizni kiriting
          </label>
        </div>
        <div className="input-field-register">
          <input
            required
            className="input-register"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="label" htmlFor="input">
            Username kiriting
          </label>
        </div>
        <div className="input-field-register">
          <input
            required
            className="input-register"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="label" htmlFor="input">
            Parolingizni kiriting
          </label>
        </div>
        <div
          style={{ display: "flex", gap: "10px" }}
          className="input-field-register"
        >
          <p>Allaqachon akkauntingiz mavjudmi?</p>
          <a
            style={{ cursor: "pointer", color: "darkblue" }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Kirish
          </a>
        </div>
        <button className="register-btn">Registratsiya qilish</button>
      </form>
    </div>
  );
}

export default Register;
