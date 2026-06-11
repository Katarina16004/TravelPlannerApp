import React from 'react';
import { travelTheme } from '../../theme/Theme';

const UsersTable = ({ users, currentUserId, onDelete, onEdit }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontFamily: travelTheme.font
                }}
            >
                <thead>
                    <tr
                        style={{
                            borderBottom: `2px solid ${travelTheme.colors.border}`,
                            color: travelTheme.colors.text
                        }}
                    >
                        <th style={{ padding: '12px', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '12px', fontWeight: '600' }}>Email Address</th>
                        <th style={{ padding: '12px', fontWeight: '600' }}>System Role</th>
                        <th style={{ padding: '12px', fontWeight: '600' }}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: travelTheme.colors.muted
                                }}
                            >
                                No users found in the system.
                            </td>
                        </tr>
                    ) : (
                        users.map((u) => {
                            const isMe = String(u.id) === String(currentUserId);

                            return (
                                <tr
                                    key={u.id}
                                    style={{
                                        borderBottom: `1px solid ${travelTheme.colors.border}`,
                                        color: travelTheme.colors.text
                                    }}
                                >
                                    <td style={{ padding: '12px', fontWeight: '500' }}>
                                        {u.name}
                                    </td>

                                    <td style={{ padding: '12px', color: travelTheme.colors.text }}>
                                        {u.email}
                                    </td>

                                    <td style={{ padding: '12px' }}>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    u.role === 'Admin'
                                                        ? 'rgba(214, 158, 46, 0.15)'
                                                        : 'rgba(43, 108, 176, 0.1)',
                                                color:
                                                    u.role === 'Admin'
                                                        ? travelTheme.colors.accent
                                                        : travelTheme.colors.secondary,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {u.role}
                                        </span>
                                    </td>

                                    <td style={{ padding: '12px' }}>
                                        {!isMe && (
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    onClick={() => onEdit(u)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: travelTheme.colors.secondary,
                                                        cursor: 'pointer',
                                                        fontWeight: '500',
                                                        padding: 0
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => onDelete(u.id, u.name)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: travelTheme.colors.danger,
                                                        cursor: 'pointer',
                                                        fontWeight: '500',
                                                        padding: 0
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;