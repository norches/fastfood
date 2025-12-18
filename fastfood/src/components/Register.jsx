import React, {useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css"

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
            const res = await axios.post("http://localhost:8080/api/auth/register", {
                username: trimmedUsername,
                password: trimmedPassword,
                firstName: trimmedFirstname,
                lastName: trimmedLastname
            });

            const accessToken = res.data.access_token;
            const refreshToken = res.data.refresh_token;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            console.log("Login successful! Tokens stored.");
            console.log("Access token (first 50 chars):", accessToken.substring(0, 50));

            alert("Register successful!");
            navigate("/");
        } catch (err) {
            console.log(err.response?.status, err.response?.data);
            alert("Invalid username or password");
        }
    };

    return (
        <div className="container-register">
            <form className="form-register"  onSubmit={submitLogin}>
                <p className="title">Register</p>
                <div className="input-field-register">
                    <input
                        required
                        className="input-register"
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <label className="label" htmlFor="input">Enter first name</label>
                </div>
                <div className="input-field-register">
                    <input
                        required
                        className="input-register"
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <label className="label" htmlFor="input">Enter last name</label>
                </div>
                <div className="input-field-register">
                    <input
                        required
                        className="input-register"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="label" htmlFor="input">Enter username</label>
                </div>
                <div className="input-field-register">
                    <input
                        required
                        className="input-register"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="label" htmlFor="input">Enter Password</label>
                </div>
                <button className="register-btn">Register</button>
            </form>

        </div>
    );
}

export default Register;