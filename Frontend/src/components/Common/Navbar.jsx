import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { travelTheme } from '../../theme/Theme';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        
        return {
            color: 'white',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? '700' : '500', 
            opacity: isActive ? 1 : 0.75,        
            borderBottom: isActive ? '2px solid white' : '2px solid transparent', 
            transition: 'all 0.2s ease',
            paddingBottom: '4px'
        };
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: travelTheme.colors.primary,
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: travelTheme.font,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <span style={{ 
                color: 'white', 
                fontSize: '23px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                userSelect: 'none',
                cursor: 'default'
            }}>
                Travel Planner
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                
                <Link to="/profile" style={getLinkStyle('/profile')}>
                    My Profile
                </Link>

                {user?.role === 'Admin' && (
                    <Link to="/admin" style={getLinkStyle('/admin')}>
                        Users
                    </Link>
                )}
                
                <Link to="/trips" style={getLinkStyle('/trips')}>
                    My Trips
                </Link>
                
                {user?.role === 'Admin' && (
                    <Link to="/admin/trips" style={getLinkStyle('/admin/trips')}>
                        All Trips
                    </Link>
                )}

                <button 
                    onClick={handleLogout}
                    title="Logout" 
                    style={{
                        backgroundColor: 'transparent',
                        color: '#FFAAAA',
                        marginLeft: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = travelTheme.colors.danger}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FFAAAA'}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2.5"   
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        style={{ width: '22px', height: '22px' }} 
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;