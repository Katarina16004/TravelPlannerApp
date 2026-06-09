import React, { useState } from 'react';
import { authService } from '../../services/Auth/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegisterForm from '../../components/Auth/RegisterForm';
import { travelTheme } from '../../theme/Theme';
import loginBg from '../../assets/travel-bg.jpg';

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
            await authService.register(
                formData.name,
                formData.email,
                formData.password
            );

            toast.success('Account created successfully! Now Log in!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            toast.error(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: travelTheme.font,
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(26, 54, 93, 0.1)',
                    zIndex: 1
                }}
            />

            <div
                style={{
                    maxWidth: '420px',
                    width: '100%',
                    padding: '40px',
                    backgroundColor: travelTheme.colors.surface,
                    border: `1px solid ${travelTheme.colors.border}`,
                    borderRadius: travelTheme.radius.large,
                    boxShadow: travelTheme.shadow,
                    position: 'relative',
                    zIndex: 2
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}
                >

                    <h2
                        style={{
                            color: travelTheme.colors.text,
                            fontSize: '24px',
                            fontWeight: '700',
                            marginTop: '10px',
                            marginBottom: '5px'
                        }}
                    >
                        Join Travel Planner
                    </h2>

                    <p
                        style={{
                            color: travelTheme.colors.muted,
                            fontSize: '14px',
                            margin: 0
                        }}
                    >
                        Start planning your next adventure.
                    </p>
                </div>

                <RegisterForm
                    onSubmit={handleRegisterSubmit}
                    loading={loading}
                />

                <p
                    style={{
                        textAlign: 'center',
                        marginTop: '25px',
                        fontSize: '14px',
                        color: travelTheme.colors.muted
                    }}
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: travelTheme.colors.secondary,
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;