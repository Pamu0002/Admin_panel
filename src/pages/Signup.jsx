import React from 'react';
import './signup.css'; // Importing the CSS file for styling

const Signup = () => {
    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form>
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
