'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/goals', label: 'Goals', icon: Target },
  { href: '/dashboard/transactions', label: 'Transactions', icon: DollarSign },
  { href: '/dashboard/budget', label: 'Budget', icon: BarChart3 },
  { href: '/deals', label: 'Deals', icon: ShoppingBag },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">JDM Finance</div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-jdm-purple text-white'
                      : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu - simplified for now */}
          <div className="md:hidden flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2 rounded-lg ${
                    isActive ? 'text-jdm-purple' : 'text-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
