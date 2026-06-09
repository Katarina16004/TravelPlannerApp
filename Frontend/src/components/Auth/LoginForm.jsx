import React, { useState } from 'react';
import InputField from '../Common/InputField';
import { travelTheme } from '../../theme/Theme';

const LoginForm = ({ onSubmit, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} style={{ fontFamily: travelTheme.font }}>
            <InputField 
                label="Email Address" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
            <InputField 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
            
            <button 
                type="submit" 
                disabled={loading}
                style={{ 
                    width: '100%', 
                    padding: '14px', 
                    backgroundColor: travelTheme.colors.primary, 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: travelTheme.radius.regular, 
                    fontSize: '15px', 
                    fontWeight: '600',
                    letterSpacing: '0.3px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '10px',
                    boxShadow: '0 4px 12px rgba(26, 54, 93, 0.15)'
                }}
            >
                {loading ? 'Preparing your dashboard...' : 'Explore My Trips →'}
            </button>
        </form>
    );
};

export default LoginForm;