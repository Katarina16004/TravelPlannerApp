import React, { useState, useEffect } from 'react';
import { userService } from '../../services/User/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { travelTheme } from '../../theme/Theme';

import UsersTable from '../../components/Admin/UsersTable';
import Modal from '../../components/Common/Modal';
import ProfileForm from '../../components/MyProfile/ProfileForm';

const AdminDashboard = () => {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingUser, setEditingUser] = useState(null);
    const [updating, setUpdating] = useState(false);

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

    const handleDeleteClick = async (id, name) => {
        if (!window.confirm(`Delete user ${name}?`)) return;

        try {
            const response = await userService.deleteUser(id);

            if (response.success) {
                toast.success('User deleted.');
                setUsers(prev => prev.filter(u => u.id !== id));
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
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3>Loading users...</h3>
            </div>
        );
    }

        return (
        <div style={{
            backgroundColor: travelTheme.colors.backgroundtwo,
            minHeight: '100vh',
            padding: '40px',
            fontFamily: travelTheme.font,
            position: 'relative',
            overflow: 'hidden'
        }}>

            <div style={{
                position: 'absolute',
                width: '90%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(43,108,176,0.6) 10%, rgba(26,54,93,0.1) 70%)',
                filter: 'blur(60px)',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 0
            }} />

            <div style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '1000px',
                margin: '70px auto',
                backgroundColor: travelTheme.colors.surface,
                padding: '30px',
                borderRadius: travelTheme.radius.large,
                boxShadow: travelTheme.shadow
            }}>
                <h2>User Management Control</h2>

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
        </div>
    );
};

export default AdminDashboard;