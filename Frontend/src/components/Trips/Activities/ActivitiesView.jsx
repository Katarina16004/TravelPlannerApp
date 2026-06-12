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

    const handleSubmit = async (formData) => {
        try {
            setModalLoading(true);

            const required =
                !formData.name ||
                !formData.startTime ||
                !formData.endTime ||
                !formData.location ||
                !formData.cost;

            if (required) {
                toast.error('Please fill in all required fields (Name, Location, Start Time, End Time, Cost).');
                return;
            }

            if (editingActivity) {
                const id = editingActivity.id || editingActivity.Id;
                await activityService.updateActivity(id, formData, token);
                toast.success('Activity updated!');
            } else {
                await activityService.addActivity(destId, formData, token);
                toast.success('Activity created!');
            }

            setIsModalOpen(false);
            setEditingActivity(null);
            loadActivities();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            const id = confirmDelete.id || confirmDelete.Id;

            await activityService.deleteActivity(id, token);

            toast.success('Activity deleted!');

            setConfirmDelete(null);
            setIsModalOpen(false);
            setEditingActivity(null);

            loadActivities();
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <div style={{ padding: '10px 0' }}>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15
            }}>
                <h2 style={{ margin: 0 }}>
                    Activities — {selectedDestination?.name || selectedDestination?.Name}
                </h2>

                <button
                    onClick={() => {
                        setEditingActivity(null);
                        setIsModalOpen(true);
                    }}
                    style={{
                        padding: '10px 20px',
                        background: '#0275d8',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    + Add Activity
                </button>
            </div>

            {loading ? (
                <div style={{ color: '#888' }}>Loading...</div>
            ) : (
                <ActivityCalendar
                
                    activities={activities}
                    destinationStartDate={selectedDestination?.startDate || selectedDestination?.StartDate}
                    onEdit={(act) => {
                        setEditingActivity(act);
                        setIsModalOpen(true);
                    }}
                    onDelete={(act) => setConfirmDelete(act)}
                />
            )}

            <Modal
                open={isModalOpen}
                title={editingActivity ? "Edit Activity" : "Add Activity"}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingActivity(null);
                }}
            >
                {isModalOpen && (
                    <ActivityForm
                        onSubmit={handleSubmit}
                        loading={modalLoading}
                        initialData={editingActivity}
                        onDelete={
                            editingActivity
                                ? () => setConfirmDelete(editingActivity)
                                : null
                        }
                    />
                )}
            </Modal>

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete Activity"
                message={`Delete "${confirmDelete?.name || confirmDelete?.Name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ActivitiesView;