import { LoginForm } from './components/LoginForm';
import { AuthShell } from './components/AuthShell';

export function LoginPage() {
  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Introduce tu correo y contraseña para acceder al panel."
    >
      <LoginForm />
    </AuthShell>
  );
}
