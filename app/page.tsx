'use client';

import Link from 'next/link';
import { Gauge, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Scan lines effect */}
      <div className="absolute inset-0 scan-lines opacity-20" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4">
              <span className="gradient-text">JDM</span>
              <span className="text-foreground"> FINANCE</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-jdm-cyan text-xl">
              <Gauge className="w-6 h-6" />
              <span className="font-mono">TRACK • SAVE • BUILD</span>
              <Gauge className="w-6 h-6" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted mb-12 max-w-2xl mx-auto">
            The ultimate finance tracker for car enthusiasts. Save for your dream ride,
            track mods, find deals, and build your automotive future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" glow className="w-full sm:w-auto px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/deals">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                Browse Deals
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Savings Goals"
              description="Set and track goals for cars, mods, and parts with visual progress tracking"
              color="jdm-purple"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Smart Budgeting"
              description="Monitor your spending and income to maximize your car fund"
              color="jdm-pink"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Deal Finder"
              description="Discover the best prices on parts and mods from across the web"
              color="jdm-cyan"
            />
          </div>
        </div>
      </section>

      {/* Racing stripes decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-2 racing-stripes opacity-50" />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="bg-surface-elevated rounded-xl p-6 border border-white/10 card-hover">
      <div className={`text-${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}
