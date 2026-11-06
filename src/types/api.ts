// API contract shared by the app and the mock backend.

export interface Account {
  name: string;
  phone: string;
  email: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  balanceMinor: number; // paise
  currency: 'INR';
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amountMinor: number; // paise, always positive
  direction: 'CREDIT' | 'DEBIT';
  timestamp: number; // epoch ms
}

export interface OtpSentResponse {
  message: string;
  expiresInSeconds: number;
  mockOtp?: string;
}

export interface VerifyOtpResponse {
  token: string;
}
