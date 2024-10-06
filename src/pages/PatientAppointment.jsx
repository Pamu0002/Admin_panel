import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../firebase-config'; // Ensure this path is correct
import './PatientAppointment.css';

function PatientAppointment() {
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [formData, setFormData] = useState({
        doctorName: '',
        patientName: '',
        email: '',
        phoneNumber: '',
        nic: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch specializations from Firebase
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                setLoading(true);
                const snapshot = await getDocs(collection(db, 'Doctors'));
                const specialties = [...new Set(snapshot.docs.map(doc => doc.data().specialization))];
                setSpecializations(specialties);
            } catch (err) {
                setError('Error fetching specializations');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecializations();
    }, []);

    // Fetch doctors based on the selected specialization
    useEffect(() => {
        const fetchDoctors = async () => {
            if (selectedSpecialization) {
                try {
                    setLoading(true);
                    const q = query(collection(db, 'Doctors'), where('specialization', '==', selectedSpecialization));
                    const snapshot = await getDocs(q);
                    const doctorsData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().fullName // Make sure the doctor name is stored as `fullName` in Firestore
                    }));
                    setDoctors(doctorsData);
                } catch (err) {
                    setError('Error fetching doctors');
                } finally {
                    setLoading(false);
                }
            } else {
                setDoctors([]);
            }
        };

        fetchDoctors();
    }, [selectedSpecialization]);

    // Fetch available time slots based on the doctor's name and date
    useEffect(() => {
        const fetchAvailableTimeSlots = async () => {
            if (formData.doctorName && selectedDate) {
                const q = query(collection(db, 'Doctors'), where('fullName', '==', formData.doctorName));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const doctorId = snapshot.docs[0].id;
                    const docRef = doc(db, 'schedule', doctorId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const visitingTimes = docSnap.data().visitingTime || [];

                        const selectedDateObject = new Date(selectedDate);
                        const filteredSlots = visitingTimes.filter(time => {
                            const slotDate = new Date(time);
                            return slotDate.toDateString() === selectedDateObject.toDateString() && slotDate > new Date();
                        });

                        const adjustedSlots = filteredSlots.map(time => {
                            const slot = new Date(time);
                            slot.setMinutes(slot.getMinutes() - 15);
                            return slot.toISOString().slice(0, 16);
                        });

                        const formattedSlots = adjustedSlots.map(slot => {
                            const date = new Date(slot);
                            return date.toLocaleString();
                        });

                        setAvailableTimeSlots(formattedSlots);
                    } else {
                        setAvailableTimeSlots([]);
                    }
                } else {
                    setAvailableTimeSlots([]);
                }
            } else {
                setAvailableTimeSlots([]);
            }
        };

        fetchAvailableTimeSlots();
    }, [formData.doctorName, selectedDate]);

    const handleSpecializationChange = (e) => {
        setSelectedSpecialization(e.target.value);
    };

    const handleDoctorChange = (e) => {
        setFormData(prevState => ({ ...prevState, doctorName: e.target.value }));
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeSlotClick = (slot) => {
        setSelectedTimeSlot(slot);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const appointmentId = `appointment${Date.now()}`;
            await setDoc(doc(db, 'appointments', appointmentId), {
                ...formData,
                timeSlot: selectedTimeSlot,
                id: appointmentId
            });

            await sendConfirmationEmail(formData.email, appointmentId, selectedTimeSlot);

            setSuccess('Appointment successfully added!');
            setFormData({
                doctorName: '',
                patientName: '',
                email: '',
                phoneNumber: '',
                nic: ''
            });
            setSelectedTimeSlot('');
            setSelectedDate('');
            setSelectedSpecialization('');
            setDoctors([]);
            setAvailableTimeSlots([]);
        } catch (error) {
            setError('Error adding appointment');
            console.error("Error adding appointment: ", error);
        } finally {
            setLoading(false);
        }
    };

    const sendConfirmationEmail = async (email, appointmentId, timeSlot) => {
        console.log(`Sending email to ${email} with appointment ID ${appointmentId} and time slot ${timeSlot}`);
    };

    return (
        <div className="appointment-container">
            <header className="header">
                <h3>Add Appointment <span className="add-icon">+</span></h3>
            </header>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {loading && <p>Loading...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <label>
                        Specialization:
                        <select onChange={handleSpecializationChange} value={selectedSpecialization}>
                            <option value="">Select Specialization</option>
                            {specializations.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Doctor Name:
                        <select name="doctorName" onChange={handleDoctorChange} value={formData.doctorName}>
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Appointment Date:
                        <input type="date" value={selectedDate} onChange={handleDateChange} />
                    </label>
                    <div className="time-slot-container">
                        <label>Available Time Slots:</label>
                        <ul>
                            {availableTimeSlots.length > 0 ? (
                                availableTimeSlots.map((slot, index) => (
                                    <li key={index}>
                                        <button 
                                            className={`time-slot-button ${selectedTimeSlot === slot ? 'selected' : ''}`}
                                            onClick={() => handleTimeSlotClick(slot)}
                                        >
                                            {slot}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p>No available time slots for the selected date.</p>
                            )}
                        </ul>
                    </div>

                    <label>
                        Patient Name:
                        <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                    </label>
                    <label>
                        Phone Number:
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                    </label>
                    <label>
                        NIC:
                        <input type="text" name="nic" value={formData.nic} onChange={handleInputChange} />
                    </label>
                    <button type="submit" disabled={loading}>Confirm</button>
                </form>
            </div>
        </div>
    );
}

export default PatientAppointment;
