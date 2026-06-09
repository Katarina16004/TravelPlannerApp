import React, { useState } from 'react';
import InputField from '../Common/InputField';
import { travelTheme } from '../../theme/Theme';

const RegisterForm = ({ onSubmit, loading }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, password });
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ fontFamily: travelTheme.font }}
        >
            <InputField
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: travelTheme.colors.secondary,
                    color: 'white',
                    border: 'none',
                    borderRadius: travelTheme.radius.regular,
                    fontSize: '15px',
                    fontWeight: '600',
                    letterSpacing: '0.3px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
            >
                {loading
                    ? 'Preparing your adventure...'
                    : 'Create Account →'}
            </button>
        </form>
    );
};

export default RegisterForm;