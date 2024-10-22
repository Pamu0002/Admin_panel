// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './login.css'; // Adjust the path based on your project structure
import loginImage from '../assets/images/1.jpg';
import login from "../assets/images/logo.png";
import { app } from '../firebase-config'; // Import the Firebase app from the config

const Login = () => {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const auth = getAuth(app); // Initialize Firebase Auth using your app

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successful login
        const user = userCredential.user;
        console.log("Logged in user:", user);
        navigate('/dashboard'); // Redirect to the dashboard
      })
      .catch((error) => {
        // Handle errors
        console.error("Login error:", error.code, error.message);
        alert("Invalid email or password. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form">
          <div className="login-image">
            <img src={login} alt="Doctors group" />
          </div>
          <h2 className="login-header">Login</h2>

          <div className="form-group1">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
          </div>

          <div className="form-group1">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <div className="forgot-password">
              Forgot Password?
            </div>
          </div>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
