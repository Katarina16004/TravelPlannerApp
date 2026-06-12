import React, { useState } from 'react';
import InputField from '../../Common/InputField';
import { travelTheme } from '../../../theme/Theme';
import { ExpenseCategory } from '../../../enums/expenseCategory'; 

const ExpenseForm = ({
    onSubmit,
    loading,
    initialData = null,
    onDelete
}) => {

    const [title, setTitle] = useState(initialData?.title || initialData?.Title || '');
    const [amount, setAmount] = useState(initialData?.amount || initialData?.Amount || '');
    const [currency, setCurrency] = useState(initialData?.currency || initialData?.Currency || 'EUR');
    const [description, setDescription] = useState(initialData?.description || initialData?.Description || '');

    // Pomoćna funkcija za siguran prikaz i formatiranje datuma bez vremenskih pomeraja
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .substring(0, 10); // Uzima samo YYYY-MM-DD deo za input type="date"
    };

    const [date, setDate] = useState(
        initialData?.date
            ? formatDate(initialData.date)
            : initialData?.Date
            ? formatDate(initialData.Date)
            : new Date().toISOString().split('T')[0] // Default je današnji datum ako je novi unos
    );

    const [category, setCategory] = useState(
        initialData?.category || initialData?.Category || ExpenseCategory.Other
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            title,
            amount: Number(amount),
            category: Number(category),
            currency,
            date,
            description
        });
    };

    // Kompleksna provera da li je korisnik napravio bilo kakvu izmenu (isto kao u ActivityForm)
    const isUnchanged =
        initialData &&
        title === (initialData.title || initialData.Title || '') &&
        Number(amount) === Number(initialData.amount || initialData.Amount || 0) &&
        currency === (initialData.currency || initialData.Currency || 'EUR') &&
        description === (initialData.description || initialData.Description || '') &&
        date === (
            initialData.date
                ? formatDate(initialData.date)
                : initialData.Date
                ? formatDate(initialData.Date)
                : ''
        ) &&
        Number(category) === Number(initialData.category || initialData.Category || ExpenseCategory.Other);

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12
            }}
        >
            <InputField
                label="Expense Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12
            }}>
                <InputField
                    label="Amount (€)"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontWeight: 600, fontSize: 13, marginLeft: 10, color: travelTheme.colors.text }}>
                        Currency
                    </label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="RSD">RSD</option>
                    </select>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12
            }}>
                <InputField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontWeight: 600, fontSize: 13, marginLeft: 10, color: travelTheme.colors.text }}>
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(Number(e.target.value))}
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
            </div>

            <InputField
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                    type="submit"
                    disabled={loading || isUnchanged}
                    style={{
                        flex: 1,
                        padding: 12,
                        background: loading || isUnchanged
                            ? '#aaa'
                            : travelTheme.colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: loading || isUnchanged ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading
                        ? 'Saving...'
                        : initialData
                        ? 'Update Expense'
                        : 'Record Expense'}
                </button>

                {initialData && onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        style={{
                            padding: 12,
                            background: travelTheme.colors.danger,
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>
        </form>
    );
};

const selectStyle = {
    height: 42,
    borderRadius: travelTheme.radius.regular,
    border: `1px solid ${travelTheme.colors.border}`,
    padding: 8,
    background: travelTheme.colors.surface,
    marginLeft: 8,
    color: travelTheme.colors.text,
    fontSize: 14
};

export default ExpenseForm;