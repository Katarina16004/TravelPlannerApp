import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/Trip/tripService';
import { travelTheme } from '../../theme/Theme';
import { toast } from 'react-toastify';
import TripTable from '../../components/Trips/TripsTable';
import loginBg from '../../assets/travel-bg.jpg';

const AdminTrips = () => {
    const [allTrips, setAllTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadAllUsersTrips();
    }, []);

    const loadAllUsersTrips = async () => {
        try {
            setLoading(true);
            const response = await tripService.getAllTripsAdmin();
            setAllTrips(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to load all system trips.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewTrip = (trip) => {
        const tripId = trip.id || trip.Id;
        navigate(`/trips/${tripId}`);
    };

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
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(26, 54, 93, 0.1)'
                }} />
                <h2 style={{ position: 'relative', zIndex: 2 }}>
                    Loading all system trips...
                </h2>
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
                maxWidth: '1100px',
                width: '100%',
                marginTop: '30px',
                padding: '30px',
                backgroundColor: travelTheme.colors.surface,
                border: `1px solid ${travelTheme.colors.border}`,
                borderRadius: travelTheme.radius.large,
                boxShadow: travelTheme.shadow,
                position: 'relative',
                zIndex: 2
            }}>

                <h2 style={{
                    color: travelTheme.colors.text,
                    fontSize: '26px',
                    fontWeight: '700',
                    marginBottom: '20px'
                }}>
                    Trips management control
                </h2>

                <TripTable
                    trips={allTrips}
                    isAdmin={true}
                    onView={handleViewTrip}
                    onEdit={(trip) => setEditingTrip(trip)}
                    onDelete={(trip) => setConfirmDelete(trip)}
                />
            </div>
        </div>
    );
};

export default AdminTrips;