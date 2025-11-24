'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui';
import { Building2, RefreshCw, AlertCircle } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess: (accessToken: string) => void;
  onError?: (error: any) => void;
}

export function PlaidLink({ onSuccess, onError }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch link token when component mounts
  useEffect(() => {
    async function createLinkToken() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to create link token');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.link_token) {
          setLinkToken(data.link_token);
        } else {
          throw new Error('No link token received');
        }
      } catch (error: any) {
        console.error('Error creating link token:', error);
        setError(error.message || 'Failed to initialize Plaid');
        onError?.(error);
      } finally {
        setLoading(false);
      }
    }

    createLinkToken();
  }, [onError]);

  const onPlaidSuccess = useCallback(
    async (public_token: string) => {
      setLoading(true);
      try {
        // Exchange public token for access token
        const response = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token }),
        });

        const data = await response.json();

        if (data.access_token) {
          onSuccess(data.access_token);
        } else {
          throw new Error('Failed to exchange token');
        }
      } catch (error) {
        console.error('Error exchanging token:', error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const config = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (error: any) => {
      if (error) {
        console.error('Plaid Link exit error:', error);
        onError?.(error);
      }
    },
  };

  const { open, ready } = usePlaidLink(config);

  // Show error state if Plaid isn't configured
  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-jdm-orange/10 border border-jdm-orange/30 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-jdm-orange flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-foreground mb-1">Plaid Not Configured</p>
            <p className="text-sm text-muted">
              Bank connections require Plaid API credentials. Add your credentials to enable this feature.
            </p>
            <details className="mt-2">
              <summary className="text-xs text-jdm-cyan cursor-pointer hover:text-jdm-pink">
                Setup Instructions
              </summary>
              <div className="mt-2 text-xs text-muted space-y-1">
                <p>1. Sign up at plaid.com/dashboard</p>
                <p>2. Get your Client ID and Sandbox secret</p>
                <p>3. Add to Vercel environment variables:</p>
                <code className="block bg-surface p-2 rounded mt-1 font-mono text-[10px]">
                  PLAID_CLIENT_ID=your_client_id<br/>
                  PLAID_SECRET=your_secret<br/>
                  PLAID_ENV=sandbox<br/>
                  NEXT_PUBLIC_PLAID_ENV=sandbox
                </code>
              </div>
            </details>
          </div>
        </div>
        <p className="text-sm text-muted">
          💡 You can still use the app by manually adding transactions
        </p>
      </div>
    );
  }

  // Show loading state
  if (loading && !linkToken) {
    return (
      <Button disabled glow className="w-full sm:w-auto">
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Initializing...
      </Button>
    );
  }

  return (
    <Button
      onClick={() => open()}
      disabled={!ready || loading}
      glow
      className="w-full sm:w-auto"
    >
      {loading ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Building2 className="w-4 h-4 mr-2" />
          Connect Bank Account
        </>
      )}
    </Button>
  );
}
