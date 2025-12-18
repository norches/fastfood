import React, {useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const submitLogin = async (e) => {
        e.preventDefault();

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", {
                username: trimmedUsername,
                password: trimmedPassword,
            });

            const accessToken = res.data.access_token;
            const refreshToken = res.data.refresh_token;
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            
            console.log("Login successful! Tokens stored.");
            console.log("Access token (first 50 chars):", accessToken.substring(0, 50));
            
            alert("Login successful!");
            navigate("/");
        } catch (err) {
            console.log(err.response?.status, err.response?.data);
            alert("Invalid username or password");
        }
    };

    return (
        <div className="container-login">
            <form className="form-control"  onSubmit={submitLogin}>
                <p className="title">Login</p>
                <div className="input-field">
                    <input
                        required
                        className="input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="label" htmlFor="input">Enter username</label>
                </div>
                <div className="input-field">
                    <input
                        required
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="label" htmlFor="input">Enter Password</label>
                </div>
                <button className="submit-btn">Sign In</button>
            </form>

        </div>
    );
}

export default Login;