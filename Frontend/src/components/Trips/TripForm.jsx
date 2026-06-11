import React, { useState } from 'react';
import InputField from '../Common/InputField';
import { travelTheme } from '../../theme/Theme';

const TripForm = ({onSubmit,loading,initialData = null}) => {

    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [startDate, setStartDate] = useState(initialData?.startDate ? initialData.startDate.split('T')[0] : '' );
    const [endDate, setEndDate] = useState(initialData?.endDate ? initialData.endDate.split('T')[0] : '' );
    const [budget, setBudget] = useState(initialData?.budget || 0);
    const [note, setNote] = useState(initialData?.note || '');

    const handleSubmit = (e) => { 
        e.preventDefault();

        onSubmit({
            name,
            description,
            startDate,
            endDate,
            budget: Number(budget),
            note
        });
    };

    return (
        <form onSubmit={handleSubmit}>

            <InputField
                label="Trip Name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
            />

            <InputField
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <InputField
                label="Start Date"
                type="date"
                value={startDate}
                required
                onChange={(e) => setStartDate(e.target.value)}
            />

            <InputField
                label="End Date"
                type="date"
                value={endDate}
                required
                onChange={(e) => setEndDate(e.target.value)}
            />

            <InputField
                label="Budget (€)"
                type="number"
                value={budget}
                required
                onChange={(e) => setBudget(e.target.value)}
            />

            <InputField
                label="Note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: travelTheme.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: travelTheme.radius.regular,
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '10px'
                }}
            >
                {
                    loading
                        ? 'Saving Trip...'
                        : initialData
                            ? 'Update Trip'
                            : 'Create Trip'
                }
            </button>

        </form>
    );
};

export default TripForm;