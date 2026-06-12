import React, { useState } from 'react';
import { ExpenseCategory } from '../../../enums/expenseCategory'; 
import { travelTheme } from '../../../theme/Theme';
import { toast } from 'react-toastify';
import InputField from '../../Common/InputField';

const ExpenseForm = ({ onSubmit, loading }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(String(ExpenseCategory.Other));
    const [currency, setCurrency] = useState('EUR');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error('Expense title cannot be empty.');
            return;
        }

        onSubmit({
            title,
            amount: parseFloat(amount) || 0,
            category: parseInt(category),
            currency,
            date: new Date(date).toISOString(),
            description
        });
    };

    return (
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '350px' }}>
            <InputField
                label="Expense Title"
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dinner at Restaurant"
            />

            <InputField
                label="Amount"
                type="number"
                value={amount}
                required
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
            />

            <div style={{ display: 'flex', flexDirection: 'column', width: '96%',marginLeft: '2%' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', color: travelTheme.colors.text }}>
                    Category
                </label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={selectStyle}
                >
                    <option value={ExpenseCategory.Transport}>Transport</option>
                    <option value={ExpenseCategory.Accommodation}>Accommodation</option>
                    <option value={ExpenseCategory.Food}>Food</option>
                    <option value={ExpenseCategory.Tickets}>Tickets</option>
                    <option value={ExpenseCategory.Shopping}>Shopping</option>
                    <option value={ExpenseCategory.Other}>Other</option>
                </select>
            </div>

            <InputField
                label="Date"
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
            />

            <InputField
                label="Description (Optional)"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add additional details..."
            />

            <button 
                type="submit" 
                disabled={loading} 
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: travelTheme.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: travelTheme.radius.regular,
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '10px'
                }}
            >
                {loading ? 'Saving...' : 'Save Expense'}
            </button>
        </form>
    );
};

const selectStyle = {
    padding: '10px',
    borderRadius: travelTheme.radius.regular,
    border: `1px solid ${travelTheme.colors.border}`,
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none'
};

export default ExpenseForm;