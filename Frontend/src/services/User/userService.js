import apiClient from '../apiClient';
import { createUpdateUserRequestModel } from '../../models/userModels';

export const userService = {
    // GET: api/user/{id} 
    getUserProfile: async (id) => {
        try {
            const response = await apiClient.get(`/user/${id}`);
            if (response.data && response.data.success) {
                return response.data; 
            }
            throw new Error(response.data.message || "Failed to load profile.");
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || "An error occurred while fetching profile.");
        }
    },

    // PUT: api/user/{id} 
    updateUserProfile: async (id, { name, email, currentPassword, newPassword }) => {
        const updateDto = createUpdateUserRequestModel(name, email, currentPassword, newPassword);
        try {
            const response = await apiClient.put(`/user/${id}`, updateDto);
            if (response.data && response.data.success) {
                return response.data; 
            }
            throw new Error(response.data.message || "Failed to update profile.");
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || "An error occurred during profile update.");
        }
    },

    // GET: api/user -> [Authorize(Roles = "Admin")]
    getAllUsers: async () => {
        try {
            const response = await apiClient.get('/user');
            if (response.data && response.data.success) {
                return response.data; 
            }
            throw new Error(response.data.message || "Failed to fetch users.");
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || "An error occurred while fetching all users.");
        }
    },

    // DELETE: api/user/{id} -> [Authorize(Roles = "Admin")]
    deleteUser: async (id) => {
        try {
            const response = await apiClient.delete(`/user/${id}`);
            if (response.data && response.data.success) {
                return response.data; 
            }
            throw new Error(response.data.message || "Failed to delete user.");
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || "An error occurred during user deletion.");
        }
    }
};