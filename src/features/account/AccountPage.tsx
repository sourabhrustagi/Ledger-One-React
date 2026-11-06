import { useState } from 'react';
import type { Account } from '../../types/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useAuth } from '../auth/useAuth';

interface AccountPageProps {
  account: Account;
}

export function AccountPage({ account }: AccountPageProps) {
  const { signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirmLogout = async () => {
    setBusy(true);
    await signOut();
  };

  const rows: [string, string][] = [
    ['Name', account.name],
    ['Mobile', `+91 ${account.phone}`],
    ['Email', account.email],
    ['Account', account.accountName],
    ['Account number', account.accountNumber],
    ['IFSC', account.ifsc],
  ];

  return (
    <section className="account">
      <div className="card">
        <h2 className="section-title">Account details</h2>
        <dl className="details">
          {rows.map(([label, value]) => (
            <div key={label} className="details-row">
              <dt className="muted">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button className="btn-danger" type="button" onClick={() => setConfirmOpen(true)}>
        Log out
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out of LedgerOne?"
        message="You will need your mobile number and OTP to sign in again."
        confirmLabel="Log out"
        busy={busy}
        onConfirm={handleConfirmLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
