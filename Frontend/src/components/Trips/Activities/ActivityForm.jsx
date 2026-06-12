import React, { useState } from 'react';
import InputField from '../../Common/InputField';
import { travelTheme } from '../../../theme/Theme';
import { ActivityStatus } from '../../../enums/activityStatus';

const ActivityForm = ({ onSubmit, loading, initialData = null }) => {
    const [name, setName] = useState(initialData?.name || initialData?.Name || '');
    const [location, setLocation] = useState(initialData?.location || initialData?.Location || '');
    const [description, setDescription] = useState(initialData?.description || initialData?.Description || '');

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .substring(0, 16);
    };

    const [startTime, setStartTime] = useState(
        initialData?.startTime
            ? formatDateTime(initialData.startTime)
            : initialData?.StartTime
            ? formatDateTime(initialData.StartTime)
            : ''
    );

    const [endTime, setEndTime] = useState(
        initialData?.endTime
            ? formatDateTime(initialData.endTime)
            : initialData?.EndTime
            ? formatDateTime(initialData.EndTime)
            : ''
    );

    const [cost, setCost] = useState(initialData?.cost || initialData?.Cost || 0);
    const [status, setStatus] = useState(
        initialData?.status || initialData?.Status || ActivityStatus.Planned
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            location,
            description,
            startTime,
            endTime,
            cost: Number(cost),
            status: Number(status)
        });
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <InputField label="Activity Name" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <InputField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InputField
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />

                <InputField
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>

            <div style={gridStyle}>
                <InputField
                    label="Estimated Cost (€)"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label
                        style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            marginBottom: '2px',
                            color: travelTheme.colors.text
                        }}
                    >
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) => setStatus(Number(e.target.value))}
                        style={{
                            width: '100%',
                            height: '40px',
                            padding: '10px 12px',
                            borderRadius: travelTheme.radius.regular,
                            border: `1px solid ${travelTheme.colors.border}`,
                            fontSize: '14px',
                            backgroundColor: travelTheme.colors.surface,
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value={ActivityStatus.Planned}>Planned</option>
                        <option value={ActivityStatus.Reserved}>Reserved</option>
                        <option value={ActivityStatus.Completed}>Completed</option>
                        <option value={ActivityStatus.Canceled}>Cancelled</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    marginTop: '6px',
                    backgroundColor: travelTheme.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: travelTheme.radius.regular,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading
                    ? 'Saving...'
                    : initialData
                    ? 'Update Activity'
                    : 'Add Activity'}
            </button>
        </form>
    );
};

export default ActivityForm;