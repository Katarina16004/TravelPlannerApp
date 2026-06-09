import React from 'react';
import { travelTheme } from '../../theme/Theme';

const Modal = ({ open, title, onClose, children }) => {
    if (!open) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                width: '420px',
                backgroundColor: travelTheme.colors.surface,
                borderRadius: travelTheme.radius.large,
                padding: '25px',
                boxShadow: travelTheme.shadow,
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        border: 'none',
                        background: 'transparent',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: travelTheme.colors.muted
                    }}
                >
                    ✕
                </button>

                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{title}</h2>

                {children}
            </div>
        </div>
    );
};

export default Modal;