'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Card, Button, Input, ProgressBar } from '@/components/ui';
import { getBudgets, saveBudget, deleteBudget, generateId, getTransactions } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';
import { Budget } from '@/types';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    const loadedBudgets = getBudgets();
    const transactions = getTransactions();

    // Calculate spent amount for each budget
    const updatedBudgets = loadedBudgets.map(budget => {
      const categoryTransactions = transactions.filter(
        t => t.type === 'expense' && t.category.toLowerCase().includes(budget.category.toLowerCase())
      );

      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

      return { ...budget, spent };
    });

    setBudgets(updatedBudgets);
  };

  const handleSaveBudget = (budget: Budget) => {
    saveBudget(budget);
    loadBudgets();
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (budgetId: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(budgetId);
      loadBudgets();
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Budget Management</h1>
          <p className="text-muted">Set spending limits and track your budget</p>
        </div>
        <Button onClick={() => setShowForm(true)} glow>
          <Plus className="w-4 h-4 mr-2" />
          New Budget
        </Button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <BudgetForm
          budget={editingBudget}
          onSave={handleSaveBudget}
          onCancel={() => {
            setShowForm(false);
            setEditingBudget(null);
          }}
        />
      )}

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <Card className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">No Budgets Yet</h3>
          <p className="text-muted mb-6">
            Create budgets to track your spending in different categories
          </p>
          <Button onClick={() => setShowForm(true)}>Create Your First Budget</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BudgetFormProps {
  budget: Budget | null;
  onSave: (budget: Budget) => void;
  onCancel: () => void;
}

function BudgetForm({ budget, onSave, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    limit: budget?.limit || 0,
    period: budget?.period || 'monthly',
    color: budget?.color || 'jdm-purple',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const budgetData: Budget = {
      id: budget?.id || generateId(),
      category: formData.category,
      limit: Number(formData.limit),
      spent: budget?.spent || 0,
      period: formData.period as Budget['period'],
      color: formData.color,
    };

    onSave(budgetData);
  };

  return (
    <Card gradient>
      <h3 className="text-2xl font-bold text-foreground mb-6">
        {budget ? 'Edit Budget' : 'Create New Budget'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category"
          placeholder="e.g., Gas, Car Parts, Maintenance"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Budget Limit ($)"
            type="number"
            placeholder="500"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Period
            </label>
            <select
              className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-jdm-purple focus:ring-1 focus:ring-jdm-purple transition-all"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as Budget['period'] })}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Color
          </label>
          <div className="flex gap-3">
            {['jdm-purple', 'jdm-pink', 'jdm-cyan', 'jdm-orange', 'jdm-yellow'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-lg bg-${color} ${
                  formData.color === color ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {budget ? 'Update Budget' : 'Create Budget'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percentage = (budget.spent / budget.limit) * 100;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && percentage <= 100;

  return (
    <Card hover gradient>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{budget.category}</h3>
          <p className="text-xs text-muted uppercase font-mono">{budget.period}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="text-muted hover:text-jdm-cyan transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="text-muted hover:text-jdm-red transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(budget.spent)}
          </span>
          <span className="text-muted">of {formatCurrency(budget.limit)}</span>
        </div>

        <div className="w-full bg-surface rounded-full h-3 overflow-hidden border border-white/10">
          <div
            className={`h-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-jdm-red'
                : isNearLimit
                ? 'bg-jdm-orange'
                : `bg-${budget.color}`
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-semibold ${
            isOverBudget
              ? 'text-jdm-red'
              : isNearLimit
              ? 'text-jdm-orange'
              : 'text-jdm-cyan'
          }`}
        >
          {percentage.toFixed(0)}% Used
        </span>
        {isOverBudget && (
          <span className="text-xs text-jdm-red flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Over Budget!
          </span>
        )}
        {isNearLimit && !isOverBudget && (
          <span className="text-xs text-jdm-orange flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Near Limit
          </span>
        )}
      </div>
    </Card>
  );
}
