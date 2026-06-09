import React from 'react';
import { travelTheme } from '../../theme/Theme';

const InputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    required = true
}) => {
    return (
        <div
            style={{
                marginBottom: '12px',
                paddingLeft: '8px',
                paddingRight: '8px'
            }}
        >
            {label && (
                <label
                    style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '13px',
                        color: travelTheme.colors.muted,
                        fontWeight: 600,
                        paddingLeft: '2px'
                    }}
                >
                    {label}
                </label>
            )}

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${travelTheme.colors.border}`,
                    borderRadius: travelTheme.radius.regular,
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: travelTheme.font,
                    color: travelTheme.colors.text,
                    backgroundColor: travelTheme.colors.surface,
                    boxSizing: 'border-box' 
                }}
            />
        </div>
    );
};

export default InputField;