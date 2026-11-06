import { useState, type FormEvent } from 'react';
import { sendOtp, verifyOtp } from './authApi';
import { useAuth } from './useAuth';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const handlePhoneSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await sendOtp(phone);
      setStep('otp');
    });
  };

  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      const { token } = await verifyOtp(phone, otp);
      signIn(token);
    });
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="brand">
          Ledger<span>One</span>
        </h1>

        {error && <p className="error">{error}</p>}

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit}>
            <label className="field-label" htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              className="input"
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              autoFocus
            />
            <button className="btn-primary" type="submit" disabled={busy || phone.length !== 10}>
              {busy ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <label className="field-label" htmlFor="otp">Enter the 6-digit OTP sent to {phone}</label>
            <input
              id="otp"
              className="input otp-input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoFocus
            />
            <button className="btn-primary" type="submit" disabled={busy || otp.length !== 6}>
              {busy ? 'Verifying…' : 'Verify & log in'}
            </button>
            <button
              className="btn-link"
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError(null);
              }}
            >
              Change number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
