import apiClient from '../apiClient';
import {createTripCreateRequestModel, createTripUpdateRequestModel} from '../../models/tripModels';

export const tripService = {

    // POST api/trip
    createTrip: async (name, description, startDate, endDate, budget, note) => {

        const tripDto = createTripCreateRequestModel(name, description, startDate, endDate, budget, note);

        try {
            const response = await apiClient.post('/trip', tripDto);

            if (response.data && response.data.success) {
                return response.data;
            }

            throw new Error(
                response.data.message || 'Trip creation failed.'
            );
        }
        catch (error) {
            const serverError = error.response?.data?.message || error.message;

            throw new Error(serverError || 'An error occurred while creating trip.');
        }
    },

    // GET api/trip
    getUserTrips: async () => {
        try {
            const response = await apiClient.get('/trip');

            if (response.data && response.data.success) 
            {
                return response.data;
            }

            throw new Error(
                response.data.message || 'Failed to load trips.'
            );
        }
        catch (error) {
            const serverError = error.response?.data?.message || error.message;

            throw new Error(serverError || 'An error occurred while loading trips.');
        }
    },

    // GET api/trip/{id}
    getTripById: async (tripId) => {
        try {
            const response = await apiClient.get(`/trip/${tripId}`);

            if (response.data && response.data.success) 
            {
                return response.data;
            }

            throw new Error(response.data.message || 'Failed to load trip.');
        }
        catch (error) {
            const serverError = error.response?.data?.message || error.message;

            throw new Error(serverError || 'An error occurred while loading trip.');
        }
    },

    // PUT api/trip/{id}
    updateTrip: async (tripId, name, description, startDate, endDate, budget, note) => {

        const tripDto = createTripUpdateRequestModel(name, description, startDate, endDate, budget, note);

        try {
            const response = await apiClient.put(`/trip/${tripId}`, tripDto);

            if (response.data && response.data.success) 
            {
                return response.data;
            }

            throw new Error(response.data.message || 'Trip update failed.');
        }
        catch (error) {
            const serverError = error.response?.data?.message || error.message;

            throw new Error(serverError || 'An error occurred while updating trip.');
        }
    },

    // DELETE api/trip/{id}
    deleteTrip: async (tripId) => {
        try {
            const response = await apiClient.delete(`/trip/${tripId}`);

            if (response.data && response.data.success) 
            {
                return response.data;
            }

            throw new Error(response.data.message || 'Trip deletion failed.');
        }
        catch (error) {
            const serverError = error.response?.data?.message || error.message;

            throw new Error(serverError || 'An error occurred while deleting trip.');
        }
    }
};