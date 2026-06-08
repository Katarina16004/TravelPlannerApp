import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Welcome, {user?.name}!</h1>
            <p>Email: {user?.email}</p>
            <p>Role: <strong>{user?.role}</strong></p>
            <button onClick={logout} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
            </button>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
            <ToastContainer position="top-right" autoClose={2300} />
        </Router>
    );
}

export default App;