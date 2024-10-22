import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import './Addappointment.css';

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
    } else if (name === 'appointmentDate') {
      fetchVisitingTimes(formData.doctorName, value);
      setFormData((prev) => ({
        ...prev,
        visitingTime: '',
        scheduleId: '',
      }));
    } else if (name === 'visitingTime') {
      const selectedTimeSlot = timeSlots.find(slot => slot.time === value);
      if (selectedTimeSlot) {
        setFormData((prev) => ({
          ...prev,
          scheduleId: selectedTimeSlot.scheduleId,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          scheduleId: '',
        }));
      }
    }
  };

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

      setTimeSlots([]);

      if (scheduleList.length === 1) {
        const selectedSchedule = scheduleList[0];
        setFormData((prev) => ({
          ...prev,
          scheduleId: selectedSchedule.scheduleId,
          appointmentDate: selectedSchedule.appointmentDate,
          visitingTime: selectedSchedule.visitingTime,
        }));
        setTimeSlots([{ id: selectedSchedule.id, time: selectedSchedule.visitingTime, scheduleId: selectedSchedule.scheduleId }]);
      }
    } catch (error) {
      console.error('Error fetching schedules: ', error);
    }
  };

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

  const generateAppointmentNumber = async (doctorId, scheduleId) => {
    try {
      const appointmentsRef = collection(db, 'Appointments');
      const q = query(appointmentsRef, where('scheduleId', '==', scheduleId));
      const querySnapshot = await getDocs(q);

      const existingNumbers = querySnapshot.docs.map((doc) => {
        const idParts = doc.id.split('-');
        const numPart = idParts[idParts.length - 1];
        return parseInt(numPart, 10);
      });

      let newNumber = 1;
      while (existingNumbers.includes(newNumber)) {
        newNumber++;
      }

      const appointmentNumber = `${doctorId}-${scheduleId}-${String(newNumber).padStart(3, '0')}`;
      return appointmentNumber;
    } catch (error) {
      console.error('Error generating appointment number: ', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { appointmentDate, scheduleId } = formData;

      if (!scheduleId) {
        alert('Please select a schedule.');
        return;
      }

      const appointmentNumber = await generateAppointmentNumber(formData.doctorName, scheduleId);
      if (!appointmentNumber) {
        throw new Error('Failed to generate appointment number.');
      }

      const selectedDoctor = doctors.find((doc) => doc.id === formData.doctorName);
      const doctorNameToSave = selectedDoctor ? selectedDoctor.doctorName : '';

      const appointmentData = {
        ...formData,
        appointmentDate,
        appointmentNumber,
        doctorName: doctorNameToSave,
      };

      await setDoc(doc(db, 'Appointments', appointmentNumber), appointmentData);

      // Fetch the latest reference number from the Patientcount collection
      const patientCountDoc = await getDoc(doc(db, 'Patientcount', 'latest'));
      let latestReferenceNo = 0;
      if (patientCountDoc.exists()) {
        latestReferenceNo = patientCountDoc.data().latestReferenceNo;
      }

      // Generate the next reference number
      const newReferenceNo = `REF-${new Date().getFullYear()}-${latestReferenceNo + 1}`;

      // Add new patient to the Patients collection with the generated referenceNo as the document ID
      const patientData = {
        ...formData,
        referenceNo: newReferenceNo,
      };

      await setDoc(doc(db, 'Patients', newReferenceNo), patientData);

      // Update the latest reference number in the Patientcount collection
      await setDoc(doc(db, 'Patientcount', 'latest'), {
        latestReferenceNo: latestReferenceNo + 1,
      });

      alert('Appointment and patient record added successfully!');
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
    } catch (error) {
      console.error('Error adding appointment: ', error);
      alert('Failed to add appointment. Please try again.');
    }
  };

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
        <input type="text" value={formData.scheduleId} readOnly />

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
          <option value="">Select Date</option>
          {appointmentDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>

        {/* Visiting Time */}
        <label>Visiting Time</label>
        <select name="visitingTime" value={formData.visitingTime} onChange={handleChange}>
          <option value="">Select Time</option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.time}>
              {slot.time}
            </option>
          ))}
        </select>

        {/* Patient Info */}
        <label>Patient Name</label>
        <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />
        <label>NIC</label>
        <input type="text" name="nic" value={formData.nic} onChange={handleChange} required />
        <label>Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <label>Gender</label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} required />
        <label>Blood Group</label>
        <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
        <label>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
};

export default Addappointment;
