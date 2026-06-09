import React from 'react';
import Modal from './Modal';
import { travelTheme } from '../../theme/Theme';

const ConfirmModal = ({
    open,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Yes",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    type = "danger" 
}) => {

    const confirmColor =
        type === "danger"
            ? travelTheme.colors.danger
            : travelTheme.colors.primary;

    return (
        <Modal open={open} title={title} onClose={onCancel}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <p style={{ color: travelTheme.colors.text }}>
                    {message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: '10px 14px',
                            border: 'none',
                            borderRadius: travelTheme.radius.small,
                            cursor: 'pointer',
                            backgroundColor: travelTheme.colors.border,
                            fontFamily: travelTheme.font
                        }}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: '10px 14px',
                            border: 'none',
                            borderRadius: travelTheme.radius.small,
                            cursor: 'pointer',
                            backgroundColor: confirmColor,
                            color: 'white',
                            fontFamily: travelTheme.font,
                            fontWeight: 600
                        }}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>

                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;