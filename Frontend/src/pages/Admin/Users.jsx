import React, { useState, useEffect } from 'react';
import { userService } from '../../services/User/userService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { travelTheme } from '../../theme/Theme';

import UsersTable from '../../components/Admin/UsersTable';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
        if (window.confirm(`Delete user ${name}?`)) {
            try {
                const response = await userService.deleteUser(id);

                if (response.success) {
                    toast.success('User deleted.');
                    setUsers(prev => prev.filter(u => u.id !== id));
                }
            } catch (err) {
                toast.error(err.message || 'Delete failed.');
            }
        }
    };

    if (user?.role !== 'Admin') {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <h2 style={{ color: travelTheme.colors.danger }}>Access Denied</h2>
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
            fontFamily: travelTheme.font
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '70px auto',
                backgroundColor: travelTheme.colors.surface,
                padding: '30px',
                borderRadius: travelTheme.radius.large,
                boxShadow: travelTheme.shadow,
                border: `1px solid ${travelTheme.colors.border}`
            }}>
                <h2 style={{ marginBottom: '20px' }}>
                    User Management Control
                </h2>

                <UsersTable
                    users={users}
                    currentUserId={user?.id}
                    onDelete={handleDeleteClick}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;