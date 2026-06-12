import React from 'react';
import { travelTheme } from '../../../theme/Theme';

const DestinationList = ({ destinations, onEdit, onDelete, onViewActivities }) => {

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {destinations.length === 0 ? (
                <div style={{ color: travelTheme.colors.muted, textAlign: 'center', padding: '20px' }}>
                    No destinations planned for this trip yet.
                </div>
            ) : (
                destinations.map((dest) => (
                    <div
                        key={dest.id || dest.Id}
                        style={{
                            backgroundColor: travelTheme.colors.surface,
                            border: `1px solid ${travelTheme.colors.border}`,
                            borderRadius: travelTheme.radius.large,
                            padding: '16px',
                            boxShadow: travelTheme.shadow,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <h4 style={{ margin: 0, color: travelTheme.colors.text, fontSize: '18px' }}>
                                {dest.name || dest.Name} —{' '}
                                <span style={{ fontWeight: '400', fontSize: '15px', color: travelTheme.colors.muted }}>
                                    {dest.location || dest.Location}
                                </span>
                            </h4>

                            <p style={{ margin: 0, color: travelTheme.colors.secondary, fontSize: '13px', fontWeight: '500' }}>
                                {formatDate(dest.arrivalDate || dest.ArrivalDate)} → {formatDate(dest.departureDate || dest.DepartureDate)}
                            </p>

                            {(dest.description || dest.Description) && (
                                <p style={{ margin: '5px 0 0 0', color: travelTheme.colors.muted, fontSize: '14px' }}>
                                    {dest.description || dest.Description}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => onViewActivities?.(dest)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: travelTheme.colors.secondary,
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Activities
                        </button>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => onEdit?.(dest)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: travelTheme.colors.primary,
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete?.(dest)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: travelTheme.colors.danger,
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '14px'
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

export default DestinationList;