import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { db } from '../firebase-config'; // Adjust the import path as needed
import { doc, getDoc } from 'firebase/firestore';
import './DoctorDetails.css'; // Import the CSS file
import AdddocImage from '../assets/images/Pabhashini.png'; // Ensure the image path is correct

const DoctorDetails = () => {
  const { doctorId } = useParams(); // Retrieve doctorId from URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const docRef = doc(db, 'Doctors', doctorId); // Reference to Firestore document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data()); // Set doctor data to state
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!doctor) {
    return <div>No doctor found.</div>; // Handle case where doctor is not found
  }

  return (
    <div className="doctor-info-container">
      <div className="doctor-info-header">
        <h2>Doctor Info</h2>
        <p>Dashboard {'>'} Doctor Info</p>
      </div>
      <div className="doctor-info-content">
        <div className="doctor-info-left">
          <img src={AdddocImage} alt="Doctor" className="doctor-image" />
          <h3 className="doctor-name">{doctor.fullName}</h3>
          <p className="doctor-specialization">{doctor.specialization}</p>
          <div className="social-icons">
            {/* Replace # with actual links if available */}
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="doctor-info-right">
          <p><span className="info-label">Doctor Id:</span> {doctorId}</p>
          <p><span className="info-label">Name:</span> {doctor.fullName}</p>
          <p><span className="info-label">Gender:</span> {doctor.gender}</p>
          <p><span className="info-label">Email:</span> {doctor.email}</p>
          <p><span className="info-label">Phone Number:</span> {doctor.phoneNumber}</p>
          <p><span className="info-label">Date of Birth:</span> {doctor.dob}</p>
          <p><span className="info-label">NIC:</span> {doctor.nic}</p>
          <p><span className="info-label">Username:</span> {doctor.UserName}</p>
          <p><span className="info-label">Status:</span> <span className="active-status">{doctor.status}</span></p>
          <p><span className="info-label">Designation:</span> {doctor.designation}</p>
          <p><span className="info-label">Biography:</span> {doctor.biography}</p>
        </div>
      </div>
      <button onClick={handleBack} className="back-button">
        Back
      </button> {/* Back button */}
    </div>
  );
};

export default DoctorDetails;
