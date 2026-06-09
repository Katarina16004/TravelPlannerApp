import React, { useState, useEffect } from 'react';
import { travelTheme } from '../../theme/Theme';
import { toast } from 'react-toastify';
import InputField from '../Common/InputField';

const ProfileForm = ({ initialData, onSubmit, loading }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                email: initialData.email || '',
                currentPassword: '',
                newPassword: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const hasChanges = () => {
        return (
            form.name !== initialData?.name ||
            form.email !== initialData?.email ||
            form.currentPassword.trim() !== '' ||
            form.newPassword.trim() !== ''
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!hasChanges()) {
            toast.info('No changes detected.');
            return;
        }

        onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <InputField
                
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
            />

            <InputField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
            />

            <InputField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
            />

            <InputField
                label="New Password"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
            />

            <button
                type="submit"
                disabled={loading || !hasChanges()}
                style={{
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: travelTheme.radius.regular,
                    border: 'none',
                    cursor: loading || !hasChanges() ? 'not-allowed' : 'pointer',
                    backgroundColor: hasChanges()
                        ? travelTheme.colors.primary
                        : travelTheme.colors.border,
                    color: hasChanges() ? 'white' : travelTheme.colors.muted,
                    fontFamily: travelTheme.font,
                    fontWeight: 600
                }}
            >
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default ProfileForm;