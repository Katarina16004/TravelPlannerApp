import React from 'react';
import { travelTheme } from '../../theme/Theme';

const TripTable = ({ trips, isAdmin = false, onView, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontFamily: travelTheme.font
            }}>
                <thead>
                    <tr style={{
                        borderBottom: `2px solid ${travelTheme.colors.border}`,
                        color: travelTheme.colors.text
                    }}>
                        {isAdmin && (
                            <th style={{ padding: '12px', fontWeight: '600' }}>
                                User ID
                            </th>
                        )}
                        <th style={{ padding: '12px', fontWeight: '600' }}>
                            Trip Name
                        </th>
                        <th style={{ padding: '12px', fontWeight: '600' }}>
                            Dates
                        </th>
                        <th style={{ padding: '12px', fontWeight: '600' }}>
                            Budget
                        </th>
                        <th style={{ padding: '12px', fontWeight: '600' }}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {trips.length === 0 ? (
                        <tr>
                            <td
                                colSpan={isAdmin ? 5 : 4}
                                style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: travelTheme.colors.muted
                                }}
                            >
                                No trips found in the system.
                            </td>
                        </tr>
                    ) : (
                        trips.map((trip) => (
                            <tr
                                key={trip.id || trip.Id}
                                style={{
                                    borderBottom: `1px solid ${travelTheme.colors.border}`,
                                    color: travelTheme.colors.text
                                }}
                            >
                                {isAdmin && (
                                    <td style={{
                                        padding: '12px',
                                        fontSize: '13px',
                                        color: travelTheme.colors.muted,
                                        fontFamily: 'monospace'
                                    }}>
                                        {trip.userId || trip.UserId || 'System'}
                                    </td>
                                )}

                                <td style={{ padding: '12px', fontWeight: '500' }}>
                                    {trip.name || trip.Name}
                                </td>

                                <td style={{ padding: '12px' }}>
                                    {formatDate(trip.startDate || trip.StartDate)} - {formatDate(trip.endDate || trip.EndDate)}
                                </td>

                                <td style={{ padding: '12px' }}>
                                    ${trip.budget ?? trip.Budget}
                                </td>

                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => onView?.(trip)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: travelTheme.colors.secondary,
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => onEdit?.(trip)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: travelTheme.colors.primary,
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => onDelete?.(trip)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: travelTheme.colors.danger,
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TripTable;