import { NextResponse } from 'next/server';
import { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES } from '@/lib/plaid';
import { Products, CountryCode } from 'plaid';

export async function POST() {
  try {
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
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}
