import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react';
import { db } from '../firebase-config';
import './NewDoctor.css';

const NewDoctor = () => {
  const [doctor, setDoctor] = useState({
    id: '',  // Manual input for Doctor ID
    doctorName: '',  // Changed from fullName to doctorName
    gender: '',
    hospital: '',
    specialization: '',
    email: '',
    dob: '',
    nic: '',
    UserName: '',
    password: '',
    phoneNumber: '',
    status: '',
    biography: '',
    designation: '',
    photo: ''
  });

  const [photoFile, setPhotoFile] = useState(null); // To store the file
  const [message, setMessage] = useState({
    text: '',
    type: ''
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload the photo if a file is selected
      let photoURL = '';
      if (photoFile) {
        const storage = getStorage();
        const photoRef = ref(storage, `doctor_photos/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef); // Get the photo URL after upload
      }

      // Add doctor details to Firestore, including the manually entered ID, doctorName, and photo URL
      const doctorRef = doc(db, 'Doctors', doctor.id);
      await setDoc(doctorRef, { ...doctor, doctorName: doctor.doctorName, photo: photoURL });

      setMessage({ text: 'Doctor added successfully!', type: 'success' });
      setDoctor({
        id: '',  // Reset Doctor ID after submission
        doctorName: '',  // Reset doctorName
        gender: '',
        hospital: '',
        specialization: '',
        email: '',
        dob: '',
        nic: '',
        UserName: '',
        password: '',
        phoneNumber: '',
        status: '',
        biography: '',
        designation: '',
        photo: ''
      });
      setPhotoFile(null);

    } catch (error) {
      console.error('Error details:', error.message);
      setMessage({ text: 'Error adding doctor. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="form-container">
      <h2>Register a Doctor</h2>
      <form className="doctor-form" onSubmit={handleSubmit}>

        {/* Manual input field for Doctor ID */}
        <div className="form-group-half">
          <label>Doctor Id:</label>
          <input type="text" name="id" value={doctor.id} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Doctor Name:</label> {/* Changed label from Full Name to Doctor Name */}
          <input type="text" name="doctorName" value={doctor.doctorName} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Gender:</label>
          <input type="text" name="gender" value={doctor.gender} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Hospital:</label>
          <input type="text" name="hospital" value={doctor.hospital} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Specialization:</label>
          <input name="specialization" value={doctor.specialization} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={doctor.dob} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Email:</label>
          <input type="email" name="email" value={doctor.email} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>NIC:</label>
          <input type="text" name="nic" value={doctor.nic} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>User Name:</label>
          <input type="text" name="UserName" value={doctor.UserName} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Password:</label>
          <input type="password" name="password" value={doctor.password} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Phone Number:</label>
          <input type="tel" name="phoneNumber" value={doctor.phoneNumber} onChange={handleChange} required />
        </div>

        <div className="form-group-half">
          <label>Status:</label>
          <input type="text" name="status" value={doctor.status} onChange={handleChange} required />
        </div>

        <div className="form-group-full">
          <label>Biography:</label>
          <textarea name="biography" value={doctor.biography} onChange={handleChange} rows="3" required />
        </div>

        <div className="form-group-half">
          <label>Designation:</label>
          <input type="text" name="designation" value={doctor.designation} onChange={handleChange} required />
        </div>

        {/* New field for photo */}
        <div className="form-group-half">
          <label>Photo:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">Register</button>
        </div>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
};

export default NewDoctor;
