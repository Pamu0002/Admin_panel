import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';
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
  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
    setEditableData(patientData);
  };

  const handleSavePatient = async (id) => {
    try {
      const patientDoc = doc(db, 'Patients', id);
      await updateDoc(patientDoc, editableData);
      setPatients(
        patients.map(patient =>
          patient.referenceNo === id ? { ...patient, ...editableData } : patient
        )
      );
      setEditingPatientId(null);
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
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addOrUpdatePatient = async (patientData) => {
    const existingPatient = patients.find(patient => patient.email === patientData.email);
    
    if (existingPatient) {
      // Update existing patient
      const patientDoc = doc(db, 'Patients', existingPatient.referenceNo);
      await updateDoc(patientDoc, patientData);
      setPatients(patients.map(patient => 
        patient.referenceNo === existingPatient.referenceNo ? { ...patient, ...patientData } : patient
      ));
    } else {
      // Add new patient
      try {
        const newPatientRef = await addDoc(collection(db, 'Patients'), patientData);
        setPatients([...patients, { referenceNo: newPatientRef.id, ...patientData }]);
      } catch (error) {
        console.error('Error adding new patient:', error);
      }
    }
  };

  // Function to add patient from Appointments collection
  const addPatientFromAppointment = async (appointmentData) => {
    const patientData = {
      name: appointmentData.name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      address: appointmentData.address,
      nic: appointmentData.nic,
    };

    // Use the same method as before to add a new patient
    await addOrUpdatePatient(patientData);
  };

  return (
    <div className="patient-container">
      <div className="breadcrumb-Container">
        <div className="breadcrumb">
        <span>Dashboard</span> {'>'}
        <div className="breadcrumbs">
          <span>Patient List</span>
        </div>
        </div>
    </div>
       
      <div className="header">
        <button className="add-patient" onClick={navigateToAddPatient}>+ Add Patient</button>
         <div className="filter-container">
            <input
              type="text"
              placeholder="Search by name"
              className="filter-input"
              style={{ width: "300px", height: "auto" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
       
      </div>
      <div className="patient-list">
       
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
                      value={editableData.name || ''}
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
                      value={editableData.email || ''}
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
                      value={editableData.phone || ''}
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
                      value={editableData.address || ''}
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
                      value={editableData.nic || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    patient.nic
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  
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
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color:'#1ABC9C',
                        }} /* Aligns icon and text */
                        onClick={() => handleEditPatient(patient.referenceNo, patient)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDeletePatient(patient.referenceNo)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                           color:'#1ABC9C',
                        }} /* Aligns icon and text */
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
      <div className="back-button-container2">
            <button className="back-btn2" onClick={handleBackToDashboard}>
              Back
            </button>
          </div>
    </div>
    
    
  );
};

export default Patients;
