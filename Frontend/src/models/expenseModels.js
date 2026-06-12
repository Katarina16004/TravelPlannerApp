import { ExpenseCategory } from '../enums/expenseCategory';

// ExpenseCreateDTO / ExpenseUpdateDTO
export const createExpenseRequestModel = (title, amount, category, currency, date, description) => ({
    Title: title || '',
    Amount: amount || 0,
    Category: category || ExpenseCategory.Other, 
    Currency: 'EUR',
    Date: date,
    Description: description || ''
});