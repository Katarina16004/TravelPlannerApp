import React, { useEffect, useState } from 'react';
import { userService } from '../../services/User/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ProfileForm from '../../components/MyProfile/ProfileForm';
import { travelTheme } from '../../theme/Theme';
import loginBg from '../../assets/travel-bg.jpg'; 

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
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: travelTheme.font,
                color: 'white',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 54, 93, 0.1)'
                }} />
                <h2 style={{ position: 'relative', zIndex: 2 }}>Loading profile...</h2>
            </div>
        );
    }

    return (
        <div style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed', 
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: travelTheme.font,
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: '40px 20px'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backdropFilter: 'blur(10px)', 
                backgroundColor: 'rgba(26, 54, 93, 0.1)', 
                zIndex: 1
            }} />

            <div style={{
                width: '420px',
                maxWidth: '90%',
                backgroundColor: travelTheme.colors.surface,
                borderRadius: travelTheme.radius.large,
                border: `1px solid ${travelTheme.colors.border}`,
                boxShadow: travelTheme.shadow,
                padding: '30px',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: travelTheme.colors.text, margin: 0 }}>My Profile</h2>
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