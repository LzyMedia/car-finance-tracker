// Timeline calculation utilities
import { Transaction, SavingsGoal, DashboardStats } from '@/types';

export interface TimelineProjection {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  monthlySavingsRate: number;
  estimatedMonths: number;
  estimatedCompletionDate: Date;
  milestones: Milestone[];
  isAchievable: boolean;
  message: string;
}

export interface Milestone {
  percentage: number;
  amount: number;
  date: Date;
  label: string;
}

export function calculateSavingsTimeline(
  goal: SavingsGoal,
  transactions: Transaction[]
): TimelineProjection {
  const remainingAmount = goal.targetAmount - goal.currentAmount;

  // Calculate monthly savings rate from recent transactions
  const monthlySavingsRate = calculateMonthlySavingsRate(transactions);

  // Calculate estimated months to reach goal
  let estimatedMonths = 0;
  let isAchievable = true;
  let message = '';

  if (monthlySavingsRate <= 0) {
    isAchievable = false;
    estimatedMonths = Infinity;
    message = 'Your current spending exceeds income. Adjust your budget to start saving.';
  } else {
    estimatedMonths = Math.ceil(remainingAmount / monthlySavingsRate);

    if (estimatedMonths > 120) { // More than 10 years
      message = `This goal will take ${Math.floor(estimatedMonths / 12)} years. Consider increasing your savings rate or adjusting the target.`;
    } else if (estimatedMonths > 36) { // More than 3 years
      message = `This is a long-term goal (${Math.floor(estimatedMonths / 12)} years). Stay committed!`;
    } else if (estimatedMonths > 12) {
      message = `You're ${Math.floor(estimatedMonths / 12)} years away from your goal. Keep saving!`;
    } else if (estimatedMonths > 1) {
      message = `Just ${estimatedMonths} months until you reach your goal!`;
    } else {
      message = 'You can achieve this goal within a month!';
    }
  }

  // Calculate estimated completion date
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setMonth(estimatedCompletionDate.getMonth() + estimatedMonths);

  // Generate milestones (25%, 50%, 75%, 100%)
  const milestones = generateMilestones(
    goal.currentAmount,
    goal.targetAmount,
    monthlySavingsRate,
    new Date()
  );

  return {
    goalId: goal.id,
    goalName: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    remainingAmount,
    monthlySavingsRate,
    estimatedMonths: isAchievable ? estimatedMonths : 0,
    estimatedCompletionDate,
    milestones,
    isAchievable,
    message,
  };
}

function calculateMonthlySavingsRate(transactions: Transaction[]): number {
  // Calculate average monthly savings from last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recentTransactions = transactions.filter(
    (t) => new Date(t.date) >= threeMonthsAgo
  );

  if (recentTransactions.length === 0) {
    return 0;
  }

  const totalIncome = recentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = recentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = recentTransactions
    .filter((t) => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthsOfData = Math.max(
    1,
    Math.ceil(
      (Date.now() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
  );

  // Monthly savings = (income - expenses + explicit savings) / months
  const monthlySavingsRate =
    (totalIncome - totalExpenses + totalSavings) / monthsOfData;

  return Math.max(0, monthlySavingsRate);
}

function generateMilestones(
  currentAmount: number,
  targetAmount: number,
  monthlySavingsRate: number,
  startDate: Date
): Milestone[] {
  const milestones: Milestone[] = [];
  const percentages = [25, 50, 75, 100];

  for (const percentage of percentages) {
    const milestoneAmount = (targetAmount * percentage) / 100;

    // Skip if already achieved
    if (milestoneAmount <= currentAmount && percentage !== 100) {
      continue;
    }

    const remainingToMilestone = milestoneAmount - currentAmount;
    const monthsToMilestone =
      monthlySavingsRate > 0
        ? Math.ceil(remainingToMilestone / monthlySavingsRate)
        : 0;

    const milestoneDate = new Date(startDate);
    milestoneDate.setMonth(milestoneDate.getMonth() + monthsToMilestone);

    milestones.push({
      percentage,
      amount: milestoneAmount,
      date: milestoneDate,
      label: `${percentage}% Complete`,
    });
  }

  return milestones;
}

export function calculateAllTimelines(
  goals: SavingsGoal[],
  transactions: Transaction[]
): TimelineProjection[] {
  return goals.map((goal) => calculateSavingsTimeline(goal, transactions));
}
