import { NextResponse } from 'next/server';
import { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES } from '@/lib/plaid';
import { Products, CountryCode } from 'plaid';

export async function POST() {
  try {
    // Check if Plaid credentials are configured
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      return NextResponse.json(
        {
          error: 'Plaid credentials not configured. Add PLAID_CLIENT_ID and PLAID_SECRET to environment variables.'
        },
        { status: 503 }
      );
    }

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: 'user-id', // In production, use actual user ID from auth
      },
      client_name: 'JDM Finance Tracker',
      products: PLAID_PRODUCTS as Products[],
      country_codes: PLAID_COUNTRY_CODES as CountryCode[],
      language: 'en',
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error('Error creating link token:', error);

    // Provide more specific error messages
    if (error.response?.data?.error_code === 'INVALID_API_KEYS') {
      return NextResponse.json(
        { error: 'Invalid Plaid API credentials. Please check your environment variables.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create link token. Check server logs for details.' },
      { status: 500 }
    );
  }
}
