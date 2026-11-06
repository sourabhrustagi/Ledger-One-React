import type { Account } from '../../types/api';
import { formatDate, formatInr } from '../../lib/format';
import { useAsync } from '../../lib/useAsync';
import { getTransactions } from './dashboardApi';

interface DashboardProps {
  account: Account;
}

export function Dashboard({ account }: DashboardProps) {
  const transactions = useAsync(getTransactions);

  return (
    <section className="dashboard">
      <div className="card balance-card">
        <p className="muted">Hi {account.name.split(' ')[0]}, your balance</p>
        <p className="balance">{formatInr(account.balanceMinor)}</p>
        <p className="muted">
          {account.accountName} · A/c ••••{account.accountNumber.slice(-4)}
        </p>
      </div>

      <div className="dashboard-txns">
        <h2 className="section-title">Recent transactions</h2>

        {transactions.error && <p className="error">{transactions.error.message}</p>}
        {transactions.loading && <p className="muted">Loading transactions…</p>}

        {transactions.data && (
          <ul className="card tx-list">
            {transactions.data.map((tx) => (
              <li key={tx.id} className="tx-row">
                <div>
                  <p className="tx-title">{tx.title}</p>
                  <p className="muted">{tx.subtitle}</p>
                  <p className="muted">{formatDate(tx.timestamp)}</p>
                </div>
                <p className={tx.direction === 'CREDIT' ? 'amount credit' : 'amount debit'}>
                  {tx.direction === 'CREDIT' ? '+' : '−'}
                  {formatInr(tx.amountMinor)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
