import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, required = true }) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>
            <input 
                type={type} 
                value={value} 
                onChange={onChange} 
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                required={required} 
            />
        </div>
    );
};

export default InputField;