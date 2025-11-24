import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { Transaction, TransactionType } from '@/types';
import { generateId } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { access_token, start_date, end_date } = await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Fetch transactions from Plaid
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: start_date || getDateXDaysAgo(30),
      end_date: end_date || getTodayDate(),
    });

    // Transform Plaid transactions to our app format
    const transactions: Transaction[] = response.data.transactions.map((plaidTx) => {
      // Determine transaction type based on amount
      // Plaid: positive = money out (expense), negative = money in (income)
      const type: TransactionType = plaidTx.amount > 0 ? 'expense' : 'income';
      const amount = Math.abs(plaidTx.amount);

      return {
        id: generateId(),
        type,
        amount,
        category: plaidTx.category?.[0] || 'Uncategorized',
        description: plaidTx.name,
        date: plaidTx.date,
        createdAt: new Date().toISOString(),
        plaidTransactionId: plaidTx.transaction_id,
      } as Transaction & { plaidTransactionId: string };
    });

    return NextResponse.json({
      transactions,
      total_transactions: response.data.total_transactions,
      accounts: response.data.accounts,
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);

    if (error.response?.data?.error_code === 'ITEM_LOGIN_REQUIRED') {
      return NextResponse.json(
        { error: 'Bank connection needs to be re-authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
