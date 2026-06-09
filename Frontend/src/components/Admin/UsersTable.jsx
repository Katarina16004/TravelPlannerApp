import React from 'react';
import { travelTheme } from '../../theme/Theme';

const UsersTable = ({ users, currentUserId, onDelete }) => {

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
                <tr style={{ borderBottom: `2px solid ${travelTheme.colors.border}`, textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: travelTheme.colors.muted, fontWeight: '600' }}>
                        Name
                    </th>
                    <th style={{ padding: '12px 8px', color: travelTheme.colors.muted, fontWeight: '600' }}>
                        Email Address
                    </th>
                    <th style={{ padding: '12px 8px', color: travelTheme.colors.muted, fontWeight: '600' }}>
                        System Role
                    </th>
                    <th style={{ padding: '12px 8px', color: travelTheme.colors.muted, fontWeight: '600', textAlign: 'center' }}>
                        Actions
                    </th>
                </tr>
            </thead>

            <tbody>
                {users.map((u) => {
                    const isMe = String(u.id) === String(currentUserId);
                    
                    return (
                        <tr
                            key={u.id}
                            style={{ borderBottom: `1px solid ${travelTheme.colors.border}` }}
                        >
                            <td style={{ padding: '14px 8px', color: travelTheme.colors.text, fontWeight: '500' }}>
                                {u.name}
                            </td>

                            <td style={{ padding: '14px 8px', color: travelTheme.colors.text }}>
                                {u.email}
                            </td>

                            <td style={{ padding: '14px 8px' }}>
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

                            <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                                {!isMe && (
                                    <button
                                        onClick={() => onDelete(u.id, u.name)}
                                        style={{
                                            backgroundColor: travelTheme.colors.danger,
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: travelTheme.radius.small,
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 5px rgba(229, 62, 62, 0.2)'
                                        }}
                                    >
                                        Delete User
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UsersTable;