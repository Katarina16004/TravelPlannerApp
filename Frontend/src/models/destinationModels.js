// DestinationCreateDTO / DestinationUpdateDTO
export const createDestinationRequestModel = (name, location, arrivalDate, departureDate, description) => ({
    Name: name || '',
    Location: location || '',
    ArrivalDate: arrivalDate,
    DepartureDate: departureDate,
    Description: description || null
});