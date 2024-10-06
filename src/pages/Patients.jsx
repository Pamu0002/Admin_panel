import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './Patients.css';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

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

  // Filter patients based on the search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="patient-header">
        <button className="add-patient-button" onClick={navigateToAddPatient}>
          Add Patients +
        </button>
        <h2>Patients List</h2>
        {/* Add search box */}
        <input
          className="search-box"
          type="text"
          placeholder="Search Patient by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Reference No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>NIC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.referenceNo}>
                <td>{patient.referenceNo}</td>
                {/* Link the patient name to the detail page */}
                <td>
                  <Link to={`/patient/${patient.referenceNo}`} className="clickable">
                    {patient.name}
                  </Link>
                </td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.address}</td>
                <td>{patient.nic}</td>
                <td>
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
