import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import AdminDashboard from './pages/Admin/Users.jsx';
import AdminTrips from './pages/Admin/Trips.jsx'; 
import MyProfile from './pages/MyProfile/MyProfile.jsx';
import Trips from './pages/Trips/Trips.jsx';

import Navbar from './components/Common/Navbar.jsx';
import { ToastContainer } from 'react-toastify';

const Home = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: '"Inter", system-ui, sans-serif' }}>
            <h1>Welcome to TravelPlanner, {user?.name}! </h1>
            <p>Your Passport Email: {user?.email}</p>
            <p>Current Clearance Role: <strong>{user?.role}</strong></p>
        </div>
    );
};

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoute = () => {
    const { user } = useAuth();
    return user?.role === 'Admin' ? <Outlet /> : <Navigate to="/" />;
};

const MainLayout = () => {
    return (
        <div style={{ paddingTop: '20px' }}> 
            <Navbar />
            <Outlet />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Javne rute */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/trips" element={<Trips />} />
                        <Route path="/profile" element={<MyProfile />} />

                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/trips" element={<AdminTrips />} /> 
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <ToastContainer position="top-right" autoClose={2300} />
        </Router>
    );
}

export default App;