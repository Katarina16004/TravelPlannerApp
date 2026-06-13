import React, { useEffect, useState } from 'react';
import { checklistService } from '../../../services/Trip/Checklist/checklistService';
import { travelTheme } from '../../../theme/Theme';
import { toast } from 'react-toastify';

import Modal from '../../Common/Modal';
import ConfirmModal from '../../Common/ConfirmModal';

const ChecklistView = ({ tripId, token }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState('');

    const [modalLoading, setModalLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        if (tripId) {
            loadChecklist();
        }
    }, [tripId]);

    const loadChecklist = async () => {
        try {
            setLoading(true);
            const res = await checklistService.getTripChecklist(tripId, token);
            
            if (res.data && Array.isArray(res.data)) {
                setItems(res.data);
            } else if (res.Data && Array.isArray(res.Data)) {
                setItems(res.Data);
            } else {
                setItems([]);
            }
        } catch (e) {
            toast.error(e.message || 'Failed to load checklist items.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateItem = async (e) => {
        if (e) e.preventDefault();

        if (!newItemTitle.trim()) {
            toast.error('Please enter a title for the item.');
            return;
        }

        try {
            setModalLoading(true);
            await checklistService.addChecklistItem(tripId, newItemTitle.trim(), token);
            
            toast.success('Item added!');
            setNewItemTitle('');
            loadChecklist();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleToggle = async (item) => {
        const id = item.id || item.Id;
        try {
            setItems(prev => prev.map(i => {
                const currentId = i.id || i.Id;
                if (currentId === id) {
                    const currentStatus = i.isCompleted ?? i.IsCompleted ?? false;
                    return {
                        ...i,
                        isCompleted: !currentStatus,
                        IsCompleted: !currentStatus
                    };
                }
                return i;
            }));

            await checklistService.toggleChecklistItem(id, token);
        } catch (e) {
            toast.error(e.message || 'Failed to update item.');
            loadChecklist(); 
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            const id = confirmDelete.id || confirmDelete.Id;
            await checklistService.deleteChecklistItem(id, token);

            toast.success('Item removed!');
            setConfirmDelete(null);
            loadChecklist();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const totalCount = items.length;
    const completedCount = items.filter(i => i.isCompleted || i.IsCompleted).length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const sortedItems = [...items].sort((a, b) => {
        const aDone = a.isCompleted || a.IsCompleted || false;
        const bDone = b.isCompleted || b.IsCompleted || false;
        return aDone - bDone;
    });

    return (
        <div style={{ padding: '10px 0' }}>
            
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15
            }}>
                <h2 style={{ margin: 0, color: travelTheme.colors.text }}>
                    Trip Checklist
                </h2>
            </div>

            {totalCount > 0 && (
                <div style={{
                    backgroundColor: travelTheme.colors.surface,
                    border: `1px solid ${travelTheme.colors.border}`,
                    borderRadius: travelTheme.radius.large,
                    padding: '15px',
                    marginBottom: '15px',
                    boxShadow: travelTheme.shadow
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '14px', fontWeight: '600' }}>
                        <span style={{ color: travelTheme.colors.muted }}>Preparation Progress</span>
                        <span style={{ color: progressPercent === 100 ? '#2ecc71' : travelTheme.colors.text }}>
                            {completedCount} of {totalCount} completed ({progressPercent}%)
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ 
                            width: `${progressPercent}%`, 
                            height: '100%', 
                            backgroundColor: progressPercent === 100 ? '#2ecc71' : travelTheme.colors.primary, 
                            transition: 'width 0.4s ease' 
                        }}></div>
                    </div>
                </div>
            )}

            <form onSubmit={handleCreateItem} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    id="quick-add-input"
                    type="text"
                    placeholder="Add item"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    disabled={modalLoading}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: travelTheme.radius.regular,
                        border: `1px solid ${travelTheme.colors.border}`,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        fontSize: '15px',
                        boxSizing: 'border-box'
                    }}
                />
                <button 
                    type="submit" 
                    disabled={modalLoading || !newItemTitle.trim()} 
                    style={{
                        padding: '0 25px',
                        backgroundColor: newItemTitle.trim() ? '#5cb85c' : travelTheme.colors.border,
                        color: 'white',
                        border: 'none',
                        borderRadius: travelTheme.radius.regular,
                        fontWeight: '600',
                        cursor: newItemTitle.trim() ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s'
                    }}
                >
                    {modalLoading ? '...' : 'Save'}
                </button>
            </form>

            {loading ? (
                <div style={{ color: travelTheme.colors.muted, textAlign: 'center', padding: '20px' }}>Loading checklist...</div>
            ) : items.length === 0 ? (
                <div style={{ 
                    color: travelTheme.colors.muted, 
                    textAlign: 'center', 
                    padding: '30px',
                    backgroundColor: travelTheme.colors.surface,
                    border: `1px solid ${travelTheme.colors.border}`,
                    borderRadius: travelTheme.radius.large
                }}>
                    Your checklist is empty. Type above to start adding tasks and essentials!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sortedItems.map((item) => {
                        const id = item.id || item.Id;
                        const title = item.title || item.Title;
                        const isDone = item.isCompleted || item.IsCompleted || false;

                        return (
                            <div
                                key={id}
                                style={{
                                    backgroundColor: isDone ? 'rgba(255,255,255,0.02)' : travelTheme.colors.surface,
                                    border: `1px solid ${isDone ? 'rgba(255,255,255,0.05)' : travelTheme.colors.border}`,
                                    borderRadius: travelTheme.radius.regular,
                                    padding: '14px 16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '15px',
                                    opacity: isDone ? 0.6 : 1,
                                    transition: 'all 0.3s ease',
                                    boxShadow: isDone ? 'none' : travelTheme.shadow
                                }}
                            >
                                <label style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                                    <input
                                        type="checkbox"
                                        checked={isDone}
                                        onChange={() => handleToggle(item)}
                                        style={{ 
                                            width: '20px', 
                                            height: '20px', 
                                            cursor: 'pointer',
                                            accentColor: '#2ecc71'
                                        }}
                                    />
                                    <span style={{ 
                                        color: isDone ? travelTheme.colors.muted : travelTheme.colors.text,
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        fontSize: '16px',
                                        fontWeight: isDone ? '400' : '500',
                                        transition: 'all 0.2s'
                                    }}>
                                        {title}
                                    </span>
                                </label>

                                <button
                                    onClick={() => setConfirmDelete(item)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: travelTheme.colors.danger,
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(217, 83, 79, 0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'none'}
                                    title="Delete item"
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete Checklist Item"
                message={`Are you sure you want to remove "${confirmDelete?.title || confirmDelete?.Title}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ChecklistView;