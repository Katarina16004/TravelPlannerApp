import apiClient from '../../apiClient';
import { createActivityRequestModel } from '../../../models/activityModels';

export const activityService = {

    // POST api/destination/{destinationId}/activities
    addActivity: async (
        destinationId,
        { name, description, location, startTime, endTime, cost, status },
        token = null
    ) => {
        const dto = createActivityRequestModel(
            name,
            description,
            location,
            startTime,
            endTime,
            cost,
            status
        );

        const url = `/destination/${destinationId}/activities${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.post(url, dto);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to add activity.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while adding activity.');
        }
    },

    // GET api/destination/{destinationId}/activities
    getDestinationActivities: async (destinationId, token = null) => {
        const url = `/destination/${destinationId}/activities${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.get(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to load activities.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while loading activities.');
        }
    },

    // PUT api/activities/{id}
    updateActivity: async (
        activityId,
        { name, description, location, startTime, endTime, cost, status },
        token = null
    ) => {
        const dto = createActivityRequestModel(
            name,
            description,
            location,
            startTime,
            endTime,
            cost,
            status
        );

        const url = `/activities/${activityId}${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.put(url, dto);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to update activity.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while updating activity.');
        }
    },

    // DELETE api/activities/{id}
    deleteActivity: async (activityId, token = null) => {
        const url = `/activities/${activityId}${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.delete(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to delete activity.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while deleting activity.');
        }
    }
};