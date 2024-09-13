import React, { useState, useEffect } from 'react';
import './AddSchedule.css';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const AddSchedule = () => {
    const [doctorId, setDoctorId] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [selectedTimes, setSelectedTimes] = useState([]);

    // Example time slots
    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
        "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];

    const fetchDoctorDetails = async (id) => {
        const db = getFirestore();
        try {
            const docRef = doc(db, 'Doctors', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDoctorName(data.name || '');
                setSpecialization(data.specialization || '');
            } else {
                setDoctorName('');
                setSpecialization('');
                alert('Doctor not found.');
            }
        } catch (error) {
            console.error('Error fetching doctor details: ', error);
            alert('Failed to fetch doctor details.');
        }
    };

    const handleDoctorIdChange = (e) => {
        const id = e.target.value;
        setDoctorId(id);
        if (id) {
            fetchDoctorDetails(id);
        } else {
            setDoctorName('');
            setSpecialization('');
        }
    };

    const handleTimeSelect = (time) => {
        setSelectedTimes(prev => {
            if (prev.includes(time)) {
                return prev.filter(t => t !== time); // Remove time if already selected
            } else if (prev.length < 2) {
                return [...prev, time]; // Add time if less than 2 are selected
            }
            return prev; // Otherwise, keep the list as is
        });
    };

    const handleSchedule = async () => {
        if (selectedTimes.length !== 2) {
            alert('Please select exactly two time slots.');
            return;
        }

        const visitingTime = selectedTimes.join(' - '); // Format as "Start Time - End Time"
        
        try {
            const db = getFirestore();
            await setDoc(doc(db, 'schedule', doctorId), {
                doctorId,
                doctorName,
                specialization,
                appointmentDate,
                visitingTime
            });
            alert('Appointment scheduled successfully!');
        } catch (error) {
            console.error('Error scheduling appointment: ', error);
            alert('Failed to schedule appointment.');
        }
    };

    return (
        <div className="add-schedule-container">
            <h2>Schedule an Appointment</h2>
            <div className="add-schedule-form">
                <div className="form-field">
                    <label htmlFor="doctorId">Doctor ID:</label>
                    <input
                        id="doctorId"
                        type="text"
                        value={doctorId}
                        onChange={handleDoctorIdChange}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="doctorName">Doctor Name:</label>
                    <input
                        id="doctorName"
                        type="text"
                        value={doctorName}
                        readOnly
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="specialization">Specialization:</label>
                    <input
                        id="specialization"
                        type="text"
                        value={specialization}
                        readOnly
                    />
                </div>
                <div className="date-time-section">
                    <div className="form-field">
                        <label htmlFor="appointmentDate">Select Date:</label>
                        <input
                            id="appointmentDate"
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="appointmentTime">Select Time:</label>
                        <div className="time-slots">
                            {timeSlots.map((time, index) => (
                                <button
                                    key={index}
                                    className={`time-slot ${selectedTimes.includes(time) ? 'selected' : ''}`}
                                    onClick={() => handleTimeSelect(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={handleSchedule}>Confirm</button>
            </div>
        </div>
    );
};

export default AddSchedule;
