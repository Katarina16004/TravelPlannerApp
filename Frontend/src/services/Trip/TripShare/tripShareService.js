import apiClient from '../../apiClient';
import { createTripShareRequestModel } from '../../../models/tripShareModels';

export const tripShareService = {

    // POST api/trip-shares
    createShare: async (
        tripId,
        { accessType, expiresInDays, email },
        token = null
    ) => {
        const dto = createTripShareRequestModel(
            tripId,
            accessType,
            expiresInDays,
            email
        );

        const url = `/trip-shares${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.post(url, dto);

            if (response.data && response.data.success) 
                return response.data;
                
            throw new Error(response.data.message || 'Failed to create share link.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while creating share link.');
        }
    },

    // GET api/trip-shares/trip/{tripId}
    getSharesByTripId: async (tripId, token = null) => {
        const url = `/trip-shares/trip/${tripId}${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.get(url);

            if (response.data && response.data.success) 
                return response.data;
                
            throw new Error(response.data.message || 'Failed to load shares.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while loading shares.');
        }
    },

    // DELETE api/trip-shares/{id}
    revokeShare: async (shareId, token = null) => {
        const url = `/trip-shares/${shareId}${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.delete(url);

            if (response.data && response.data.success) 
                return response.data;
                
            throw new Error(response.data.message || 'Failed to revoke share.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while revoking share.');
        }
    },

    // GET api/trip-shares/access-type/{token}
    getAccessType: async (token) => {
    if (!token) return null;
    try {
        const response = await apiClient.get(`/trip-shares/access-type/${token}`);
        if (response.data && response.data.success) {
            return response.data.data; 
        }
        return null;
    } catch (error) {
        console.error("Greška pri veriﬁkaciji tokena:", error);
        return null;
    }
}
};