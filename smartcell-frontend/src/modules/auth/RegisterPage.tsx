import { RegisterForm } from './components/RegisterForm';
import { AuthShell } from './components/AuthShell';

export function RegisterPage() {
  return (
    <AuthShell
      title="Crear cuenta"
      subtitle={
        <>
          Regístrate para usar la aplicación. En desarrollo, la API suele estar en{' '}
          <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
            localhost:8000/api
          </code>
          .
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
