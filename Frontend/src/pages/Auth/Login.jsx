import React, { useState } from 'react';
import { authService } from '../../services/Auth/authService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginForm from '../../components/Auth/LoginForm';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await authService.login(formData.email, formData.password);
            login(response.token, response.role);
            toast.success('Successfully logged in! Welcome back.');
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>
            <LoginForm onSubmit={handleLoginSubmit} loading={loading} />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</Link>
            </p>
        </div>
    );
};

export default Login;