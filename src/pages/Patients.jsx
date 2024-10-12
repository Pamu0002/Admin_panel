import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaSave, FaEdit, FaTrash } from 'react-icons/fa';
import '../pages/Patients.css';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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
    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'Patients', id));
        setPatients(patients.filter(patient => patient.referenceNo !== id));
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleEditPatient = (id, patientData) => {
    setEditingPatientId(id);
    setEditableData(patientData); // Populate editable data with the current patient's info
  };

  const handleSavePatient = async (id) => {
    try {
      const patientDoc = doc(db, 'Patients', id);
      await updateDoc(patientDoc, editableData); // Update the patient in Firestore
      setPatients(
        patients.map(patient =>
          patient.referenceNo === id ? { ...patient, ...editableData } : patient
        )
      );
      setEditingPatientId(null); // Exit edit mode
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-container">
      <div className="header">
        <button className="add-patient" onClick={navigateToAddPatient}>+ Add Patient</button>
        <div className="breadcrumb">
          <span>Dashboard</span> {'>'} <span>Patient List</span>
        </div>
      </div>
      <div className="patient-list">
        <div className="list-header">
          <h2>Patients List</h2>
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search by name"
              className="filter-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="patient-table">
          <thead>
            <tr>
              <th>Reference No</th>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>NIC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.referenceNo}>
                <td>{patient.referenceNo}</td>
                <td>
                  {editingPatientId === patient.referenceNo ? (
                    <input
                      type="text"
                      name="name"
                      value={editableData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Link to={`/patient/${patient.referenceNo}`}>{patient.name}</Link>
                  )}
                </td>
                <td>
                  {editingPatientId === patient.referenceNo ? (
                    <input
                      type="text"
                      name="email"
                      value={editableData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    patient.email
                  )}
                </td>
                <td>
                  {editingPatientId === patient.referenceNo ? (
                    <input
                      type="text"
                      name="phone"
                      value={editableData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    patient.phone
                  )}
                </td>
                <td>
                  {editingPatientId === patient.referenceNo ? (
                    <input
                      type="text"
                      name="address"
                      value={editableData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    patient.address
                  )}
                </td>
                <td>
                  {editingPatientId === patient.referenceNo ? (
                    <input
                      type="text"
                      name="nic"
                      value={editableData.nic}
                      onChange={handleInputChange}
                    />
                  ) : (
                    patient.nic
                  )}
                </td>
                <td>
                  {editingPatientId === patient.referenceNo ? (
                    <button
                      className="action-button save"
                      onClick={() => handleSavePatient(patient.referenceNo)}
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <>
                      <button
                        className="action-button edit"
                        onClick={() => handleEditPatient(patient.referenceNo, patient)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDeletePatient(patient.referenceNo)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
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
