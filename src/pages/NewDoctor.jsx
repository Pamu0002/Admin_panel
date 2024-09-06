import React, { useState } from 'react';
import { db } from '../firebase-config'; // Correct import path
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions
import './NewDoctor.css';

const NewDoctor = () => {
  const [doctor, setDoctor] = useState({
    doctorId: '',
    id: '', // This is used as the document ID
    name: '',
    nic: '',
    email: '',
    phone: '',
    slmcNumber: '',
    specialization: '',
    experience: '',
    qualifications: '',
    hospital: '',
    fees: '', // New field for Doctor Fees
    photoUrl: '' // To save the uploaded photo URL
  });

  const [image, setImage] = useState(null); // State to manage the selected image file
  const [message, setMessage] = useState({
    text: '',
    type: '' // 'success' or 'error'
  });

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      // Handle file input separately
      setImage(e.target.files[0]);
    } else {
      setDoctor({ ...doctor, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor.id) {
      setMessage({
        text: 'Doctor ID is required.',
        type: 'error'
      });
      return;
    }

    try {
      let photoUrl = ''; // Initialize photo URL
      
      if (image) {
        const storage = getStorage(); // Initialize Firebase Storage
        const storageRef = ref(storage, `doctors/${doctor.id}`); // Create a storage reference
        await uploadBytes(storageRef, image); // Upload file
        photoUrl = await getDownloadURL(storageRef); // Get the download URL
      }

      // Save to Firestore with document name as Doctor ID in the 'Doctors' collection
      await setDoc(doc(db, 'Doctors', doctor.id), {
        doctorId: doctor.id, // Doctor ID saved as a field
        name: doctor.name,
        nic: doctor.nic,
        email: doctor.email,
        phone: doctor.phone,
        slmcNumber: doctor.slmcNumber,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualifications: doctor.qualifications,
        hospital: doctor.hospital,
        fees: doctor.fees, // Include the new Doctor Fees field
        photoUrl: photoUrl // Save the image URL in Firestore
      });

      setMessage({
        text: 'Doctor added successfully!',
        type: 'success'
      });

      // Reset form
      setDoctor({
        doctorId: '',
        id: '',
        name: '',
        nic: '',
        email: '',
        phone: '',
        slmcNumber: '',
        specialization: '',
        experience: '',
        qualifications: '',
        hospital: '',
        fees: '', // Reset Doctor Fees field
        photoUrl: '' // Reset photo URL field
      });
      setImage(null); // Reset image file state

    } catch (error) {
      console.error('Error adding doctor: ', error);
      setMessage({
        text: 'Error adding doctor. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="new-doctor-container">
      <h2>Register a Doctor</h2>
      <form className="doctor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group-half">
            <label>Doctor ID</label>
            <input
              type="text"
              name="id" // Use this field for both document ID and field
              value={doctor.id}
              onChange={handleChange}
              placeholder="Enter Doctor ID"
              required
            />
          </div>
          <div className="form-group-half">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={doctor.name}
              onChange={handleChange}
              placeholder="Enter doctor's full name"
              required
            />
          </div>
          <div className="form-group-half">
            <label>NIC</label>
            <input
              type="text"
              name="nic"
              value={doctor.nic}
              onChange={handleChange}
              placeholder="Enter NIC"
              required
            />
          </div>
          <div className="form-group-half">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={doctor.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group-half">
            <label>Phone No</label>
            <input
              type="tel"
              name="phone"
              value={doctor.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group-half">
            <label>Doctor Fees</label>
            <input
              type="text"
              name="fees"
              value={doctor.fees}
              onChange={handleChange}
              placeholder="Enter Doctor Fees"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Professional Information</h3>
          <div className="form-group-half">
            <label>SLMC Number</label>
            <input
              type="text"
              name="slmcNumber"
              value={doctor.slmcNumber}
              onChange={handleChange}
              placeholder="Enter SLMC number"
              required
            />
          </div>
          <div className="form-group-half">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={doctor.specialization}
              onChange={handleChange}
              placeholder="Enter specialization"
              required
            />
          </div>
          <div className="form-group-half">
            <label>Years of Experience</label>
            <input
              type="text"
              name="experience"
              value={doctor.experience}
              onChange={handleChange}
              placeholder="Enter years of experience"
              required
            />
          </div>
          <div className="form-group">
            <label>Qualifications</label>
            <textarea
              name="qualifications"
              value={doctor.qualifications}
              onChange={handleChange}
              placeholder="Enter qualifications"
              required
            />
          </div>
          <div className="form-group">
            <label>Hospital/Clinical Affiliations</label>
            <input
              type="text"
              name="hospital"
              value={doctor.hospital}
              onChange={handleChange}
              placeholder="Enter hospital/clinical affiliations"
              required
            />
          </div>
          <div className="form-group">
            <label>Upload a Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default NewDoctor;
