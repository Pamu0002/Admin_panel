import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './login.css'; // Import your CSS file for styling
import loginImage from '../assets/images/login-image.png'; // Import the image from the assets/image folder

const Login = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here (e.g., validation or Firebase auth)
    navigate('/dashboard'); // Redirect to the Dashboard after login
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={loginImage} alt="Login" className="login-image"/>
      </div>
      <div className="login-right">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="username1">User Name</label>
          <input type="text" id="username1" name="username1" placeholder="User Name" />

          <label htmlFor="username2">Password</label>
          <input type="text" id="Password" name="Password" placeholder="Password" />

          <a href="/forgot-password" className="forgot-password">Forget Password?</a>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
