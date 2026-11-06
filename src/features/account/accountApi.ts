import { request } from '../../lib/http';
import type { Account } from '../../types/api';

export const getAccount = async (): Promise<Account> =>
  (await request<{ account: Account }>('GET', '/api/account')).account;
