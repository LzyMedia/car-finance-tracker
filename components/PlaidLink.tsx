'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui';
import { Building2, RefreshCw } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess: (accessToken: string) => void;
  onError?: (error: any) => void;
}

export function PlaidLink({ onSuccess, onError }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch link token when component mounts
  useEffect(() => {
    async function createLinkToken() {
      try {
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
        });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
        onError?.(error);
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
