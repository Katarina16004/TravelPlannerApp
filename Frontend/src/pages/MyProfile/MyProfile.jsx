import React, { useEffect, useState } from 'react';
import { userService } from '../../services/User/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ProfileForm from '../../components/MyProfile/ProfileForm';
import { travelTheme } from '../../theme/Theme';

const MyProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await userService.getUserProfile(user.id);

            if (response.success) {
                setProfile(response.data);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) loadProfile();
    }, [user]);

    const handleUpdate = async (formData) => {
        try {
            setUpdating(true);

            const response = await userService.updateUserProfile(
                user.id,
                formData
            );

            if (response.success) {
                toast.success('Profile updated successfully!');
                loadProfile();
            }
        } catch (err) {
            toast.error(err.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: travelTheme.font
            }}>
                Loading profile...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: travelTheme.colors.backgroundtwo,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: travelTheme.font
        }}>
            <div style={{
                width: '520px',
                maxWidth: '90%',
                backgroundColor: travelTheme.colors.surface,
                borderRadius: travelTheme.radius.large,
                border: `1px solid ${travelTheme.colors.border}`,
                boxShadow: travelTheme.shadow,
                padding: '30px'
            }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2 style={{ margin: 0, color: travelTheme.colors.text }}>
                        My Profile
                    </h2>

                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: travelTheme.colors.muted
                    }}>
                        Manage your account info
                    </p>
                </div>

                {profile && (
                    <ProfileForm
                        initialData={profile}
                        onSubmit={handleUpdate}
                        loading={updating}
                    />
                )}
            </div>
        </div>
    );
};

export default MyProfile;