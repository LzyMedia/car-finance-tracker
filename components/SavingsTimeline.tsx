'use client';

import { TimelineProjection, Milestone } from '@/lib/timeline';
import { Card } from '@/components/ui';
import { Calendar, TrendingUp, Target, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SavingsTimelineProps {
  projection: TimelineProjection;
  compact?: boolean;
}

export function SavingsTimeline({ projection, compact = false }: SavingsTimelineProps) {
  if (!projection.isAchievable) {
    return (
      <Card className="border-jdm-red/50">
        <div className="flex items-start gap-3">
          <div className="text-jdm-red">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Timeline Not Available</h3>
            <p className="text-muted">{projection.message}</p>
            <p className="text-sm text-muted mt-2">
              Connect your bank account or add transactions to calculate your savings timeline.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="bg-surface rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Estimated Completion</span>
          <span className="text-sm font-bold text-jdm-cyan">
            {projection.estimatedCompletionDate.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Monthly Savings</span>
          <span className="text-sm font-bold text-jdm-purple">
            {formatCurrency(projection.monthlySavingsRate)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card gradient>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Target className="w-6 h-6 text-jdm-purple" />
            Savings Timeline
          </h3>
          <p className="text-muted">{projection.message}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-jdm-cyan" />
              <span className="text-sm text-muted">Monthly Savings</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(projection.monthlySavingsRate)}
            </p>
          </div>

          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-jdm-pink" />
              <span className="text-sm text-muted">Time to Goal</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {projection.estimatedMonths} {projection.estimatedMonths === 1 ? 'month' : 'months'}
            </p>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div>
          <h4 className="text-sm font-semibold text-muted mb-4 uppercase">Milestones</h4>
          <div className="space-y-4">
            {projection.milestones.map((milestone, index) => (
              <MilestoneItem
                key={milestone.percentage}
                milestone={milestone}
                isLast={index === projection.milestones.length - 1}
                currentAmount={projection.currentAmount}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>Progress to Goal</span>
            <span>
              {((projection.currentAmount / projection.targetAmount) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-jdm-purple to-jdm-pink transition-all duration-500"
              style={{
                width: `${Math.min(
                  (projection.currentAmount / projection.targetAmount) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

interface MilestoneItemProps {
  milestone: Milestone;
  isLast: boolean;
  currentAmount: number;
}

function MilestoneItem({ milestone, isLast, currentAmount }: MilestoneItemProps) {
  const isAchieved = currentAmount >= milestone.amount;
  const isCurrent = currentAmount < milestone.amount;

  return (
    <div className="flex items-start gap-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 transition-all ${
            isAchieved
              ? 'bg-jdm-cyan border-jdm-cyan'
              : isCurrent
              ? 'border-jdm-purple bg-surface'
              : 'border-white/20 bg-surface'
          }`}
        />
        {!isLast && (
          <div
            className={`w-0.5 h-12 mt-1 transition-all ${
              isAchieved ? 'bg-jdm-cyan/50' : 'bg-white/10'
            }`}
          />
        )}
      </div>

      {/* Milestone info */}
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`font-semibold ${
              isAchieved
                ? 'text-jdm-cyan'
                : isCurrent
                ? 'text-foreground'
                : 'text-muted'
            }`}
          >
            {milestone.label}
          </span>
          <span className="text-sm text-muted">
            {milestone.date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="text-sm text-muted">
          {formatCurrency(milestone.amount)}
        </div>
      </div>
    </div>
  );
}
