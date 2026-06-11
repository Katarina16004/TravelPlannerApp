import React, { useState, useEffect } from 'react';
import { userService } from '../../services/User/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { travelTheme } from '../../theme/Theme';

import UsersTable from '../../components/Admin/UsersTable';
import Modal from '../../components/Common/Modal';
import ProfileForm from '../../components/MyProfile/ProfileForm';
import ConfirmModal from '../../components/Common/ConfirmModal';
import loginBg from '../../assets/travel-bg.jpg'; 

const AdminDashboard = () => {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingUser, setEditingUser] = useState(null);
    const [updating, setUpdating] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();

            if (response.success) {
                setUsers(response.data);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDeleteClick = (id, name) => {
        setConfirmDelete({ id, name });
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;

        try {
            const response = await userService.deleteUser(confirmDelete.id);

            if (response.success) {
                toast.success('User deleted.');
                setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
                setConfirmDelete(null);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateUser = async (formData) => {
        try {
            setUpdating(true);

            const response = await userService.updateUserProfile(
                editingUser.id,
                formData
            );

            if (response.success) {
                toast.success('User updated successfully');

                setUsers(prev =>
                    prev.map(u =>
                        u.id === editingUser.id ? response.data : u
                    )
                );

                setEditingUser(null);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (user?.role !== 'Admin') {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <h2 style={{ color: travelTheme.colors.danger }}>
                    Access Denied
                </h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ 
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: travelTheme.font,
                color: 'white'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 54, 93, 0.1)'
                }} />
                <h2 style={{ position: 'relative', zIndex: 2 }}>Loading users...</h2>
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
            alignItems: 'flex-start', 
            padding: '60px 20px',
            fontFamily: travelTheme.font,
            position: 'relative',
            boxSizing: 'border-box'
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
                position: 'relative',
                zIndex: 2,
                maxWidth: '1000px',
                width: '100%',
                margin: '30px auto',
                backgroundColor: travelTheme.colors.surface,
                padding: '30px',
                borderRadius: travelTheme.radius.large,
                boxShadow: travelTheme.shadow
            }}>
                <div style={{ marginBottom: '25px' }}>
                    <h2 style={{ color: travelTheme.colors.text, margin: 0, fontSize: '26px', fontWeight: '700' }}>
                        User management control
                    </h2>
                    <p style={{ color: travelTheme.colors.muted, margin: '5px 0 0 0', fontSize: '14px' }}>
                        Manage registered accounts and clean up application profiles
                    </p>
                </div>

                <UsersTable
                    users={users}
                    currentUserId={user?.id}
                    onDelete={handleDeleteClick}
                    onEdit={setEditingUser}
                />
            </div>

            <Modal
                open={!!editingUser}
                title="Edit User"
                onClose={() => setEditingUser(null)}
            >
                {editingUser && (
                    <ProfileForm
                        initialData={editingUser}
                        onSubmit={handleUpdateUser}
                        loading={updating}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${confirmDelete?.name}?`}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleConfirmDelete}
                loading={false}
                type="danger"
            />
        </div>
    );
};

export default AdminDashboard;