// AddNewPatient.jsx
import React from 'react';
import './AddNewPatient.css';

const AddNewPatient = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to handle form submission
    alert('Patient added successfully!');
  };

  return (
    <div className="add-new-patient-container">
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit} className="add-patient-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input type="text" id="phone" name="phone" required />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add Patient</button>
      </form>
    </div>
  );
};

export default AddNewPatient;
