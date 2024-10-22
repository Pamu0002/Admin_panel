import React, { useState, useEffect } from 'react';
import './AddMedicine.css'; // CSS file for AddMedicine styling
import AddmediImage from '../assets/images/Addmedicine.png';
import { db } from '../firebase-config'; // Import your Firebase config
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AddMedicine() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [medicineId, setMedicineId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  // Function to generate the next medicine ID
  const generateMedicineId = async () => {
    const medicineCollection = collection(db, 'Medicine');
    const medicineSnapshot = await getDocs(medicineCollection);
    const medicineCount = medicineSnapshot.size; // Count existing medicines

    // Generate the medicine ID based on count
    const nextId = medicineCount + 1; // Start from 1
    const newId = `MED-${nextId.toString().padStart(2, '0')}`; // Format as MED-01, MED-02, etc.
    setMedicineId(newId); // Set the generated ID
  };

  useEffect(() => {
    // Call generateMedicineId when the component mounts
    generateMedicineId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare medicine data to save
      const medicineData = {
        medicineName,
        brandName,
        medicineType,
        price,
      };

      // Create a document in Firestore with the medicineId as the document name
      await setDoc(doc(db, 'Medicine', medicineId), medicineData);

      setMessage('Medicine added successfully!');

      // Reset form fields after submission
      setMedicineName('');
      setBrandName('');
      setMedicineType('');
      setPrice('');

      // Navigate to the medicine table page
      navigate('/medicine'); // Replace '/medicine' with the correct path to your medicine table

    } catch (error) {
      console.error('Error adding medicine:', error);
      setMessage('Failed to add medicine. Please check the console for details.');
    }
  };

  return (
    <div className="add-medicine-container">
      <h2 className="page-title">Add Medicine</h2>
      <div className="add-medicine-content">
        <form className="add-medicine-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Medicine Id:</label>
            <input
              type="text"
              value={medicineId}
              readOnly // Make the medicine ID read-only
              placeholder="Generated Medicine Id"
            />
          </div>
          <div className="form-group">
            <label>Medicine Name:</label>
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Enter Medicine Name"
              required
            />
          </div>
          <div className="form-group">
            <label>Brand Name:</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter Brand Name"
              required
            />
          </div>
          <div className="form-group">
            <label>Medicine Type:</label>
            <input
              type="text"
              value={medicineType}
              onChange={(e) => setMedicineType(e.target.value)}
              placeholder="Enter Medicine Type"
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
              required
            />
          </div>
          <button className="submit-btn" type="submit">Add</button>
        </form>

        {message && <div className="message">{message}</div>}

        <div className="image-container">
          <img src={AddmediImage} alt="Add Medicine" className="Addmedicine"/>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;
