import React, { useState } from 'react';
import { db } from '../firebase-config'; // Import Firestore configuration
import { collection, doc, setDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import './AddSchedule.css';

const AddSchedule = () => {
    const [doctorId, setDoctorId] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [date, setdate] = useState('');
    const [visitingTime, setVisitingTime] = useState('');
    const [appointmentNumber, setAppointmentNumber] = useState(''); // New state for Appointment Number
    const [successMessage, setSuccessMessage] = useState('');

    const handleAdd = async () => {
        if (!doctorId || !doctorName || !date || !visitingTime || !appointmentNumber) {
            alert("Please fill in all fields.");
            return;
        }

        // Create a combined document ID using Doctor ID and Appointment Number
        const documentId = `${doctorId}-Appointment${appointmentNumber}`;

        try {
            // Add a new document with the combined ID to the 'schedule' collection
            await setDoc(doc(collection(db, "schedule"), documentId), {
                doctorId,      // Save Doctor ID as a field
                doctorName,
                date,
                visitingTime,
                appointmentNumber, // Save Appointment Number as a field
            });

            // Show success message
            setSuccessMessage("Schedule added successfully!");

            // Clear input fields after adding the schedule
            setDoctorId('');
            setDoctorName('');
            setdate('');
            setVisitingTime('');
            setAppointmentNumber('');

            // Hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error adding schedule: ", error);
        }
    };

    return (
        <div className="add-schedule">
            <h2>Add Time Schedule</h2>
            {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
            <div className="form-group">
                <label>Doctor ID</label> {/* Input field for Doctor ID */}
                <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Doctor Name</label>
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Date</label>
                <input type="text" value={date} onChange={(e) => setdate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Visiting Time</label>
                <input type="text" value={visitingTime} onChange={(e) => setVisitingTime(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Appointment Number</label> {/* New input field for Appointment Number */}
                <input type="text" value={appointmentNumber} onChange={(e) => setAppointmentNumber(e.target.value)} />
            </div>
            <button className="add-btn" onClick={handleAdd}>Add Schedule</button>
        </div>
    );
};

export default AddSchedule;
