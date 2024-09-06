import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import '../pages/Doctor.css';
import { Link } from 'react-router-dom';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, 'Doctors');
        const snapshot = await getDocs(doctorsCollection);
        
        const doctorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          doctorId: doc.id,
          name: doc.data().name || '', // Add name field
          email: doc.data().email || '',
          phone: doc.data().phone || '',
          specialization: doc.data().specialization || '',
          status: doc.data().status || 'Inactive'
        }));

        console.log("Fetched doctors data:", doctorsData); // Check fetched data
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = () => {
    navigate('/new-doctor');
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Deactivate' : 'Active';
      const doctorRef = doc(db, 'Doctors', id);
      await updateDoc(doctorRef, { status: newStatus });
      setDoctors(doctors.map(doctor =>
        doctor.id === id ? { ...doctor, status: newStatus } : doctor
      ));
    } catch (error) {
      console.error("Error updating doctor status: ", error);
    }
  };

  return (
    <div className="doctor-container">
      <div className="header">
        <button className="add-doctor" onClick={handleAddDoctor}>+ Add Doctor</button>
        <div className="breadcrumb">
          <span>Dashboard</span> {'>'} <span>Doctor List</span>
        </div>
      </div>
      <div className="doctor-list">
        <h2>Doctor List</h2>
        <div className="filter-container">
          <input type="text" placeholder="Filter" className="filter-input" />
        </div>
        <table className="doctor-table">
          <thead>
            <tr>
              <th>DoctorID</th>
              <th>Name</th> {/* Add Name Column */}
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.doctorId}</td>
                <td>
                <Link to={`/doctor/${doctor.id}`}>{doctor.name}</Link> {/* Dynamic Link */}
              </td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.specialization}</td>
                <td>
                  <div className="status-container">
                    <span className="status-label">{doctor.status === 'Active' ? 'Active' : 'Deactivate'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={doctor.status === 'Active'}
                        onChange={() => toggleStatus(doctor.id, doctor.status)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="status-label">{doctor.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Doctors;
