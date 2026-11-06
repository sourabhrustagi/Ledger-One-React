import { AppShell } from './components/AppShell';
import { useAuth } from './features/auth/useAuth';
import { LoginScreen } from './features/auth/LoginScreen';

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppShell /> : <LoginScreen />;
}
