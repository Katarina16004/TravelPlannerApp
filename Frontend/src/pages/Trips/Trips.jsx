import React, { useEffect, useState } from 'react';
import { tripService } from '../../services/Trip/tripService';
import { travelTheme } from '../../theme/Theme';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal'; 
import TripForm from '../../components/Trips/TripForm';
import TripCards from '../../components/Trips/TripCards';
import loginBg from '../../assets/travel-bg.jpg'; 

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        try {
            setLoading(true);
            const response = await tripService.getUserTrips();
            setTrips(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load trips.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTripSubmit = async (formData) => {
        if (!formData.name.trim()) {
            toast.error('Trip name is required.');
            return;
        }
        if (!formData.startDate.trim()) {
            toast.error('Start date is required.');
            return;
        }
        if (!formData.endDate.trim()) {
            toast.error('End date is required.');
            return;
        }
        if (formData.budget < 0) {
            toast.error('Budget cannot be negative.');
            return;
        }

        try {
            setCreateLoading(true);

            await tripService.createTrip(
                formData.name, 
                formData.description, 
                formData.startDate, 
                formData.endDate, 
                formData.budget, 
                formData.note
            );

            toast.success('Trip created successfully');
            setIsModalOpen(false); 
            loadTrips();          
        } catch (error) {
            toast.error(error.message);
        } finally {
            setCreateLoading(false);
        }
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
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 54, 93, 0.1)'
                }} />
                <h2 style={{ position: 'relative', zIndex: 2 }}>Loading trips...</h2>
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
                maxWidth: '1000px', 
                width: '100%',
                marginTop: '30px',
                position: 'relative', 
                zIndex: 2 
            }}>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '35px' 
                }}>
                    <div>
                        <h2 style={{ color: '#ffffff', margin: 0, fontSize: '32px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            My Trips
                        </h2>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '12px 26px',
                            backgroundColor: travelTheme.colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: travelTheme.radius.regular,
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        + Create Trip
                    </button>
                </div>
                
                <TripCards trips={trips} />
            </div>

            <Modal 
                open={isModalOpen} 
                title="Plan a new adventure" 
                onClose={() => setIsModalOpen(false)}
            >
                <TripForm 
                    onSubmit={handleCreateTripSubmit} 
                    loading={createLoading} 
                />
            </Modal>
            
        </div>
    );
};

export default Trips;