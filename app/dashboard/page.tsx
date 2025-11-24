'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Target, DollarSign, Plus } from 'lucide-react';
import { Card, Button, ProgressBar } from '@/components/ui';
import { getSavingsGoals, getTransactions } from '@/lib/storage';
import { calculateDashboardStats, formatCurrency } from '@/lib/utils';
import { DashboardStats, SavingsGoal, Transaction } from '@/types';
import { BankSync } from '@/components/BankSync';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSavings: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    activeGoals: 0,
  });
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadedGoals = getSavingsGoals();
    const loadedTransactions = getTransactions();
    const calculatedStats = calculateDashboardStats(loadedGoals, loadedTransactions);

    setGoals(loadedGoals.slice(0, 3)); // Show top 3 goals
    setRecentTransactions(loadedTransactions.slice(0, 5)); // Show 5 recent transactions
    setStats(calculatedStats);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted">Track your automotive financial journey</p>
        </div>
        <Link href="/dashboard/goals">
          <Button glow>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </Link>
      </div>

      {/* Bank Sync */}
      <BankSync />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Savings"
          value={formatCurrency(stats.totalSavings)}
          icon={<DollarSign className="w-6 h-6" />}
          color="jdm-purple"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(stats.monthlyIncome)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="jdm-cyan"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(stats.monthlyExpenses)}
          icon={<TrendingDown className="w-6 h-6" />}
          color="jdm-pink"
        />
        <StatCard
          title="Savings Rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          icon={<Target className="w-6 h-6" />}
          color="jdm-yellow"
        />
      </div>

      {/* Active Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Active Goals</h2>
          <Link href="/dashboard/goals" className="text-jdm-purple hover:text-jdm-pink transition-colors">
            View All →
          </Link>
        </div>

        {goals.length === 0 ? (
          <Card className="text-center py-12">
            <Target className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Goals Yet</h3>
            <p className="text-muted mb-6">Start saving for your dream car, mods, or parts!</p>
            <Link href="/dashboard/goals">
              <Button>Create Your First Goal</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} hover gradient>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">{goal.name}</h3>
                    <span className="text-xs text-jdm-cyan uppercase font-mono">
                      {goal.category}
                    </span>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted mb-4">{goal.description}</p>
                  )}
                </div>
                <ProgressBar
                  current={goal.currentAmount}
                  target={goal.targetAmount}
                />
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="text-jdm-purple hover:text-jdm-pink transition-colors">
            View All →
          </Link>
        </div>

        <Card>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === 'income'
                          ? 'text-jdm-cyan'
                          : transaction.type === 'expense'
                          ? 'text-jdm-red'
                          : 'text-jdm-purple'
                      }`}
                    >
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`text-${color}`}>{icon}</div>
      </div>
    </Card>
  );
}
