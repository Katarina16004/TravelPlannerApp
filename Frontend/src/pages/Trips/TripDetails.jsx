import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { destinationService } from '../../services/Trip/Destination/destinationService';
import { tripService } from '../../services/Trip/tripService'; 
import { travelTheme } from '../../theme/Theme';
import { toast } from 'react-toastify';

import Modal from '../../components/Common/Modal';
import ConfirmModal from '../../components/Common/ConfirmModal';
import DestinationForm from '../../components/Trips/Destinations/DestinationForm';
import DestinationList from '../../components/Trips/Destinations/DestinationList';
import ActivitiesView from '../../components/Trips/Activities/ActivitiesView';
import ExpensesView from '../../components/Trips/Expenses/ExpensesView';
import ChecklistView from '../../components/Trips/Checklist/ChecklistView';
import ShareView from '../../components/Trips/TripShare/TripShareView'; 

import DownloadTripPdfButton from '../../components/Trips/DownloadTripPdf'; 

import loginBg from '../../assets/travel-bg.jpg';

const TripDetails = () => {
    const { tripId } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false); 

    const [activeTab, setActiveTab] = useState('destinations');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);

    useEffect(() => {
        if (tripId) {
            loadDestinations();
            checkIfOwner(); 
        }
    }, [tripId]);

    const checkIfOwner = async () => {
        if (token) {
            setIsOwner(false);
            return;
        }
        try {
            const response = await tripService.getUserTrips();
            if (response && response.success) {
                const userTrips = response.data || [];
                const ownsTrip = userTrips.some(t => (t.id || t.Id) === tripId);
                setIsOwner(ownsTrip);
            }
        } catch (error) {
            console.error("Greška pri proveri vlasništva:", error);
            setIsOwner(false);
        }
    };

    const loadDestinations = async () => {
        try {
            setLoading(true);
            const response = await destinationService.getTripDestinations(tripId, token);
            setDestinations(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to load destinations.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewActivities = (dest) => {
        setSelectedDestination(dest);
        setActiveTab('activities'); 
    };

    const handleFormSubmit = async (formData) => {
        try {
            setModalLoading(true);

            if (editingDestination) {
                if(!formData.name.trim()) {
                    toast.error('Destination name is required.');
                    return;
                }
                if (!formData.location.trim()) {
                    toast.error('Location is required.');
                    return;
                }
                if (!formData.arrivalDate.trim()) {
                    toast.error('Arrival date is required.');
                    return;
                }
                if (!formData.departureDate.trim()) {
                    toast.error('Departure date is required.');
                    return;
                }
                const destId = editingDestination.id || editingDestination.Id;
                await destinationService.updateDestination(destId, formData, token);
                toast.success('Destination updated successfully!');
            } else {
                if(!formData.name.trim()) {
                    toast.error('Destination name is required.');
                    return;
                }
                if (!formData.location.trim()) {
                    toast.error('Location is required.');
                    return;
                }
                if (!formData.arrivalDate.trim()) {
                    toast.error('Arrival date is required.');
                    return;
                }
                if (!formData.departureDate.trim()) {
                    toast.error('Departure date is required.');
                    return;
                }
                await destinationService.addDestination(tripId, formData, token);
                toast.success('Destination added successfully!');
            }

            setIsModalOpen(false);
            setEditingDestination(null);
            loadDestinations();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteClick = (dest) => {
        setConfirmDelete(dest);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;

        try {
            const id = confirmDelete.id || confirmDelete.Id;
            await destinationService.deleteDestination(id, token);
            toast.success('Destination deleted.');
            setConfirmDelete(null);
            loadDestinations();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openEditModal = (dest) => {
        setEditingDestination(dest);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingDestination(null);
        setIsModalOpen(true);
    };

    const tabStyle = (tabId) => ({
        padding: '10px 20px',
        backgroundColor: activeTab === tabId
            ? travelTheme.colors.primary
            : 'rgba(255,255,255,0.1)',
        color: 'white',
        border: 'none',
        borderRadius: travelTheme.radius.regular,
        cursor: 'pointer',
        fontWeight: activeTab === tabId ? '700' : '500'
    });

    return (
        <div style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '40px',
            fontFamily: travelTheme.font,
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(26, 54, 93, 0.2)',
                zIndex: 1
            }} />

            <div style={{
                width: '900px',
                maxWidth: '95%',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <button onClick={() => { setSelectedDestination(null); setActiveTab('destinations'); }} style={tabStyle('destinations')}>
                        Destinations
                    </button>
                    
                    <button onClick={() => setActiveTab('expenses')} style={tabStyle('expenses')}>
                        Expenses
                    </button>

                    <button onClick={() => setActiveTab('checklist')} style={tabStyle('checklist')}>
                        Checklist
                    </button>

                    {isOwner && (
                        <button onClick={() => setActiveTab('share')} style={tabStyle('share')}>
                            Share Trip
                        </button>
                    )}

                    <DownloadTripPdfButton tripId={tripId} token={token} />
                </div>
                

                {activeTab === 'destinations' && (
                    <div style={{
                        backgroundColor: travelTheme.colors.surface,
                        borderRadius: travelTheme.radius.large,
                        border: `1px solid ${travelTheme.colors.border}`,
                        boxShadow: travelTheme.shadow,
                        padding: '30px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '25px'
                        }}>
                            <h2 style={{ margin: 0, color: travelTheme.colors.text }}>
                                Trip Destinations
                            </h2> 

                            <button
                                onClick={openCreateModal}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: travelTheme.colors.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: travelTheme.radius.regular,
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                + Add Destination
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', color: travelTheme.colors.muted }}>
                                Loading roadmap...
                            </div>
                        ) : (
                            <DestinationList
                                destinations={destinations}
                                onEdit={openEditModal}
                                onDelete={handleDeleteClick}
                                onViewActivities={handleViewActivities}
                            />
                        )}
                    </div>
                )}
                
                {activeTab === 'expenses' && (
                    <div style={{
                        backgroundColor: travelTheme.colors.surface,
                        borderRadius: travelTheme.radius.large,
                        border: `1px solid ${travelTheme.colors.border}`,
                        boxShadow: travelTheme.shadow,
                        padding: '30px'
                    }}>
                        <ExpensesView 
                            tripId={tripId} 
                            token={token} 
                        />
                    </div>
                )}
                {activeTab === 'activities' && selectedDestination && (
                    <div style={{
                        backgroundColor: travelTheme.colors.surface,
                        borderRadius: travelTheme.radius.large,
                        border: `1px solid ${travelTheme.colors.border}`,
                        boxShadow: travelTheme.shadow,
                        padding: '30px'
                    }}>
                        <button 
                            onClick={() => {
                                setSelectedDestination(null);
                                setActiveTab('destinations');
                            }}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: travelTheme.colors.primary, 
                                cursor: 'pointer', 
                                padding: '0', 
                                marginBottom: '20px',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            &larr; Back to Destinations
                        </button>

                        <ActivitiesView
                            destinations={destinations}
                            selectedDestination={selectedDestination}
                            token={token}
                        />
                    </div>
                    
                )}
                {activeTab === 'checklist' && (
                    <div style={{
                        backgroundColor: travelTheme.colors.surface,
                        borderRadius: travelTheme.radius.large,
                        border: `1px solid ${travelTheme.colors.border}`,
                        boxShadow: travelTheme.shadow,
                        padding: '30px'
                    }}>
                        <ChecklistView 
                            tripId={tripId} 
                            token={token} 
                        />
                    </div>
                )}

                {activeTab === 'share' && isOwner && (
                    <div style={{
                        backgroundColor: travelTheme.colors.surface,
                        borderRadius: travelTheme.radius.large,
                        border: `1px solid ${travelTheme.colors.border}`,
                        boxShadow: travelTheme.shadow,
                        padding: '30px'
                    }}>
                        <ShareView tripId={tripId} />
                    </div>
                )}
            </div>

            <Modal
                open={isModalOpen}
                title={editingDestination ? "Edit Destination" : "Add Destination"}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingDestination(null);
                }}
            >
                {isModalOpen && (
                    <DestinationForm
                        onSubmit={handleFormSubmit}
                        loading={modalLoading}
                        initialData={editingDestination}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete Destination"
                message={`Are you sure you want to delete "${confirmDelete?.name || confirmDelete?.Name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleConfirmDelete}
                loading={false}
            />

        </div>
    );
};

export default TripDetails;