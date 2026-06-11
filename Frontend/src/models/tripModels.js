// TripCreateDTO
export const createTripCreateRequestModel = (name, description, startDate, endDate, budget, note) => ({
    Name: name || '',
    Description: description || '',
    StartDate: startDate,
    EndDate: endDate,
    Budget: budget || 0,
    Note: note || null
});

// TripUpdateDTO
export const createTripUpdateRequestModel = (name, description, startDate, endDate, budget, note) => ({
    Name: name || '',
    Description: description || '',
    StartDate: startDate,
    EndDate: endDate,
    Budget: budget || 0,
    Note: note || null
});