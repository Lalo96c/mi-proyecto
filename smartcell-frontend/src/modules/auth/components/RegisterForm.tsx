import { isAxiosError } from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
  authErrorBoxClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authLinkInlineClass,
  authPrimaryButtonClass,
} from '../authFieldClasses';
import { Spinner } from './Spinner';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as
          | { errors?: Record<string, string[]>; message?: string }
          | undefined;
        if (data?.errors) {
          setFieldErrors(data.errors);
        }
        setError(data?.message || 'No se pudo registrar la cuenta.');
      } else {
        setError('No se pudo registrar la cuenta.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const firstError = (key: string) => fieldErrors[key]?.[0];

  const fieldClass = (key: string) =>
    `${authInputClass} ${firstError(key) ? authInputErrorClass : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && !Object.keys(fieldErrors).length ? (
        <div className={authErrorBoxClass} role="alert">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>{error}</span>
        </div>
      ) : null}

      <div>
        <label className={authLabelClass} htmlFor="register-name">
          Nombre
        </label>
        <input
          id="register-name"
          className={fieldClass('name')}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(firstError('name'))}
          required
        />
        {firstError('name') ? (
          <p className="mt-1.5 text-sm text-red-600">{firstError('name')}</p>
        ) : null}
      </div>

      <div>
        <label className={authLabelClass} htmlFor="register-email">
          Correo electrónico
        </label>
        <input
          id="register-email"
          className={fieldClass('email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(firstError('email'))}
          required
        />
        {firstError('email') ? (
          <p className="mt-1.5 text-sm text-red-600">{firstError('email')}</p>
        ) : null}
      </div>

      <div>
        <label className={authLabelClass} htmlFor="register-password">
          Contraseña
        </label>
        <input
          id="register-password"
          className={fieldClass('password')}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(firstError('password'))}
          required
          minLength={8}
        />
        {firstError('password') ? (
          <p className="mt-1.5 text-sm text-red-600">{firstError('password')}</p>
        ) : (
          <p className="mt-1.5 text-xs text-slate-500">Mínimo 8 caracteres (reglas del servidor).</p>
        )}
      </div>

      <div>
        <label className={authLabelClass} htmlFor="register-password-confirmation">
          Confirmar contraseña
        </label>
        <input
          id="register-password-confirmation"
          className={fieldClass('password_confirmation')}
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          aria-invalid={Boolean(firstError('password_confirmation'))}
          required
        />
        {firstError('password_confirmation') ? (
          <p className="mt-1.5 text-sm text-red-600">{firstError('password_confirmation')}</p>
        ) : null}
      </div>

      <div className="pt-2">
        <button type="submit" disabled={submitting} className={authPrimaryButtonClass}>
          {submitting ? (
            <>
              <Spinner />
              Registrando…
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </div>

      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className={authLinkInlineClass}>
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
