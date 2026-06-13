import { ShareAccessType } from '../enums/shareAccessType';

export const createTripShareRequestModel = (tripId, accessType, expiresInDays, email) => ({
    TripId: tripId,
    AccessType: accessType ? parseInt(accessType) : ShareAccessType.View,
    ExpiresInDays: expiresInDays ? parseInt(expiresInDays) : 7,
    Email: email || ''
});