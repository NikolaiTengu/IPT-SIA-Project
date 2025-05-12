import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Button from '@mui/material/Button';
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLoginBtn() {
    // Basic validation
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 8 || password.length > 12) {
      setErrorMessage("Password must be 8-12 characters long.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/login", { email, password });
      if (response.data.success) {
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="loginPage">
      <div className="ring">
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="login">
        <h1>Login</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          className="inputText"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="inputText"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="actionButtons">
          <Button variant="contained" onClick={handleLoginBtn}>Signin</Button>
          <Button variant="contained" onClick={handleLoginBtn}>Signup</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;