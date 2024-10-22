// src/pages/Addappointment.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config'; // Ensure this path is correct 
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';
import './Addappointment.css'; // Ensure this file exists

const Addappointment = () => {
  const [formData, setFormData] = useState({
    appointmentNumber: '',
    scheduleId: '',
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
  const [scheduleId, setScheduleId] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'specialization') {
      fetchDoctorsBySpecialization(value);
      setFormData((prev) => ({
        ...prev,
        doctorName: '',
        appointmentDate: '',
        visitingTime: '',
        scheduleId: '',
      }));
      setAppointmentDates([]);
      setTimeSlots([]);
      setScheduleId('');
    } else if (name === 'doctorName') {
      fetchSchedulesByDoctor(value);
      setFormData((prev) => ({
        ...prev,
        appointmentDate: '',
        visitingTime: '',
        scheduleId: '',
      }));
      setAppointmentDates([]);
      setTimeSlots([]);
      setScheduleId('');
    } else if (name === 'appointmentDate') {
      fetchVisitingTimes(formData.doctorName, value);
      setFormData((prev) => ({
        ...prev,
        visitingTime: '',
        scheduleId: '',
      }));
      setScheduleId('');
    } else if (name === 'visitingTime') {
      // Find and set the scheduleId based on selected visitingTime
      const selectedTimeSlot = timeSlots.find(slot => slot.time === value);
      if (selectedTimeSlot) {
        setScheduleId(selectedTimeSlot.scheduleId);
        setFormData((prev) => ({
          ...prev,
          scheduleId: selectedTimeSlot.scheduleId,
        }));
      } else {
        setScheduleId('');
        setFormData((prev) => ({
          ...prev,
          scheduleId: '',
        }));
      }
    }
  };

  // Fetch doctors based on specialization
  const fetchDoctorsBySpecialization = async (specialization) => {
    try {
      const q = query(collection(db, 'Doctors'), where('specialization', '==', specialization));
      const querySnapshot = await getDocs(q);
      const doctorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        doctorName: doc.data().doctorName,
      }));
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors: ', error);
    }
  };

  // Fetch schedules based on doctorId
  const fetchSchedulesByDoctor = async (doctorId) => {
    try {
      const schedulesRef = collection(db, 'schedule', doctorId, 'schedules');
      const querySnapshot = await getDocs(schedulesRef);
      const scheduleList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        scheduleId: doc.data().scheduleId,
        appointmentDate: doc.data().appointmentDate,
        visitingTime: doc.data().visitingTime,
      }));
      
      const uniqueDates = [...new Set(scheduleList.map((schedule) => schedule.appointmentDate))];
      setAppointmentDates(uniqueDates);

      setTimeSlots([]); // Reset timeSlots

      // If only one schedule exists, set scheduleId automatically
      if (scheduleList.length === 1) {
        setScheduleId(scheduleList[0].scheduleId);
        setFormData((prev) => ({
          ...prev,
          scheduleId: scheduleList[0].scheduleId,
          appointmentDate: scheduleList[0].appointmentDate,
          visitingTime: scheduleList[0].visitingTime,
        }));
        setAppointmentDates([scheduleList[0].appointmentDate]);
        setTimeSlots([{ id: scheduleList[0].id, time: scheduleList[0].visitingTime, scheduleId: scheduleList[0].scheduleId }]);
      }
    } catch (error) {
      console.error('Error fetching schedules: ', error);
    }
  };

  // Fetch visiting times based on doctorId and selectedDate
  const fetchVisitingTimes = async (doctorId, selectedDate) => {
    try {
      const schedulesRef = collection(db, 'schedule', doctorId, 'schedules');
      const q = query(schedulesRef, where('appointmentDate', '==', selectedDate));
      const querySnapshot = await getDocs(q);
      const timeSlotsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        time: doc.data().visitingTime,
        scheduleId: doc.data().scheduleId,
      }));
      setTimeSlots(timeSlotsList);
    } catch (error) {
      console.error('Error fetching visiting times: ', error);
    }
  };

  // Generate appointment number based on doctorId and scheduleId
  const generateAppointmentNumber = async (doctorId, scheduleId) => {
    try {
      // Query 'Appointments' where 'scheduleId' == scheduleId
      const appointmentsRef = collection(db, 'Appointments');
      const q = query(appointmentsRef, where('scheduleId', '==', scheduleId));
      const querySnapshot = await getDocs(q);

      const existingNumbers = querySnapshot.docs.map((doc) => {
        const idParts = doc.id.split('-');
        const numPart = idParts[idParts.length -1];
        return parseInt(numPart, 10);
      });

      let newNumber = 1;
      while (existingNumbers.includes(newNumber)) {
        newNumber++;
      }

      // Format appointment number as D01-01-001
      // Assuming doctorId is like 'D01' and scheduleId is like '01'
      const appointmentNumber = `${doctorId}-${scheduleId}-${String(newNumber).padStart(3, '0')}`;

      return appointmentNumber;
    } catch (error) {
      console.error('Error generating appointment number: ', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { doctorName, appointmentDate, scheduleId } = formData;

      if (!scheduleId) {
        alert('Please select a schedule.');
        return;
      }

      // Generate the appointment number based on doctorId and scheduleId
      const appointmentNumber = await generateAppointmentNumber(doctorName, scheduleId);
      if (!appointmentNumber) {
        throw new Error('Failed to generate appointment number.');
      }

      const appointmentData = { ...formData, appointmentDate: appointmentDate, appointmentNumber: appointmentNumber };

      // Save the appointment in Firestore
      await setDoc(doc(db, 'Appointments', appointmentNumber), appointmentData);

      alert('Appointment added successfully!');
      setFormData({
        appointmentNumber: '',
        scheduleId: '',
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
      setScheduleId('');
    } catch (error) {
      console.error('Error adding appointment: ', error);
      alert('Failed to add appointment. Please try again.');
    }
  };

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Doctors'));
        const specializationsSet = new Set();
        querySnapshot.forEach((doc) => specializationsSet.add(doc.data().specialization));
        setSpecializations([...specializationsSet]);
      } catch (error) {
        console.error('Error fetching specializations: ', error);
      }
    };
    fetchSpecializations();
  }, []);

  return (
    <div className="add-appointment">
      <h2>Add Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Schedule ID */}
        <label>Schedule ID</label>
        <input type="text" value={scheduleId} readOnly />

        {/* Appointment Number */}
        <label>Appointment Number</label>
        <input type="text" value={formData.appointmentNumber} readOnly />

        {/* Specialization */}
        <label>Specialization</label>
        <select name="specialization" value={formData.specialization} onChange={handleChange}>
          <option value="">Select Specialization</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        {/* Doctor Name */}
        <label>Doctor Name</label>
        <select name="doctorName" value={formData.doctorName} onChange={handleChange}>
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.doctorName}
            </option>
          ))}
        </select>

        {/* Appointment Date */}
        <label>Appointment Date</label>
        <select name="appointmentDate" value={formData.appointmentDate} onChange={handleChange}>
          <option value="">Select Appointment Date</option>
          {appointmentDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        {/* Visiting Time */}
        <label>Visiting Time</label>
        <select name="visitingTime" value={formData.visitingTime} onChange={handleChange}>
          <option value="">Select Visiting Time</option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.time}>
              {slot.time}
            </option>
          ))}
        </select>

        {/* NIC */}
        <label>NIC</label>
        <input type="text" name="nic" value={formData.nic} onChange={handleChange} required />

        {/* Patient Name */}
        <label>Patient Name</label>
        <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />

        {/* Phone */}
        <label>Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        {/* Email */}
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        {/* Gender */}
        <label>Gender</label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} required />

        {/* Blood Group */}
        <label>Blood Group</label>
        <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />

        {/* Address */}
        <label>Address</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required />

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Addappointment;
