import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'; 
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import NewDoctor from './pages/NewDoctor'; 
import DoctorDetails from './pages/DoctorDetails'; // Import DoctorDetails component
import Patients from './pages/Patients';
import AddNewPatient from './pages/AddNewPatient';
import Medicine from './pages/Medicine';
import PatientAppointment from './pages/PatientAppointment';
import DoctorSchedule from './pages/DoctorSchedule';
import AddSchedule from './pages/AddSchedule';
import Prescription from './pages/Prescription';
import Login from './pages/login'; 
import Signup from './pages/Signup'; 
import Logout from './pages/logout';

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
                        <Route path="/patient-appointment" element={<PatientAppointment />} />
                        <Route path="/doctor-schedule" element={<DoctorSchedule />} />
                        <Route path="/add-schedule" element={<AddSchedule />} />
                        <Route path="/prescription" element={<Prescription />} />
                        <Route path="/logout" element={<Logout />} />
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
