import React from 'react';
import { travelTheme } from '../../theme/Theme';

const TripCards = ({ trips, onView, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
        }}>
            {trips.length === 0 ? (
                <div style={{ color: travelTheme.colors.muted }}>
                    You don't have any trips yet.
                </div>
            ) : (
                trips.map((trip) => (
                    <div
                        key={trip.id || trip.Id}
                        style={{
                            backgroundColor: travelTheme.colors.surface,
                            border: `1px solid ${travelTheme.colors.border}`,
                            borderRadius: travelTheme.radius.large,
                            padding: '18px',
                            boxShadow: travelTheme.shadow,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        <h3 style={{ margin: 0, color: travelTheme.colors.text }}>
                            {trip.name || trip.Name}
                        </h3>

                        <p style={{ margin: 0, color: travelTheme.colors.muted, fontSize: '13px' }}>
                            {formatDate(trip.startDate || trip.StartDate)} →{' '}
                            {formatDate(trip.endDate || trip.EndDate)}
                        </p>

                        <div style={{ fontWeight: '600', color: travelTheme.colors.secondary }}>
                            ${trip.budget ?? trip.Budget}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button
                                onClick={() => onView?.(trip)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: travelTheme.colors.primary,
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                View
                            </button>

                            <button
                                onClick={() => onEdit?.(trip)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: travelTheme.colors.secondary,
                                    fontWeight: '600',
                                    cursor: 'pointer'
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
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TripCards;