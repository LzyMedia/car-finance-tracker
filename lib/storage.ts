// Local storage utilities for data persistence
import { SavingsGoal, Transaction, Budget } from '@/types';

const STORAGE_KEYS = {
  GOALS: 'jdm_savings_goals',
  TRANSACTIONS: 'jdm_transactions',
  BUDGETS: 'jdm_budgets',
};

// Savings Goals
export const getSavingsGoals = (): SavingsGoal[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : [];
};

export const saveSavingsGoal = (goal: SavingsGoal): void => {
  const goals = getSavingsGoals();
  const existingIndex = goals.findIndex(g => g.id === goal.id);

  if (existingIndex >= 0) {
    goals[existingIndex] = goal;
  } else {
    goals.push(goal);
  }

  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const deleteSavingsGoal = (goalId: string): void => {
  const goals = getSavingsGoals().filter(g => g.id !== goalId);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

// Transactions
export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const deleteTransaction = (transactionId: string): void => {
  const transactions = getTransactions().filter(t => t.id !== transactionId);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Budgets
export const getBudgets = (): Budget[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
};

export const saveBudget = (budget: Budget): void => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(b => b.id === budget.id);

  if (existingIndex >= 0) {
    budgets[existingIndex] = budget;
  } else {
    budgets.push(budget);
  }

  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
};

export const deleteBudget = (budgetId: string): void => {
  const budgets = getBudgets().filter(b => b.id !== budgetId);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
};

// Generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
