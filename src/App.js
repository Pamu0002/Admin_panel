import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import AddNewPatient from './pages/AddNewPatient';
import AddSchedule from './pages/AddSchedule';
import Dashboard from './pages/Dashboard';
import DoctorDetails from './pages/DoctorDetails'; // Import DoctorDetails component
import Doctors from './pages/Doctors';
import DoctorSchedule from './pages/DoctorSchedule';
import Login from './pages/login';
import Logout from './pages/logout';
import Medicine from './pages/Medicine';
import NewDoctor from './pages/NewDoctor';
import PatientAppointment from './pages/PatientAppointment';
import Patients from './pages/Patients';
import PatientInfo from './pages/PatientInfo'; // Import PatientInfo component
import Prescription from './pages/Prescription';
import Signup from './pages/Signup';
import AddMedicine from './pages/AddMedicine'; // Import AddMedicine component

function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div style={{ display: 'flex' }}>
            {!isLoginPage && <SideBar />} 
            <div style={{ flex: 1, marginLeft: !isLoginPage ? '250px' : '0', paddingTop: !isLoginPage ? '60px' : '0' }}>
                {!isLoginPage && <TopBar />}
                <div style={{ marginTop: !isLoginPage ? '60px' : '0' }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/new-doctor" element={<NewDoctor />} />
                        <Route path="/doctor/:doctorId" element={<DoctorDetails />} /> {/* Route for DoctorDetails */}
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/addnewpatient" element={<AddNewPatient />} />
                        <Route path="/medicine" element={<Medicine />} />
                        <Route path="/add-medicine" element={<AddMedicine />} /> {/* Route for AddMedicine */}
                        <Route path="/patient-appointment" element={<PatientAppointment />} />
                        <Route path="/doctor-schedule" element={<DoctorSchedule />} />
                        <Route path="/add-schedule" element={<AddSchedule />} />
                        <Route path="/prescription" element={<Prescription />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/patient/:id" element={<PatientInfo />} /> {/* Route for PatientInfo */}
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
