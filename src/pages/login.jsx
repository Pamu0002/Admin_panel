import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import loginImage from '../assets/images/login.jpg'; // Existing login image
import logoIcon from '../assets/images/logo.png'; // Add your logo icon here

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/dashboard');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                <img src={logoIcon} alt="MediConnect Logo" className="logo-icon" />
                <span className="logo-medi">Medi</span>
                <span className="logo-connect">Connect</span>
            </div>
            <div className="login-content">
                <div className="login-image">
                    <img src={loginImage} alt="Doctors" /> {/* Use the imported image */}
                </div>
                <div className="login-form">
                    <h2>Login</h2>
                    <input type="text" placeholder="Email/Mobile No" />
                    <input type="password" placeholder="Password" />
                    <div className="login-options">
                        <label className="remember-me">
                            Remember me <input type="checkbox" />
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button onClick={handleLogin}>Login</button>
                    <p>
                        Do not have an account? <span onClick={handleSignup}>Sign up</span>
                    </p>
                </div>
            </div>
            <div className="login-footer">
                <span className="footer-icon">&#x2709;</span>
                <span className="footer-icon">&#128222;</span>
            </div>
        </div>
    );
};

export default Login;
