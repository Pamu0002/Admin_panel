import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config'; 
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc 
} from 'firebase/firestore'; // Import setDoc and doc
import './AddSchedule.css';

const AddSchedule = () => {
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [doctorNames, setDoctorNames] = useState([]);
    const [selectedDoctorName, setSelectedDoctorName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
        "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
        "05:00 PM"
    ];

    // Fetch all specializations
    useEffect(() => {
        const fetchSpecializations = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'Doctors'));
                const specializationSet = new Set();

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    specializationSet.add(data.specialization);
                });

                setSpecializations([...specializationSet]);
            } catch (err) {
                console.error('Error fetching specializations:', err);
                setError('Failed to load specializations.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecializations();
    }, []);

    // Fetch doctor names based on selected specialization
    useEffect(() => {
        const fetchDoctorNames = async () => {
            if (!selectedSpecialization) {
                setDoctorNames([]);
                return;
            }

            setLoading(true);
            try {
                const q = query(
                    collection(db, 'Doctors'),
                    where('specialization', '==', selectedSpecialization)
                );
                const snapshot = await getDocs(q);

                const doctors = snapshot.docs.map((doc) => ({
                    doctorName: doc.data().doctorName,
                    doctorId: doc.id 
                }));
                setDoctorNames(doctors);
            } catch (err) {
                console.error('Error fetching doctor names:', err);
                setError('Failed to load doctor names.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorNames();
    }, [selectedSpecialization]);

    const handleTimeClick = (time) => {
        if (!startTime) {
            setStartTime(time);
        } else if (!endTime && time > startTime) {
            setEndTime(time);
        } else {
            setStartTime(time);
            setEndTime('');
        }
    };

    const handleConfirm = async () => {
        if (!selectedSpecialization || !selectedDoctorName || !appointmentDate || !startTime || !endTime) {
            alert('Please fill all fields!');
            return;
        }

        const selectedDoctor = doctorNames.find(
            (doctor) => doctor.doctorName === selectedDoctorName
        );

        if (!selectedDoctor) {
            alert('Doctor not found!');
            return;
        }

        const visitingTime = `${startTime} - ${endTime}`;

        try {
            // Use setDoc to ensure the document ID is the doctorId
            const scheduleRef = doc(db, 'schedule', selectedDoctor.doctorId);
            await setDoc(scheduleRef, {
                doctorId: selectedDoctor.doctorId,
                specialization: selectedSpecialization,
                doctorName: selectedDoctorName,
                appointmentDate,
                visitingTime,
                status: 'Active' // Default status
            });

            alert(`Appointment scheduled with Dr. ${selectedDoctorName} on ${appointmentDate} from ${visitingTime}`);

            // Clear form fields
            setSelectedSpecialization('');
            setSelectedDoctorName('');
            setAppointmentDate('');
            setStartTime('');
            setEndTime('');
        } catch (err) {
            console.error('Error scheduling appointment:', err);
            alert('Failed to schedule appointment. Please try again.');
        }
    };

    const isTimeSelected = (time) => {
        return time === startTime || (time > startTime && time <= endTime);
    };

    return (
        <div className="schedule-appointment-container">
            <h2>Schedule an Appointment</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="appointment-form">
                <div className="form-row">
                    <label htmlFor="specialization">Specialization:</label>
                    <select
                        id="specialization"
                        value={selectedSpecialization}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                        <option value="">--Select Specialization--</option>
                        {specializations.map((spec, index) => (
                            <option key={index} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <label htmlFor="doctorName">Doctor Name:</label>
                    <select
                        id="doctorName"
                        value={selectedDoctorName}
                        onChange={(e) => setSelectedDoctorName(e.target.value)}
                    >
                        <option value="">--Select Doctor--</option>
                        {doctorNames.map((doctor, index) => (
                            <option key={index} value={doctor.doctorName}>{doctor.doctorName}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="calendar-section">
                <h3>Select Date:</h3>
                <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                />
            </div>

            <div className="time-section">
                <h3>Select Time Range:</h3>
                <div className="time-slots">
                    {timeSlots.map((time, index) => (
                        <button
                            key={index}
                            className={`time-slot ${isTimeSelected(time) ? 'selected' : ''}`}
                            onClick={() => handleTimeClick(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default AddSchedule;
