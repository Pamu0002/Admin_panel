import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import '../pages/Doctor.css';

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
          doctorId: doc.data().id || '', // Accessing the manual Doctor Id
          name: doc.data().fullName || '',
          email: doc.data().email || '',
          phone: doc.data().phoneNumber || '',
          specialization: doc.data().specialization || '',
          status: doc.data().status || 'Inactive'
        }));

        console.log("Fetched doctors data:", doctorsData);
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
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'; // Corrected the logic to set new status
      const doctorRef = doc(db, 'Doctors', id);
      await updateDoc(doctorRef, { status: newStatus });
      setDoctors(doctors.map(doctor =>
        doctor.id === id ? { ...doctor, status: newStatus } : doctor
      ));
    } catch (error) {
      console.error("Error updating doctor status: ", error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'Doctors', id));
        setDoctors(doctors.filter(doctor => doctor.id !== id)); // Remove the deleted doctor from state
      } catch (error) {
        console.error("Error deleting doctor: ", error);
      }
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
        <div className="doctor-list-header">
          <h2>Doctor List</h2>
          <div className="filter-container">
            <input type="text" placeholder="Search" className="filter-input" />
          </div>
        </div>
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Doctor Id</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.doctorId}</td> {/* Displaying the manual Doctor Id */}
                <td><Link to={`/doctor/${doctor.id}`}>{doctor.name}</Link></td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.specialization}</td>
                <td>
                  <div className="status-container">
                    <span className={`status-label ${doctor.status === 'Active' ? 'active' : 'inactive'}`}>
                      {doctor.status === 'Active' ? 'Active' : 'Inactive'}
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={doctor.status === 'Active'}
                        onChange={() => toggleStatus(doctor.id, doctor.status)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className={`status-label ${doctor.status === 'Active' ? 'inactive' : 'active'}`}>
                      {doctor.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </span>
                  </div>
                </td>
                <td>
                  {/* New Delete Button */}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    Delete
                  </button>
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
