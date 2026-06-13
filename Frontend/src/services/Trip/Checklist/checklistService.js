import apiClient from '../../apiClient'; 
import { createChecklistRequestModel } from '../../../models/checklistModels'; 

export const checklistService = {

    // POST api/trip/{tripId}/checklist
    addChecklistItem: async (tripId, title, token = null) => {
        const dto = createChecklistRequestModel(title);
        const url = `/trip/${tripId}/checklist${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.post(url, dto);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to add checklist item.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while adding checklist item.');
        }
    },

    // GET api/trip/{tripId}/checklist
    getTripChecklist: async (tripId, token = null) => {
        const url = `/trip/${tripId}/checklist${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.get(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to load checklist.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while loading checklist.');
        }
    },

    // PUT api/checklist/{itemId}/toggle
    toggleChecklistItem: async (itemId, token = null) => {
        const url = `/checklist/${itemId}/toggle${token ? `?token=${token}` : ''}`;

        try {
            // Šaljemo prazan body {} jer backend u ChecklistController-u ne očekuje DTO za toggle
            const response = await apiClient.put(url, {});

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to toggle checklist item.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while toggling checklist item.');
        }
    },

    // DELETE api/checklist/{itemId}
    deleteChecklistItem: async (itemId, token = null) => {
        const url = `/checklist/${itemId}${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.delete(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to delete checklist item.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while deleting checklist item.');
        }
    }
};