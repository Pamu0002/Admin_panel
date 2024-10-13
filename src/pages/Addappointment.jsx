import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
  orderBy,
  limit,
} from 'firebase/firestore';
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
  const [patients, setPatients] = useState([]);

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

    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'Patients'));
        const querySnapshot = await getDocs(q);

        const patientsList = querySnapshot.docs.map((doc) => ({
          referenceNo: parseInt(doc.id, 10),
          ...doc.data(),
        }));

        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching patients: ', error);
      }
    };

    fetchSpecializations();
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'specialization') {
      setFormData((prev) => ({
        ...prev,
        doctorName: '',
        appointmentDate: '',
        visitingTime: '',
      }));
      fetchDoctors(value);
      setAppointmentDates([]);
      setTimeSlots([]);
    }

    if (name === 'doctorName') {
      setFormData((prev) => ({ ...prev, appointmentDate: '', visitingTime: '' }));
      fetchAppointmentDates(value);
    }

    if (name === 'appointmentDate') {
      fetchVisitingTimes(formData.doctorName, value);
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

        setAppointmentDates([...datesSet]);
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
        const q = query(
          collection(db, 'schedule'),
          where('doctorId', '==', doctorDoc.id),
          where('appointmentDate', '==', appointmentDate)
        );
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

  const generateNextReferenceNo = () => {
    if (patients.length === 0) return 1;
    const referenceNos = patients.map((patient) => patient.referenceNo);
    return Math.max(...referenceNos) + 1;
  };

  const generateNextAppointmentNumber = async () => {
    const q = query(collection(db, 'Appointments'), orderBy('appointmentNumber', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No previous appointments found. Starting at APPT-001.");
      return 'APPT-001';
    }

    const lastAppointmentNumber = querySnapshot.docs[0].data().appointmentNumber;
    console.log("Last appointment number found:", lastAppointmentNumber);

    const lastNumber = parseInt(lastAppointmentNumber.split('-')[1], 10);
    const nextNumber = lastNumber + 1;

    const newAppointmentNumber = `APPT-${String(nextNumber).padStart(3, '0')}`;
    console.log("New appointment number generated:", newAppointmentNumber);
    
    return newAppointmentNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const appointmentNumber = await generateNextAppointmentNumber();
      const referenceNo = generateNextReferenceNo();

      console.log("Generated appointment number:", appointmentNumber);
      console.log("Generated reference number:", referenceNo);

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
        referenceNo,
      };

      if (formData.email) {
        appointmentData.email = formData.email;
      }

      // Save the appointment as a new document
      await setDoc(doc(db, 'Appointments', appointmentData.appointmentNumber), appointmentData);

      const patientRef = doc(db, 'Patients', referenceNo.toString());
      const patientUpdateData = {
        referenceNo,
        lastAppointment: appointmentData,
        appointments: arrayUnion(appointmentData.appointmentNumber),
      };
      await setDoc(patientRef, patientUpdateData, { merge: true });

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
      setPatients([]);
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
          <label htmlFor="doctorName">Doctor:</label>
          <select
            name="doctorName"
            id="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
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
          <label htmlFor="appointmentDate">Appointment Date:</label>
          <select
            name="appointmentDate"
            id="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            {loadingDates ? (
              <option>Loading dates...</option>
            ) : (
              appointmentDates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="visitingTime">Visiting Time:</label>
          <select
            name="visitingTime"
            id="visitingTime"
            value={formData.visitingTime}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            {loadingTimes ? (
              <option>Loading times...</option>
            ) : (
              timeSlots.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))
            )}
          </select>
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
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
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
