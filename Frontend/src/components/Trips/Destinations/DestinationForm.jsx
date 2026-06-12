import React, { useState } from 'react';
import InputField from '../../Common/InputField';
import { travelTheme } from '../../../theme/Theme';

const DestinationForm = ({ onSubmit, loading, initialData = null }) => {
    const [name, setName] = useState(initialData?.name || initialData?.Name || '');
    const [location, setLocation] = useState(initialData?.location || initialData?.Location || '');
    const [arrivalDate, setArrivalDate] = useState(initialData?.arrivalDate ? initialData.arrivalDate.split('T')[0] : initialData?.ArrivalDate ? initialData.ArrivalDate.split('T')[0] : '');
    const [departureDate, setDepartureDate] = useState(initialData?.departureDate ? initialData.departureDate.split('T')[0] : initialData?.DepartureDate ? initialData.DepartureDate.split('T')[0] : '');
    const [description, setDescription] = useState(initialData?.description || initialData?.Description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            location,
            arrivalDate,
            departureDate,
            description
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputField
                label="Destination Name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
            />

            <InputField
                label="Location (City, Country)"
                type="text"
                value={location}
                required
                onChange={(e) => setLocation(e.target.value)}
            />

            <InputField
                label="Arrival Date"
                type="date"
                value={arrivalDate}
                required
                onChange={(e) => setArrivalDate(e.target.value)}
            />

            <InputField
                label="Departure Date"
                type="date"
                value={departureDate}
                required
                onChange={(e) => setDepartureDate(e.target.value)}
            />

            <InputField
                label="Description / Notes"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                {loading 
                    ? 'Saving...' 
                    : initialData 
                        ? 'Update Destination' 
                        : 'Add Destination'
                }
            </button>
        </form>
    );
};

export default DestinationForm;