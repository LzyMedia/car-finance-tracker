'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Car, Wrench, Package } from 'lucide-react';
import { Card, Button, Input, ProgressBar } from '@/components/ui';
import { getSavingsGoals, saveSavingsGoal, deleteSavingsGoal, generateId, getTransactions } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';
import { SavingsGoal, GoalCategory } from '@/types';
import { SavingsTimeline } from '@/components/SavingsTimeline';
import { calculateSavingsTimeline } from '@/lib/timeline';

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [selectedGoalForTimeline, setSelectedGoalForTimeline] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    setGoals(getSavingsGoals());
  };

  const handleSaveGoal = (goal: SavingsGoal) => {
    saveSavingsGoal(goal);
    loadGoals();
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteSavingsGoal(goalId);
      loadGoals();
    }
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Savings Goals</h1>
          <p className="text-muted">Track your progress towards your automotive dreams</p>
        </div>
        <Button onClick={() => setShowForm(true)} glow>
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onSave={handleSaveGoal}
          onCancel={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
        />
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="text-center py-16">
          <Car className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">No Goals Yet</h3>
          <p className="text-muted mb-6">
            Create your first savings goal for a car, mod, or part!
          </p>
          <Button onClick={() => setShowForm(true)}>Get Started</Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onViewTimeline={(id) => setSelectedGoalForTimeline(id)}
              />
            ))}
          </div>

          {/* Timeline Modal */}
          {selectedGoalForTimeline && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <SavingsTimeline
                  projection={calculateSavingsTimeline(
                    goals.find((g) => g.id === selectedGoalForTimeline)!,
                    getTransactions()
                  )}
                />
                <Button
                  onClick={() => setSelectedGoalForTimeline(null)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface GoalFormProps {
  goal: SavingsGoal | null;
  onSave: (goal: SavingsGoal) => void;
  onCancel: () => void;
}

function GoalForm({ goal, onSave, onCancel }: GoalFormProps) {
  const [formData, setFormData] = useState<Partial<SavingsGoal>>(
    goal || {
      name: '',
      category: 'car',
      targetAmount: 0,
      currentAmount: 0,
      description: '',
      deadline: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    const goalData: SavingsGoal = {
      id: goal?.id || generateId(),
      name: formData.name || '',
      category: (formData.category as GoalCategory) || 'car',
      targetAmount: Number(formData.targetAmount) || 0,
      currentAmount: Number(formData.currentAmount) || 0,
      description: formData.description,
      deadline: formData.deadline,
      createdAt: goal?.createdAt || now,
      updatedAt: now,
    };

    onSave(goalData);
  };

  return (
    <Card gradient>
      <h3 className="text-2xl font-bold text-foreground mb-6">
        {goal ? 'Edit Goal' : 'Create New Goal'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Name"
          placeholder="e.g., 2JZ Engine Swap"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'car', label: 'Car', icon: Car },
              { value: 'mod', label: 'Mod', icon: Wrench },
              { value: 'part', label: 'Part', icon: Package },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value as GoalCategory })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.category === cat.value
                      ? 'border-jdm-purple bg-jdm-purple/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Target Amount ($)"
            type="number"
            placeholder="10000"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
            required
          />
          <Input
            label="Current Amount ($)"
            type="number"
            placeholder="0"
            value={formData.currentAmount}
            onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Target Date (Optional)"
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description (Optional)
          </label>
          <textarea
            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-jdm-purple focus:ring-1 focus:ring-jdm-purple transition-all"
            rows={3}
            placeholder="Add details about your goal..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {goal ? 'Update Goal' : 'Create Goal'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goalId: string) => void;
  onViewTimeline: (goalId: string) => void;
}

function GoalCard({ goal, onEdit, onDelete, onViewTimeline }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const categoryIcons = {
    car: <Car className="w-5 h-5" />,
    mod: <Wrench className="w-5 h-5" />,
    part: <Package className="w-5 h-5" />,
    other: <Package className="w-5 h-5" />,
  };

  return (
    <Card hover gradient>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-jdm-cyan">{categoryIcons[goal.category]}</div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{goal.name}</h3>
            <p className="text-xs text-jdm-cyan uppercase font-mono">{goal.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-muted hover:text-jdm-cyan transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-muted hover:text-jdm-red transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-muted mb-4">{goal.description}</p>
      )}

      <ProgressBar
        current={goal.currentAmount}
        target={goal.targetAmount}
        className="mb-4"
      />

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-muted">
          {progress.toFixed(0)}% Complete
        </span>
        {goal.deadline && (
          <span className="text-muted">
            Due: {new Date(goal.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      <Button
        onClick={() => onViewTimeline(goal.id)}
        variant="outline"
        className="w-full"
        size="sm"
      >
        View Timeline
      </Button>
    </Card>
  );
}
