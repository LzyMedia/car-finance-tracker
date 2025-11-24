import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';

export async function POST(request: NextRequest) {
  try {
    const { public_token } = await request.json();

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // In production, save accessToken to your database associated with the user
    // For now, we'll return it to be stored in localStorage (NOT SECURE for production)
    console.log('Access token obtained for item:', itemId);

    return NextResponse.json({
      access_token: accessToken,
      item_id: itemId,
    });
  } catch (error) {
    console.error('Error exchanging token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange token' },
      { status: 500 }
    );
  }
}
