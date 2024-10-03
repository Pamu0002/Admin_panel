import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import './Patients.css';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);

  const navigateToAddPatient = () => {
    navigate('/addnewpatient');
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientCollection = collection(db, 'Patients');
        const patientSnapshot = await getDocs(patientCollection);
        const patientList = patientSnapshot.docs.map(doc => ({
          referenceNo: doc.id,
          ...doc.data(),
        }));
        setPatients(patientList);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleDeletePatient = async (id) => {
    try {
      await deleteDoc(doc(db, 'Patients', id));
      setPatients(patients.filter(patient => patient.referenceNo !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <div className="container">
      <div className="patient-header">
        <button className="add-patient-button" onClick={navigateToAddPatient}>
          Add Patients +
        </button>
        <h2>Patients list</h2>
      </div>
      <div className="table-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Reference No</th> {/* Updated Header */}
            <th>Name</th> {/* Updated Header */}
            <th>Email</th> {/* Updated Header */}
            <th>Phone Number</th> {/* Updated Header */}
            <th>Address</th> {/* Updated Header */}
            <th>NIC</th> {/* New Header for NIC */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.referenceNo}>
              <td>{patient.referenceNo}</td> {/* Reference No */}
              <td>{patient.name}</td> {/* Name */}
              <td>{patient.email}</td> {/* Email */}
              <td>{patient.phone}</td> {/* Phone Number */}
              <td>{patient.address}</td> {/* Address */}
              <td>{patient.nic}</td> {/* NIC */}
              <td>
                <Link to={`/patient/${patient.referenceNo}`}>
                  
                </Link>
                <button className="action-button delete" onClick={() => handleDeletePatient(patient.referenceNo)}>
                  <FaTrash />
                </button>
                <button className="action-button edit">
                  <FaEdit />
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

export default Patients;
