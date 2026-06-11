import React from 'react';
import { Link } from 'react-router-dom';
import { travelTheme } from '../../theme/Theme';

const TripTable = ({ trips }) => {
    if (trips.length === 0) {
        return (
            <p style={{ color: travelTheme.colors.muted }}>
                No trips found. Start by creating a new adventure!
            </p>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
            {trips.map((trip) => (
                <div
                    key={trip.id}
                    style={{
                        border: `1px solid ${travelTheme.colors.border}`,
                        borderRadius: travelTheme.radius.large,
                        backgroundColor: travelTheme.colors.surface,
                        padding: '20px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}
                >
                    <h3 style={{ margin: '0 0 5px 0', color: travelTheme.colors.text }}>{trip.name}</h3>
                    <p style={{ margin: 0, color: travelTheme.colors.muted, fontSize: '14px' }}>
                        {trip.description}
                    </p>
                    
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: travelTheme.colors.text }}>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>

                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: travelTheme.colors.secondary }}>
                        Budget: {trip.budget}€
                    </p>

                    <Link 
                        to={`/trips/${trip.id}`} 
                        style={{ 
                            marginTop: '10px', 
                            color: travelTheme.colors.primary, 
                            textDecoration: 'none', 
                            fontWeight: '600',
                            fontSize: '14px',
                            width: 'fit-content'
                        }}
                    >
                        View Details →
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TripTable;