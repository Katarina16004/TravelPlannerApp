import React, { useState } from 'react';
import { authService } from '../../services/Auth/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegisterForm from '../../components/Auth/RegisterForm';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleRegisterSubmit = async (formData) => {
        if (formData.password.length < 6) {
            toast.warn('Password must have at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await authService.register(formData.name, formData.email, formData.password);
            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
            <RegisterForm onSubmit={handleRegisterSubmit} loading={loading} />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Sign In</Link>
            </p>
        </div>
    );
};

export default Register;