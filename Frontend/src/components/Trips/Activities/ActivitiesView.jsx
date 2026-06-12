import React, { useEffect, useState } from 'react';
import { activityService } from '../../../services/Trip/Activity/activityService';
import { toast } from 'react-toastify';
import ActivityCalendar from './ActivityCalendar';
import ActivityForm from './ActivityForm';
import Modal from '../../Common/Modal';
import ConfirmModal from '../../Common/ConfirmModal';

const ActivitiesView = ({ selectedDestination, token }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const destId = selectedDestination?.id || selectedDestination?.Id;

    useEffect(() => {
        if (destId) {
            loadActivities();
        }
    }, [destId]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const res = await activityService.getDestinationActivities(destId, token);

            if (res.data && Array.isArray(res.data)) {
                setActivities(res.data);
            } else {
                setActivities([]);
            }
        } catch (e) {
            toast.error(e.message || 'Failed to load activities.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            setModalLoading(true);
            if (editingActivity) {
                if(!formData.name || !formData.startTime || !formData.endTime || !formData.location || !formData.cost) {
                    toast.error('Please fill in all required fields (Name, Start Time, End Time, Location, Estimated Cost).');
                    return;
                }
                const actId = editingActivity.id || editingActivity.Id;
                await activityService.updateActivity(actId, formData, token);
                toast.success('Activity updated successfully!');
            } else {
                if(!formData.name || !formData.startTime || !formData.endTime || !formData.location || !formData.cost) {
                    toast.error('Please fill in all required fields (Name, Start Time, End Time, Location, Estimated Cost).');
                    return;
                }
                await activityService.addActivity(destId, formData, token);
                toast.success('Activity added successfully!');
            }
            setIsModalOpen(false);
            setEditingActivity(null);
            loadActivities();
        } catch (error) {
            toast.error(error.message || 'An error occurred.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;
        try {
            const id = confirmDelete.id || confirmDelete.Id;
            await activityService.deleteActivity(id, token);
            toast.success('Activity deleted.');
            setConfirmDelete(null);
            loadActivities();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div style={{ padding: '10px 0' }}>
            <div style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>
                    Activities — {selectedDestination?.name || selectedDestination?.Name}
                </h2>
                <button
                    onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0275d8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    + Add Activity
                </button>
            </div>

            {loading ? (
                <div style={{ color: '#888' }}>
                    Loading activities...
                </div>
            ) : (
                <ActivityCalendar 
                    activities={activities} 
                    onEdit={(act) => { setEditingActivity(act); setIsModalOpen(true); }}
                    onDelete={(act) => setConfirmDelete(act)}
                />
            )}

            <Modal
                style={{ marginTop: 40 }}
                open={isModalOpen}
                title={editingActivity ? "Edit Activity" : "Add Activity"}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingActivity(null);
                }}
            >
                {isModalOpen && (
                    <ActivityForm 
                        onSubmit={handleFormSubmit}
                        loading={modalLoading}
                        initialData={editingActivity}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete Activity"
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

export default ActivitiesView;