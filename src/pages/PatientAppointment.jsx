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

    useEffect(() => {
        // Fetch all specializations
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

    useEffect(() => {
        // Fetch doctors based on selected specialization
        const fetchDoctors = async () => {
            if (selectedSpecialization) {
                try {
                    setLoading(true);
                    const q = query(collection(db, 'Doctors'), where('specialization', '==', selectedSpecialization));
                    const snapshot = await getDocs(q);
                    const doctorsData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
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

    useEffect(() => {
        // Fetch available time slots based on selected doctor's name and date
        const fetchAvailableTimeSlots = async () => {
            if (formData.doctorName && selectedDate) {
                // Find doctor ID by name
                const q = query(collection(db, 'Doctors'), where('name', '==', formData.doctorName));
                const snapshot = await getDocs(q);
    
                if (!snapshot.empty) {
                    const doctorId = snapshot.docs[0].id;
                    const docRef = doc(db, 'schedule', doctorId);
                    const docSnap = await getDoc(docRef);
    
                    if (docSnap.exists()) {
                        const visitingTimes = docSnap.data().visitingTime || [];
    
                        // Ensure visitingTimes is an array
                        if (!Array.isArray(visitingTimes)) {
                            console.error("visitingTime is not an array:", visitingTimes);
                            setAvailableTimeSlots([]);
                            return;
                        }
    
                        console.log('Fetched visiting times:', visitingTimes);
    
                        // Convert selectedDate to Date object for comparison
                        const selectedDateObject = new Date(selectedDate);
                        const filteredSlots = visitingTimes.filter(time => {
                            const slotDate = new Date(time);
                            return (
                                slotDate.toDateString() === selectedDateObject.toDateString() &&
                                slotDate > new Date()
                            );
                        });
    
                        console.log('Filtered time slots:', filteredSlots);
    
                        // Reduce time slots by 15 minutes
                        const adjustedSlots = filteredSlots.map(time => {
                            const slot = new Date(time);
                            slot.setMinutes(slot.getMinutes() - 15);
                            return slot.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
                        });
    
                        // Format slots for display
                        const formattedSlots = adjustedSlots.map(slot => {
                            const date = new Date(slot);
                            return date.toLocaleString(); // Convert to a readable format
                        });
    
                        console.log('Formatted time slots:', formattedSlots);
    
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
            // Generate a unique ID for the new appointment
            const appointmentId = `appointment${Date.now()}`;

            // Save the data to Firestore with the generated ID
            await setDoc(doc(db, 'appointments', appointmentId), {
                ...formData,
                timeSlot: selectedTimeSlot,
                id: appointmentId
            });

            // Send email (assuming you have an email sending function set up)
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
        // Implement your email sending logic here
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
