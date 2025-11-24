'use client';

import { useEffect, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Filter, Trash2 } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { getTransactions, saveTransaction, deleteTransaction, generateId, getSavingsGoals } from '@/lib/storage';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, TransactionType } from '@/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === filter));
    }
  }, [filter, transactions]);

  const loadTransactions = () => {
    setTransactions(getTransactions());
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    saveTransaction(transaction);
    loadTransactions();
    setShowForm(false);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transactionId);
      loadTransactions();
    }
  };

  const totals = {
    income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    savings: transactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Transactions</h1>
          <p className="text-muted">Track your income, expenses, and savings</p>
        </div>
        <Button onClick={() => setShowForm(true)} glow>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          onSave={handleSaveTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Total Income</p>
              <p className="text-2xl font-bold text-jdm-cyan">{formatCurrency(totals.income)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-jdm-cyan" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-jdm-red">{formatCurrency(totals.expense)}</p>
            </div>
            <TrendingDown className="w-6 h-6 text-jdm-red" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Total Savings</p>
              <p className="text-2xl font-bold text-jdm-purple">{formatCurrency(totals.savings)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-jdm-purple" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'income' ? 'primary' : 'ghost'}
          onClick={() => setFilter('income')}
        >
          Income
        </Button>
        <Button
          variant={filter === 'expense' ? 'primary' : 'ghost'}
          onClick={() => setFilter('expense')}
        >
          Expenses
        </Button>
        <Button
          variant={filter === 'savings' ? 'primary' : 'ghost'}
          onClick={() => setFilter('savings')}
        >
          Savings
        </Button>
      </div>

      {/* Transactions List */}
      <Card>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions</h3>
            <p className="text-muted mb-6">Start tracking your financial activity</p>
            <Button onClick={() => setShowForm(true)}>Add Your First Transaction</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-surface-elevated transition-colors border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'bg-jdm-cyan/20 text-jdm-cyan'
                        : transaction.type === 'expense'
                        ? 'bg-jdm-red/20 text-jdm-red'
                        : 'bg-jdm-purple/20 text-jdm-purple'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : transaction.type === 'expense' ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <DollarSign className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`text-xl font-bold ${
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
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="text-muted hover:text-jdm-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

interface TransactionFormProps {
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
}

function TransactionForm({ onSave, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'income' as TransactionType,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transaction: Transaction = {
      id: generateId(),
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      createdAt: new Date().toISOString(),
    };

    onSave(transaction);
  };

  return (
    <Card gradient>
      <h3 className="text-2xl font-bold text-foreground mb-6">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'income', label: 'Income', color: 'jdm-cyan' },
              { value: 'expense', label: 'Expense', color: 'jdm-red' },
              { value: 'savings', label: 'Savings', color: 'jdm-purple' },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value as TransactionType })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === type.value
                    ? `border-${type.color} bg-${type.color}/10`
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-sm font-semibold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            placeholder="100.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <Input
          label="Category"
          placeholder="e.g., Salary, Gas, Turbo Kit"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />

        <Input
          label="Description"
          placeholder="Add details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Add Transaction
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
