import apiClient from '../../apiClient';
import { createExpenseRequestModel } from '../../../models/expenseModels'; 

export const expenseService = {

    // POST api/trip/{tripId}/expenses
    addExpense: async (
        tripId,
        { title, amount, category, currency, date, description },
        token = null
    ) => {
        const dto = createExpenseRequestModel(
            title,
            amount,
            category,
            currency,
            date,
            description
        );

        const url = `/trip/${tripId}/expenses${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.post(url, dto);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to add expense.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while adding expense.');
        }
    },

    // GET api/trip/{tripId}/expenses
    getTripExpenses: async (tripId, token = null) => {
        const url = `/trip/${tripId}/expenses${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.get(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to load expenses.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while loading expenses.');
        }
    },

    // GET api/trip/{tripId}/budget-summary
    getBudgetSummary: async (tripId, token = null) => {
        const url = `/trip/${tripId}/budget-summary${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.get(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to load budget summary.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while loading budget summary.');
        }
    },

    // DELETE api/expenses/{id}
    deleteExpense: async (expenseId, token = null) => {
        const url = `/expenses/${expenseId}${token ? `?token=${token}` : ''}`;

        try {
            const response = await apiClient.delete(url);

            if (response.data && response.data.success)
                return response.data;

            throw new Error(response.data.message || 'Failed to delete expense.');
        } catch (error) {
            const serverError = error.response?.data?.message || error.message;
            throw new Error(serverError || 'An error occurred while deleting expense.');
        }
    }
};