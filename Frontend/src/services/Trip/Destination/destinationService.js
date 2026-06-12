import apiClient from '../../apiClient';
import { createDestinationRequestModel } from '../../../models/destinationModels';

export const destinationService = {

    // POST api/trip/{tripId}/destinations
    addDestination: async (tripId, { name, location, arrivalDate, departureDate, description }, token = null) => {
        const dto = createDestinationRequestModel(name, location, arrivalDate, departureDate, description);
        const url = `/trip/${tripId}/destinations${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.post(url, dto);
            if (response.data && response.data.success) return response.data;
            throw new Error(response.data.message || 'Failed to add destination.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while adding destination.');
        }
    },

    // GET api/trip/{tripId}/destinations
    getTripDestinations: async (tripId, token = null) => {
        const url = `/trip/${tripId}/destinations${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.get(url);
            if (response.data && response.data.success) return response.data;
            throw new Error(response.data.message || 'Failed to load destinations.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while loading destinations.');
        }
    },

    // PUT api/destinations/{id}
    updateDestination: async (destinationId, { name, location, arrivalDate, departureDate, description }, token = null) => {
        const dto = createDestinationRequestModel(name, location, arrivalDate, departureDate, description);
        const url = `/destinations/${destinationId}${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.put(url, dto);
            if (response.data && response.data.success) return response.data;
            throw new Error(response.data.message || 'Failed to update destination.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while updating destination.');
        }
    },

    // DELETE api/destinations/{id}
    deleteDestination: async (destinationId, token = null) => {
        const url = `/destinations/${destinationId}${token ? `?token=${token}` : ''}`;
        
        try {
            const response = await apiClient.delete(url);
            if (response.data && response.data.success) return response.data;
            throw new Error(response.data.message || 'Failed to delete destination.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while deleting destination.');
        }
    }
};