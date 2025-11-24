// Utility functions
import { Transaction, SavingsGoal, DashboardStats } from '@/types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const calculateProgress = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

export const calculateDashboardStats = (
  goals: SavingsGoal[],
  transactions: Transaction[]
): DashboardStats => {
  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  // Calculate monthly income and expenses (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = transactions.filter(
    t => new Date(t.date) >= thirtyDaysAgo
  );

  const monthlyIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = recentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    : 0;

  return {
    totalSavings,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    activeGoals: goals.length,
  };
};

export const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    car: '🚗',
    mod: '🔧',
    part: '⚙️',
    other: '📦',
  };
  return icons[category] || '💰';
};
