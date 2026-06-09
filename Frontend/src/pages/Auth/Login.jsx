import React, { useState } from 'react';
import { authService } from '../../services/Auth/authService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginForm from '../../components/Auth/LoginForm';
import { travelTheme } from '../../theme/Theme';
import loginBg from '../../assets/travel-bg.jpg'; 

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await authService.login(formData.email, formData.password);
            login(response.token, response.role);
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontFamily: travelTheme.font,
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backdropFilter: 'blur(10px)', 
                backgroundColor: 'rgba(26, 54, 93, 0.1)', 
                zIndex: 1
            }} />

            <div style={{ 
                maxWidth: '420px', 
                width: '100%',
                padding: '40px', 
                backgroundColor: travelTheme.colors.surface, 
                border: `1px solid ${travelTheme.colors.border}`, 
                borderRadius: travelTheme.radius.large, 
                boxShadow: travelTheme.shadow,
                position: 'relative', 
                zIndex: 2 
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: travelTheme.colors.text, fontSize: '24px', fontWeight: '700', marginTop: '10px', marginBottom: '5px' }}>
                        Travel Planner
                    </h2>
                    <p style={{ color: travelTheme.colors.muted, fontSize: '14px', margin: 0 }}>
                        Log in to access your travel plans.
                    </p>
                </div>

                <LoginForm onSubmit={handleLoginSubmit} loading={loading} />
                
                <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: travelTheme.colors.muted }}>
                    Don't have an account? <Link to="/register" style={{ color: travelTheme.colors.secondary, textDecoration: 'none', fontWeight: '500' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;