// Core data types for the car finance tracker app

export type GoalCategory = 'car' | 'mod' | 'part' | 'other';
export type TransactionType = 'income' | 'expense' | 'savings';

export interface SavingsGoal {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  goalId?: string; // Optional link to a savings goal
  date: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  color: string;
}

export interface Deal {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  url: string;
  source: string;
  imageUrl?: string;
  inStock: boolean;
  lastUpdated: string;
}

export interface DashboardStats {
  totalSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  activeGoals: number;
}
