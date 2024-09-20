import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config'; // Adjust the import path as needed
import { doc, getDoc } from 'firebase/firestore';
import './DoctorDetails.css'; // Import the CSS file

const DoctorDetails = () => {
  const { doctorId } = useParams(); // Retrieve doctorId from URL
  const [doctor, setDoctor] = useState(null);

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
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  if (!doctor) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="doctor-info-container">
      <div className="doctor-info-header">
        <h2>Doctor Info</h2>
        <p>Dashboard {'>'} Doctor Info</p>
      </div>
      <div className="doctor-info-content">
        <div className="doctor-info-left">
          <img src={doctor.photoUrl} alt={doctor.fullName} className="doctor-photo" />
          <h3 className="doctor-name">{doctor.fullName}</h3>
          <p className="doctor-department">{doctor.department}</p>
          <div className="social-icons">
            {/* Replace # with actual links if available */}
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="doctor-info-right">
          <p><span className="info-label">Name:</span> {doctor.fullName}</p>
          <p><span className="info-label">Address:</span> {doctor.address}</p>
          <p><span className="info-label">Email:</span> {doctor.email}</p>
          <p><span className="info-label">Phone:</span> {doctor.phoneNumber}</p>
          <p><span className="info-label">Gender:</span> {doctor.gender}</p>
          <p><span className="info-label">Biography:</span> {doctor.biography}</p>
          <p><span className="info-label">Date of Birth:</span> {doctor.dob}</p>
          <p><span className="info-label">Department:</span> {doctor.department}</p>
          <p><span className="info-label">Specialist:</span> {doctor.specialization}</p>
          <p><span className="info-label">Blood Group:</span> {doctor.bloodGroup}</p>
          <p><span className="info-label">Designation:</span> {doctor.designation}</p>
          <p><span className="info-label">Status:</span> <span className="active-status">{doctor.status}</span></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
