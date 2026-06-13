import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import AdminDashboard from './pages/Admin/Users.jsx';
import AdminTrips from './pages/Admin/Trips.jsx'; 
import MyProfile from './pages/MyProfile/MyProfile.jsx';
import Trips from './pages/Trips/Trips.jsx';
import TripDetails from './pages/Trips/TripDetails.jsx';

import Navbar from './components/Common/Navbar.jsx';
import { ToastContainer } from 'react-toastify';

const DashboardRedirect = () => {
    const { user } = useAuth();
    
    if (user?.role === 'Admin') {
        return <Navigate to="/admin/trips" replace />;
    }
    return <Navigate to="/trips" replace />;
};

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    
    const queryParams = new URLSearchParams(window.location.search);
    const hasShareToken = queryParams.has('token');

    return (isAuthenticated || hasShareToken) ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
    const { user } = useAuth();
    return user?.role === 'Admin' ? <Outlet /> : <Navigate to="/" />;
};

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    
    const queryParams = new URLSearchParams(window.location.search);
    const hasShareToken = queryParams.has('token');

    const showNavbar = isAuthenticated;

    return (
        <div style={{ paddingTop: showNavbar ? '20px' : '0px' }}> 
            {showNavbar && <Navbar />}
            <Outlet />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<DashboardRedirect />} />
                        
                        <Route path="/trips" element={<Trips />} />
                        <Route path="/profile" element={<MyProfile />} />
                        <Route path="/trips/:tripId" element={<TripDetails />} />

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