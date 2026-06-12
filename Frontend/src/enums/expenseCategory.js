export const ExpenseCategory = {
    Transport: 1,
    Accommodation: 2,
    Food: 3,
    Tickets: 4,
    Shopping: 5,
    Other: 6
};

export const ExpenseCategoryLabels = {
    1: 'Transport',
    2: 'Accommodation',
    3: 'Food',
    4: 'Tickets',
    5: 'Shopping',
    6: 'Other'
};

export const ExpenseCategoryColors = {
    1: '#0275d8', 
    2: '#5cb85c', 
    3: '#f0ad4e', 
    4: '#9c27b0', 
    5: '#e91e63', 
    6: '#6c757d'  
};

export const getExpenseCategoryLabel = (category) => {
    return ExpenseCategoryLabels[category] || 'Unknown';
};

export const getExpenseCategoryColor = (category) => {
    return ExpenseCategoryColors[category] || '#6c757d';
};