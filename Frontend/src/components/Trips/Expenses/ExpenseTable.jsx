import React from 'react';
import moment from 'moment';
import { ExpenseCategoryLabels } from '../../../enums/expenseCategory'; 
import { travelTheme } from '../../../theme/Theme';

const ExpenseTable = ({ expenses, onDelete }) => {
    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: travelTheme.colors.text }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Title</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Amount</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Description</th>
                        <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: travelTheme.colors.muted }}>
                                No expenses recorded for this trip yet.
                            </td>
                        </tr>
                    ) : (
                        expenses.map((exp) => {
                            const catId = exp.category ?? exp.Category;
                            return (
                                <tr key={exp.id || exp.Id}>
                                    <td style={tdStyle}>{exp.title || exp.Title}</td>
                                    <td style={tdStyle}>{ExpenseCategoryLabels[catId] || 'Other'}</td>
                                    <td style={{ ...tdStyle, fontWeight: '600' }}>
                                        -{exp.amount || exp.Amount} {exp.currency || exp.Currency}
                                    </td>
                                    <td style={tdStyle}>
                                        {moment(exp.date || exp.Date).format('YYYY-MM-DD')}
                                    </td>
                                    <td style={tdStyle}>
                                        {exp.description || exp.Description || '/'}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button 
                                            onClick={() => onDelete(exp)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: travelTheme.colors.danger,
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

const thStyle = { 
    textAlign: 'left', 
    padding: '12px', 
    borderBottom: '2px solid rgba(255,255,255,0.1)', 
    color: '#aaa', 
    fontSize: '14px', 
    textTransform: 'uppercase',
    fontWeight: '500'
};

const tdStyle = { 
    padding: '12px', 
    borderBottom: '1px solid rgba(255,255,255,0.05)', 
    fontSize: '15px' 
};

export default ExpenseTable;