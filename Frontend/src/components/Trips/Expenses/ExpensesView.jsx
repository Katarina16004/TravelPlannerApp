import React, { useEffect, useState } from 'react';
import { expenseService } from '../../../services/Trip/Expense/expenseService'; 
import { travelTheme } from '../../../theme/Theme';
import { toast } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';
import Modal from '../../Common/Modal';
import ConfirmModal from '../../Common/ConfirmModal';

const ExpensesView = ({ tripId, token }) => {
    const [expenses, setExpenses] = useState([]);
    const [budgetSummary, setBudgetSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false); 
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        if (tripId) {
            loadExpenseData();
        }
    }, [tripId]);

    const loadExpenseData = async () => {
        try {
            setLoading(true);
            
            const expensesRes = await expenseService.getTripExpenses(tripId, token);
            setExpenses(expensesRes.data || []);
            await new Promise(resolve => setTimeout(resolve, 300));

            const budgetRes = await expenseService.getBudgetSummary(tripId, token);
            setBudgetSummary(budgetRes.data || null);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to load expense data.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if(!formData.amount || formData.amount <= 0) {
                toast.error('Please enter a valid amount greater than 0.');
                return;
            }
            setModalLoading(true);
            await expenseService.addExpense(tripId, formData, token);
            toast.success('Expense recorded successfully!');
            setIsModalOpen(false);
            loadExpenseData(); 
        } catch (error) {
            toast.error(error.message || 'Error saving expense.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;
        try {
            setDeleteLoading(true); 
            const expenseId = confirmDelete.id || confirmDelete.Id;
            
            await expenseService.deleteExpense(expenseId, token);
            toast.success('Expense deleted successfully.');
            
            setConfirmDelete(null);
            loadExpenseData();
        } catch (error) {
            toast.error(error.message || 'Failed to delete expense.');
        } finally {
            setDeleteLoading(false); 
        }
    };

    const budgetVal = budgetSummary?.budget ?? budgetSummary?.Budget ?? 0;
    const totalSpentVal = budgetSummary?.totalSpent ?? budgetSummary?.TotalSpent ?? 0;
    const remainingVal = budgetSummary?.remaining ?? budgetSummary?.Remaining ?? 0;
    const isOver = budgetSummary?.isOverBudget ?? budgetSummary?.IsOverBudget ?? false;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: travelTheme.colors.text }}>Trip Expenses</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: travelTheme.colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: travelTheme.radius.regular,
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    + Add Expense
                </button>
            </div>

            {budgetSummary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    <div style={statBoxStyle}>
                        <span style={statLabelStyle}>Total Budget</span>
                        <span style={statValueStyle}>{budgetVal} EUR</span>
                    </div>
                    <div style={statBoxStyle}>
                        <span style={statLabelStyle}>Total Spent</span>
                        <span style={{ ...statValueStyle, color: travelTheme.colors.danger }}>-{totalSpentVal} EUR</span>
                    </div>
                    <div style={statBoxStyle}>
                        <span style={statLabelStyle}>Remaining</span>
                        <span style={{ 
                            ...statValueStyle, 
                            color: isOver ? travelTheme.colors.danger : '#2ecc71' 
                        }}>
                            {remainingVal} EUR
                        </span>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', color: travelTheme.colors.muted, padding: '20px' }}>
                    Loading expenses...
                </div>
            ) : (
                <ExpenseTable 
                    expenses={expenses} 
                    onDelete={(exp) => setConfirmDelete(exp)} 
                />
            )}

            <Modal
                open={isModalOpen}
                title="Add Expense"
                onClose={() => setIsModalOpen(false)}
            >
                {isModalOpen && (
                    <ExpenseForm
                        onSubmit={handleFormSubmit}
                        loading={modalLoading}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={!!confirmDelete}
                title="Delete Expense"
                message={`Are you sure you want to delete expense "${confirmDelete?.title || confirmDelete?.Title}"?`}
                confirmText={deleteLoading ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                type="danger"
                onCancel={() => setConfirmDelete(null)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading} 
            />
        </div>
    );
};

const statBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '15px',
    backgroundColor: travelTheme.colors.surface,
    border: `1px solid ${travelTheme.colors.border}`,
    borderRadius: travelTheme.radius.large,
    boxShadow: travelTheme.shadow,
    textAlign: 'center'
};
const statLabelStyle = { fontSize: '12px', fontWeight: '600', color: travelTheme.colors.muted, textTransform: 'uppercase' };
const statValueStyle = { fontSize: '18px', fontWeight: '700', color: travelTheme.colors.text };

export default ExpensesView;