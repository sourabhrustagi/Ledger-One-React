import { request } from '../../lib/http';
import type { OtpSentResponse, VerifyOtpResponse } from '../../types/api';

export const sendOtp = (phone: string) =>
  request<OtpSentResponse>('POST', '/api/auth/otp', { phone });

export const verifyOtp = (phone: string, otp: string) =>
  request<VerifyOtpResponse>('POST', '/api/auth/verify', { phone, otp });

export const logout = () => request<{ ok: boolean }>('POST', '/api/auth/logout');
