'use client';

import { useState, useEffect } from 'react';
import { PlaidLink } from './PlaidLink';
import { Button, Card } from '@/components/ui';
import { Building2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { saveTransaction } from '@/lib/storage';
import { Transaction } from '@/types';

export function BankSync() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load access token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('plaid_access_token');
    if (stored) {
      setAccessToken(stored);
      const lastSyncTime = localStorage.getItem('last_sync_time');
      if (lastSyncTime) {
        setLastSync(new Date(lastSyncTime));
      }
    }
  }, []);

  const handlePlaidSuccess = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('plaid_access_token', token);
    setSyncStatus('success');

    // Automatically sync transactions after connecting
    setTimeout(() => syncTransactions(token), 1000);
  };

  const handlePlaidError = (error: any) => {
    console.error('Plaid error:', error);
    setSyncStatus('error');
    setErrorMessage('Failed to connect bank account');
  };

  const syncTransactions = async (token?: string) => {
    const tokenToUse = token || accessToken;
    if (!tokenToUse) return;

    setSyncing(true);
    setSyncStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/plaid/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: tokenToUse,
          start_date: getDateXDaysAgo(30),
          end_date: getTodayDate(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync transactions');
      }

      const data = await response.json();

      // Save transactions to localStorage
      data.transactions.forEach((transaction: Transaction) => {
        saveTransaction(transaction);
      });

      setLastSync(new Date());
      localStorage.setItem('last_sync_time', new Date().toISOString());
      setSyncStatus('success');

      // Reload page to show new transactions
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setErrorMessage(error.message || 'Failed to sync transactions');
    } finally {
      setSyncing(false);
    }
  };

  const disconnectBank = () => {
    if (confirm('Are you sure you want to disconnect your bank account?')) {
      localStorage.removeItem('plaid_access_token');
      localStorage.removeItem('last_sync_time');
      setAccessToken(null);
      setLastSync(null);
      setSyncStatus('idle');
    }
  };

  return (
    <Card gradient>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-jdm-purple" />
              Bank Connection
            </h3>
            <p className="text-sm text-muted">
              Automatically sync your transactions and calculate savings
            </p>
          </div>
        </div>

        {!accessToken ? (
          <div>
            <p className="text-muted mb-4">
              Connect your bank account to automatically import transactions and get personalized
              savings timelines.
            </p>
            <PlaidLink onSuccess={handlePlaidSuccess} onError={handlePlaidError} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-jdm-cyan">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Bank account connected</span>
            </div>

            {lastSync && (
              <p className="text-sm text-muted">
                Last synced: {lastSync.toLocaleString()}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => syncTransactions()}
                disabled={syncing}
                className="flex-1"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
              <Button onClick={disconnectBank} variant="outline">
                Disconnect
              </Button>
            </div>
          </div>
        )}

        {syncStatus === 'success' && (
          <div className="flex items-center gap-2 text-jdm-cyan text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Transactions synced successfully!</span>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="flex items-center gap-2 text-jdm-red text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-surface rounded-lg p-3 text-xs text-muted">
          <p className="font-semibold mb-1">🔒 Secure & Private</p>
          <p>
            Your bank credentials are never stored on our servers. All connections are encrypted
            and handled securely through Plaid.
          </p>
        </div>
      </div>
    </Card>
  );
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
