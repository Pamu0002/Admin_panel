import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config'; // Ensure the correct Firebase config path
import { doc, getDoc } from 'firebase/firestore';
import './DoctorDetails.css'; // Ensure the correct CSS file path
import AdddocImage from '../assets/images/Pabhashini.png'; // Ensure the correct image path

const DoctorDetails = () => {
  const { doctorId } = useParams(); // Retrieve doctorId from URL parameters
  const [doctor, setDoctor] = useState(null); // State to store the doctor's details
  const [loading, setLoading] = useState(true); // State for loading indication
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetch doctor details from Firebase Firestore
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const docRef = doc(db, 'Doctors', doctorId); // Firestore reference to doctor document
        const docSnap = await getDoc(docRef); // Fetch the document from Firestore

        if (docSnap.exists()) {
          setDoctor(docSnap.data()); // Set the fetched doctor data to state
        } else {
          console.log('No such document!'); // Log if the document doesn't exist
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error); // Log any errors
      } finally {
        setLoading(false); // Stop the loading state after data is fetched
      }
    };

    fetchDoctorDetails(); // Call the function to fetch doctor details
  }, [doctorId]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Display a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no doctor is found, display an appropriate message
  if (!doctor) {
    return <div>No doctor found.</div>;
  }

  // Render the doctor's details
  return (
    <div className="doctor-info-container">
      <div className="doctor-info-header">
        <h2>Doctor Info</h2>
        <p>Dashboard {'>'} Doctor Info</p>
      </div>
      <div className="doctor-info-content">
        <div className="doctor-info-left">
          <img src={AdddocImage} alt="Doctor" className="doctor-image" />
          <h3 className="doctor-name">{doctor.doctorName }</h3> {/* Doctor's full name */}
          <p className="doctor-specialization">{doctor.specialization || 'Specialization not available'}</p>
          <div className="social-icons">
            {/* Replace # with actual social media links */}
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="doctor-info-right">
          <p><span className="info-label">Doctor Id:</span> {doctorId}</p>
          <p><span className="info-label">Doctor Name:</span> {doctor.doctorName}</p> {/* Displaying the doctor's name */}
          <p><span className="info-label">Gender:</span> {doctor.gender}</p>
          <p><span className="info-label">Email:</span> {doctor.email}</p>
          <p><span className="info-label">Phone Number:</span> {doctor.phoneNumber}</p>
          <p><span className="info-label">Date of Birth:</span> {doctor.dob}</p>
          <p><span className="info-label">NIC:</span> {doctor.nic}</p>
          <p><span className="info-label">Username:</span> {doctor.UserName}</p>
          <p><span className="info-label">Password:</span> {doctor.password}</p> {/* Display the password */}
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
