import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/Trip/tripService';
import { travelTheme } from '../../theme/Theme';
import { toast } from 'react-toastify';
import Modal from '../../components/Common/Modal';
import TripForm from '../../components/Trips/TripForm';
import TripCards from '../../components/Trips/TripCards';
import ConfirmModal from '../../components/Common/ConfirmModal';
import loginBg from '../../assets/travel-bg.jpg';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const [editingTrip, setEditingTrip] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        try {
            setLoading(true);
            const response = await tripService.getUserTrips();
            setTrips(response.data);
        } catch (error) {
            toast.error('Failed to load trips.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewTrip = (trip) => {
        const tripId = trip.id || trip.Id;
        navigate(`/trips/${tripId}`);
    };

    const handleEditTrip = (trip) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (trip) => {
        setConfirmDelete(trip);
    };

    const handleConfirmDelete = async () => {
        try {
            const id = confirmDelete.id || confirmDelete.Id;

            await tripService.deleteTrip(id);

            setTrips(prev => prev.filter(t => (t.id || t.Id) !== id));
            toast.success('Trip deleted');

            setConfirmDelete(null);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setCreateLoading(true);

            if (editingTrip) {
                
                const id = editingTrip.id || editingTrip.Id;

                await tripService.updateTrip(
                    id,
                    formData.name,
                    formData.description,
                    formData.startDate,
                    formData.endDate,
                    formData.budget,
                    formData.note
                );

                toast.success('Trip updated successfully');
            } else {
                if(!formData.name || !formData.startDate || !formData.endDate || !formData.budget) {
                    toast.error('Please fill in all required fields (name, start date, end date, budget).');
                    return;
                }
                await tripService.createTrip(
                    formData.name,
                    formData.description,
                    formData.startDate,
                    formData.endDate,
                    formData.budget,
                    formData.note
                );

                toast.success('Trip created successfully');
            }

            setIsModalOpen(false);
            setEditingTrip(null);
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
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(26, 54, 93, 0.1)'
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
            position: 'relative'
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
                padding: '30px',
                backgroundColor: travelTheme.colors.surface,
                border: `1px solid ${travelTheme.colors.border}`,
                borderRadius: travelTheme.radius.large,
                boxShadow: travelTheme.shadow,
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h2 style={{
                        color: travelTheme.colors.text,
                        margin: 0,
                        fontSize: '26px',
                        fontWeight: '700'
                    }}>
                        My Trips
                    </h2>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: travelTheme.colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: travelTheme.radius.regular,
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        + Create Trip
                    </button>
                </div>

                <TripCards
                    trips={trips}
                    onView={handleViewTrip}
                    onEdit={handleEditTrip}
                    onDelete={handleDeleteClick}
                />
            </div>

            <Modal
                open={isModalOpen}
                title={editingTrip ? "Edit Trip" : "Plan a New Adventure"}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTrip(null);
                }}
            >
                <TripForm
                    onSubmit={handleSubmit}
                    loading={createLoading}
                    initialData={editingTrip}
                />
            </Modal>

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete Trip"
                message={`Are you sure you want to delete ${confirmDelete?.name || confirmDelete?.Name}?`}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleConfirmDelete}
                type="danger"
            />
        </div>
    );
};

export default Trips;