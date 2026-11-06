import { useEffect, useState } from 'react';
import { Home, User, type LucideIcon } from 'lucide-react';
import { getAccount } from '../features/account/accountApi';
import { AccountPage } from '../features/account/AccountPage';
import { useAuth } from '../features/auth/useAuth';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ApiError } from '../lib/http';
import { useAsync } from '../lib/useAsync';

type Tab = 'home' | 'account';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'account', label: 'Account', icon: User },
];

/** Layout for signed-in users: loads the account once and switches between tabs. */
export function AppShell() {
  const { clearSession } = useAuth();
  const [tab, setTab] = useState<Tab>('home');
  const account = useAsync(getAccount);

  useEffect(() => {
    if (account.error instanceof ApiError && account.error.status === 401) clearSession();
  }, [account.error, clearSession]);

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          Ledger<span>One</span>
        </span>
      </header>

      <main className="content">
        {account.loading && <p className="muted">Loading your account…</p>}
        {account.error && <p className="error">{account.error.message}</p>}
        {account.data && tab === 'home' && <Dashboard account={account.data} />}
        {account.data && tab === 'account' && <AccountPage account={account.data} />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'nav-item active' : 'nav-item'}
            onClick={() => setTab(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
