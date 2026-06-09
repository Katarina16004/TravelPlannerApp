import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { travelTheme } from '../../theme/Theme';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            backgroundColor: travelTheme.colors.primary,
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: travelTheme.font,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                TravelPlanner
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                
                <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
                    My Profile
                </Link>

                {user?.role === 'Admin' && (
                    <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
                        Users
                    </Link>
                )}

                <button 
                    onClick={handleLogout}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#FFAAAA',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '500',
                        fontFamily: travelTheme.font,
                        padding: '5px 10px',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = travelTheme.colors.danger}
                    onMouseLeave={(e) => e.target.style.color = '#FFAAAA'}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;