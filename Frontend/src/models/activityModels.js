// ActivityCreateDTO / ActivityUpdateDTO
export const createActivityRequestModel = (name, description, location, startTime, endTime, cost, status) => ({
    Name: name || '',
    Description: description || '',
    Location: location || '',
    StartTime: startTime,
    EndTime: endTime,
    Cost: cost || 0,
    Status: status || 1
});