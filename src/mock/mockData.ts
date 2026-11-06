import type { Account, Transaction } from '../types/api.js';

export const MOCK_OTP = '123456';
export const MOCK_TOKEN = 'mock-session-jwt-token-active';

const DAY_MS = 24 * 60 * 60 * 1000;

export const mockAccount: Account = {
  name: 'Asha Rao',
  phone: '9876543210',
  email: 'asha.rao@ledgerone.io',
  accountName: 'Savings Account',
  accountNumber: '920010048210943',
  ifsc: 'HDFC0000240',
  balanceMinor: 24567890,
  currency: 'INR',
};

export const mockTransactions: Transaction[] = [
  { id: 'tx-001', title: 'Monthly Salary Credit', subtitle: 'TechCorp India · NEFT', amountMinor: 21500000, direction: 'CREDIT', timestamp: Date.now() - DAY_MS },
  { id: 'tx-002', title: 'Whole Foods Market', subtitle: 'Groceries · POS 4821', amountMinor: 485000, direction: 'DEBIT', timestamp: Date.now() - 2 * DAY_MS },
  { id: 'tx-003', title: 'Smoke House Deli', subtitle: 'Dining · UPI asha@okaxis', amountMinor: 342000, direction: 'DEBIT', timestamp: Date.now() - 3 * DAY_MS },
  { id: 'tx-004', title: 'Rahul Mehta', subtitle: 'UPI rahul.m@okicici', amountMinor: 120000, direction: 'CREDIT', timestamp: Date.now() - 4 * DAY_MS },
  { id: 'tx-005', title: 'BESCOM Electricity', subtitle: 'Utilities · Consumer 048291039', amountMinor: 50000, direction: 'DEBIT', timestamp: Date.now() - 6 * DAY_MS },
];
