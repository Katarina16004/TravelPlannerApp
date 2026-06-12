import React, { useState } from 'react';
import InputField from '../../Common/InputField';
import { travelTheme } from '../../../theme/Theme';
import { ActivityStatus } from '../../../enums/activityStatus';

const ActivityForm = ({
    onSubmit,
    loading,
    initialData = null,
    onDelete
}) => {

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

    const isUnchanged =
        initialData &&
        name === (initialData.name || initialData.Name || '') &&
        location === (initialData.location || initialData.Location || '') &&
        description === (initialData.description || initialData.Description || '') &&
        startTime === (
            initialData.startTime
                ? formatDateTime(initialData.startTime)
                : initialData.StartTime
                ? formatDateTime(initialData.StartTime)
                : ''
        ) &&
        endTime === (
            initialData.endTime
                ? formatDateTime(initialData.endTime)
                : initialData.EndTime
                ? formatDateTime(initialData.EndTime)
                : ''
        ) &&
        Number(cost) === Number(initialData.cost || initialData.Cost || 0) &&
        Number(status) === Number(initialData.status || initialData.Status || ActivityStatus.Planned);

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12
            }}
        >

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12
            }}>
                <InputField
                    label="Activity Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <InputField
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            <InputField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <InputField
                        label="Estimated Cost (€)"
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />

                    <label style={{ fontWeight: 600, fontSize: 13, marginLeft:10, marginBottom: -2, color: travelTheme.colors.text }}>
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) => setStatus(Number(e.target.value))}
                        style={{
                            height: 42,
                            borderRadius: travelTheme.radius.regular,
                            border: `1px solid ${travelTheme.colors.border}`,
                            padding: 8,
                            background: travelTheme.colors.surface,
                            marginLeft: 8, 
                            color: travelTheme.colors.text 
                        }}
                    >
                        <option value={ActivityStatus.Planned}>Planned</option>
                        <option value={ActivityStatus.Reserved}>Reserved</option>
                        <option value={ActivityStatus.Completed}>Completed</option>
                        <option value={ActivityStatus.Canceled}>Cancelled</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>

                <button
                    type="submit"
                    disabled={loading || isUnchanged}
                    style={{
                        flex: 1,
                        padding: 12,
                        background: loading || isUnchanged
                            ? '#aaa'
                            : travelTheme.colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: loading || isUnchanged ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading
                        ? 'Saving...'
                        : initialData
                        ? 'Update Activity'
                        : 'Add Activity'}
                </button>

                {initialData && onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        style={{
                            padding: 12,
                            background: travelTheme.colors.danger,
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>

        </form>
    );
};

export default ActivityForm;