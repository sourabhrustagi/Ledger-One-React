import { request } from '../../lib/http';
import type { Transaction } from '../../types/api';

export const getTransactions = async (): Promise<Transaction[]> =>
  (await request<{ transactions: Transaction[] }>('GET', '/api/transactions')).transactions;
