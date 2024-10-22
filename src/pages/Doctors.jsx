import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../pages/Doctors.css"; // Ensure this path is correct
import { FaTrash } from "react-icons/fa";

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "Doctors");
        const snapshot = await getDocs(doctorsCollection);

        const doctorsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          doctorId: doc.data().id || "",
          name: doc.data().doctorName || "",
          email: doc.data().email || "",
          phone: doc.data().phoneNumber || "",
          specialization: doc.data().specialization || "",
          status: doc.data().status || "Unavailable",
        }));

        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = () => {
    navigate("/new-doctor");
  };

  const toggleStatus = async (doctorId, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "Available" ? "Unavailable" : "Available";
      const doctorRef = doc(db, "Doctors", doctorId);
      await updateDoc(doctorRef, { status: newStatus });
      setDoctors(
        doctors.map((doctor) =>
          doctor.doctorId === doctorId
            ? { ...doctor, status: newStatus }
            : doctor
        )
      );
      setFilteredDoctors(
        filteredDoctors.map((doctor) =>
          doctor.doctorId === doctorId
            ? { ...doctor, status: newStatus }
            : doctor
        )
      );
    } catch (error) {
      console.error("Error updating doctor status: ", error);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "Doctors", doctorId));
        setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
        setFilteredDoctors(
          filteredDoctors.filter((doctor) => doctor.doctorId !== doctorId)
        );
      } catch (error) {
        console.error("Error deleting doctor: ", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const searchResult = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDoctors(searchResult);
  };

  return (
    <div className="doctor-container">
      <div className="breadcrumb-Container">
        <div className="breadcrumb">
          <span>Dashboard</span> {">"}
        </div>
        <div className="breadcrumbs">
          <span>Doctor List</span>
        </div>
      </div>
      <div className="header">
        <button className="add-doctor" onClick={handleAddDoctor}>
          + Add Doctor
        </button>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by name"
            className="filter-input"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "300px", height: "auto" }}
          />
        </div>
      </div>
      <div className="doctor-list">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Doctor Id</th>
              <th>Doctor Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.doctorId}</td>
                <td>
                  <Link to={`/doctor/${doctor.id}`}>{doctor.name}</Link>
                </td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.specialization}</td>
                <td>
                  <div className="status-container">
                    <span
                      className={`status-label ${
                        doctor.status === "Available"
                          ? "available"
                          : "unavailable"
                      }`}
                    >
                      {doctor.status}
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={doctor.status === "Available"}
                        onChange={() =>
                          toggleStatus(doctor.doctorId, doctor.status)
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteDoctor(doctor.doctorId)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: '#1ABC9C',
                    }}
                  >
                    <FaTrash style={{ marginRight: "5px" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      <div className="back-button-container1">
        <button className="back-btn1" onClick={handleBackToDashboard}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Doctors;
