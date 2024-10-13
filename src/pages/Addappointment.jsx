import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import './Addappointment.css';

const Addappointment = () => {
  const [formData, setFormData] = useState({
    specialization: '',
    doctorName: '',
    nic: '',
    patientName: '',
    phone: '',
    appointmentDate: '',
    visitingTime: '',
    email: '',
    gender: '',
    bloodGroup: '',
    address: '',
  });

  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoadingSpecializations(true);
      try {
        const q = query(collection(db, 'Doctors'));
        const querySnapshot = await getDocs(q);

        const specializationsSet = new Set();
        querySnapshot.forEach((doc) => {
          specializationsSet.add(doc.data().specialization);
        });

        setSpecializations([...specializationsSet]);
      } catch (error) {
        console.error('Error fetching specializations: ', error);
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'specialization') {
      setFormData((prev) => ({ ...prev, doctorName: '', appointmentDate: '', visitingTime: '' }));
      fetchDoctors(value);
      setAppointmentDates([]); // Clear appointment dates when specialization changes
      setTimeSlots([]); // Clear time slots when specialization changes
    }

    if (name === 'doctorName') {
      setFormData((prev) => ({ ...prev, appointmentDate: '', visitingTime: '' }));
      fetchAppointmentDates(value); // Fetch appointment dates when a doctor is selected
    }

    if (name === 'appointmentDate') {
      fetchVisitingTimes(formData.doctorName, value); // Fetch visiting times when an appointment date is selected
    }
  };

  const fetchDoctors = async (specialization) => {
    if (!specialization) {
      setDoctors([]);
      return;
    }

    setLoadingDoctors(true);
    try {
      const q = query(collection(db, 'Doctors'), where('specialization', '==', specialization));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setDoctors([]);
      } else {
        const doctorsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          doctorName: doc.data().doctorName,
        }));
        setDoctors(doctorsList);
      }
    } catch (error) {
      console.error('Error fetching doctors: ', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchAppointmentDates = async (doctorName) => {
    if (!doctorName) {
      setAppointmentDates([]);
      return;
    }

    setLoadingDates(true);
    try {
      const doctorDoc = doctors.find((doctor) => doctor.doctorName === doctorName);
      if (doctorDoc) {
        const q = query(collection(db, 'schedule'), where('doctorId', '==', doctorDoc.id));
        const querySnapshot = await getDocs(q);

        const datesSet = new Set();
        querySnapshot.forEach((doc) => {
          datesSet.add(doc.data().appointmentDate);
        });

        // Check if datesSet is empty and set to an empty array
        if (datesSet.size === 0) {
          setAppointmentDates([]); // No dates available for the selected doctor
        } else {
          setAppointmentDates([...datesSet]); // Convert Set to Array
        }
      }
    } catch (error) {
      console.error('Error fetching appointment dates: ', error);
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchVisitingTimes = async (doctorName, appointmentDate) => {
    if (!doctorName || !appointmentDate) {
      setTimeSlots([]);
      return;
    }

    setLoadingTimes(true);
    try {
      const doctorDoc = doctors.find((doctor) => doctor.doctorName === doctorName);
      if (doctorDoc) {
        const q = query(collection(db, 'schedule'), where('doctorId', '==', doctorDoc.id), where('appointmentDate', '==', appointmentDate));
        const querySnapshot = await getDocs(q);

        const timeSlotsList = [];
        querySnapshot.forEach((doc) => {
          timeSlotsList.push(doc.data().visitingTime);
        });

        setTimeSlots(timeSlotsList);
      }
    } catch (error) {
      console.error('Error fetching visiting times: ', error);
    } finally {
      setLoadingTimes(false);
    }
  };

  const generateAppointmentNumber = () => {
    return 'APPT-' + new Date().getTime();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const appointmentNumber = generateAppointmentNumber();
      const appointmentData = {
        appointmentNumber,
        specialization: formData.specialization,
        doctorName: formData.doctorName,
        nic: formData.nic,
        patientName: formData.patientName,
        phone: formData.phone,
        appointmentDate: formData.appointmentDate,
        visitingTime: formData.visitingTime,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
      };

      if (formData.email) {
        appointmentData.email = formData.email;
      }

      await setDoc(doc(db, 'Appointments', appointmentNumber), appointmentData);
      alert('Appointment successfully added!');

      setFormData({
        specialization: '',
        doctorName: '',
        nic: '',
        patientName: '',
        phone: '',
        appointmentDate: '',
        visitingTime: '',
        email: '',
        gender: '',
        bloodGroup: '',
        address: '',
      });
      setDoctors([]);
      setAppointmentDates([]);
      setTimeSlots([]);
    } catch (error) {
      console.error('Error adding appointment: ', error);
      alert('Failed to add appointment. Please try again.');
    }
  };

  return (
    <div className="add-appointment">
      <h2>Add Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="specialization">Specialization:</label>
          <select
            name="specialization"
            id="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            {loadingSpecializations ? (
              <option>Loading specializations...</option>
            ) : (
              specializations.map((specialization, index) => (
                <option key={index} value={specialization}>
                  {specialization}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="doctorName">Doctor Name:</label>
          <select
            name="doctorName"
            id="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
            disabled={doctors.length === 0}
          >
            <option value="">Select a doctor...</option>
            {loadingDoctors ? (
              <option>Loading doctors...</option>
            ) : (
              doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.doctorName}>
                  {doctor.doctorName}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label>Appointment Date:</label>
          <div className="appointment-dates">
            {loadingDates ? (
              <p>Loading appointment dates...</p>
            ) : (
              appointmentDates.length > 0 ? (
                appointmentDates.map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    className={formData.appointmentDate === date ? 'selected' : ''}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, appointmentDate: date }));
                      fetchVisitingTimes(formData.doctorName, date); // Fetch visiting times for the selected date
                    }}
                  >
                    {date}
                  </button>
                ))
              ) : (
                <p>No available appointment dates</p>
              )
            )}
          </div>
        </div>

        <div>
          <label>Visiting Time:</label>
          <div className="time-slots">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="visitingTime"
                    value={slot}
                    onChange={handleChange}
                    required
                  />
                  {slot}
                </label>
              ))
            ) : (
              <p>No available visiting times</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="nic">NIC:</label>
          <input
            type="text"
            name="nic"
            id="nic"
            value={formData.nic}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            name="patientName"
            id="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select
            name="bloodGroup"
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
};

export default Addappointment;
