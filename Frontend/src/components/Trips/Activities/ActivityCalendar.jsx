import React from 'react';
import { getActivityStatusColor } from '../../../enums/activityStatus';

const ActivityCalendar = ({ activities, onEdit, onDelete }) => {

    const grouped = activities.reduce((acc, act) => {
        const date = new Date(act.startTime || act.StartTime).toDateString();

        if (!acc[date]) acc[date] = [];
        acc[date].push(act);

        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {Object.keys(grouped).length === 0 && (
                <div style={{ color: '#888' }}>
                    No activities planned.
                </div>
            )}

            {Object.entries(grouped).map(([date, acts]) => (
                <div key={date}>
                    <h3 style={{ marginBottom: 10 }}>{date}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {acts.map(a => (
                            <div
                                key={a.id || a.Id}
                                style={{
                                    borderLeft: `4px solid ${getActivityStatusColor(a.status || a.Status)}`,
                                    padding: 10,
                                    background: '#fff',
                                    borderRadius: 6,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <strong>{a.name || a.Name}</strong>
                                    <div>{a.location || a.Location}</div>
                                    <div>
                                        {new Date(a.startTime || a.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                        {new Date(a.endTime || a.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div>{a.cost || a.Cost} €</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => onEdit?.(a)}
                                        style={{ background: 'none', border: 'none', color: '#0275d8', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(a)}
                                        style={{ background: 'none', border: 'none', color: '#d9534f', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityCalendar;