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
  const [appointments, setAppointments] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

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
      setFormData((prev) => ({ ...prev, doctorName: '', visitingTime: '', appointmentDate: '' }));
      fetchDoctors(value);
    }

    if (name === 'doctorName') {
      fetchAppointments(value);
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

  const fetchAppointments = async (doctorName) => {
    if (!doctorName) {
      setAppointments([]);
      return;
    }

    setLoadingAppointments(true);
    try {
      const q = query(collection(db, 'Appointments'), where('doctorName', '==', doctorName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const appointmentsList = querySnapshot.docs.map((doc) => doc.data());
        setAppointments(appointmentsList);

        if (appointmentsList.length > 0) {
          const firstAppointment = appointmentsList[0];
          setFormData((prev) => ({
            ...prev,
            appointmentDate: firstAppointment.appointmentDate || '',
            visitingTime: firstAppointment.visitingTime || '',
            nic: firstAppointment.nic || '',
            patientName: firstAppointment.patientName || '',
            phone: firstAppointment.phone || '',
            email: firstAppointment.email || '',
            gender: firstAppointment.gender || '',
            bloodGroup: firstAppointment.bloodGroup || '',
            address: firstAppointment.address || '',
          }));
        }
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments: ', error);
    } finally {
      setLoadingAppointments(false);
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
      setAppointments([]);
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

        {/* Display all appointment fields if fetched */}
        {appointments.length > 0 && (
          <>
            <div>
              <label htmlFor="appointmentDate">Appointment Date:</label>
              <input
                type="date"
                name="appointmentDate"
                id="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="visitingTime">Visiting Time:</label>
              <input
                type="text"
                name="visitingTime"
                id="visitingTime"
                value={formData.visitingTime}
                onChange={handleChange}
                required
              />
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
                type="text"
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
              <input
                type="text"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="bloodGroup">Blood Group:</label>
              <input
                type="text"
                name="bloodGroup"
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
};

export default Addappointment;
