import apiClient from '../apiClient';
import { createLoginRequestModel, createRegisterRequestModel } from '../../models/authModels';

export const authService = {
    login: async (email, password) => {
        const loginDto = createLoginRequestModel(email, password);

        try {
            // POST api/auth/login
            const response = await apiClient.post('/auth/login', loginDto);
            
            if (response.data && response.data.success) {
                return response.data; // { success, token, role, errorMessage }
            }
            throw new Error(response.data.errorMessage || "Login failed.");
        } catch (error) {
            const serverError = error.response?.data?.errorMessage || error.message;
            throw new Error(serverError || "An error occurred during login.");
        }
    },

    register: async (name, email, password) => {
        const registerDto = createRegisterRequestModel(name, email, password);

        try {
            // POST api/auth/register
            const response = await apiClient.post('/auth/register', registerDto);
            
            if (response.data && response.data.success) {
                return response.data;
            }
            throw new Error(response.data.errorMessage || "Registration failed.");
        } catch (error) {
            const serverError = error.response?.data?.errorMessage || error.message;
            throw new Error(serverError || "An error occurred during registration.");
        }
    }
};