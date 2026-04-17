import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

function EndpointCard({
    method,
    path,
    detail,
}: {
    method: string;
    path: string;
    detail?: string;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border border-slate-200/60 bg-slate-50 px-3 py-2.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-indigo-800">
                    {method}
                </span>
                <code className="text-xs font-medium text-slate-800">{path}</code>
            </div>
            {detail ? <p className="text-xs text-slate-500">{detail}</p> : null}
        </div>
    );
}

export function HomeDashboard() {
    const { isAuthenticated, user } = useAuth();

    ;

    return (
        <div className="flex min-h-0 flex-1 flex-col">

            <div className="relative overflow-hidden border-b border-indigo-100 bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-10 sm:px-8">
                <div
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 opacity-60"
                    aria-hidden
                />
                <div className="relative mx-auto max-w-6xl">
                    <p className="text-sm font-medium text-indigo-200">Panel</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {isAuthenticated && user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Bienvenido'}
                    </h1>
                    <p className="mt-3 max-w-xl text-base text-indigo-100">
                        Gestiona productos, categorías y ventas desde un solo lugar. Frontend React + Tailwind con autenticación JWT
                        contra tu API Laravel.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            to="/productos"
                            className="inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-50"
                        >
                            Ver productos
                        </Link>
                        <Link
                            to="/categorias"
                            className="inline-flex items-center rounded-lg border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
                        >
                            Categorías
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 sm:p-8">
                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/[0.04] lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900">API de autenticación</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Base típica en desarrollo:{' '}
                            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                                http://localhost:8000/api
                            </code>
                        </p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <EndpointCard method="POST" path="/auth/login" detail="Credenciales email + password" />
                            <EndpointCard method="POST" path="/auth/register" detail="Alta de usuario" />
                            <EndpointCard method="POST" path="/auth/refresh" detail="Renovar token (Axios)" />
                            <EndpointCard method="GET" path="/auth/me" detail="Usuario actual con JWT" />
                            <EndpointCard method="POST" path="/auth/logout" detail="Invalidar sesión" />
                        </div>
                    </section>

                    <section className="flex flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/[0.04]">
                        <h2 className="text-lg font-semibold text-slate-900">Tu cuenta</h2>
                        {isAuthenticated && user ? (
                            <>
                                <div className="mt-4 flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-base font-bold text-indigo-800"
                                        aria-hidden
                                    >
                                        {user.name?.trim()?.charAt(0)?.toUpperCase() ??
                                            user.email?.charAt(0)?.toUpperCase() ??
                                            '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-slate-900">{user.name}</p>
                                        <p className="truncate text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-slate-600">Sesión activa. Puedes usar los módulos del menú lateral.</p>
                            </>
                        ) : (
                            <div className="mt-4 flex flex-1 flex-col justify-between rounded-xl border border-sky-100 bg-sky-50/80 p-4">
                                <p className="text-sm text-sky-950">
                                    Inicia sesión para acceder a rutas protegidas y datos reales del API.
                                </p>
                                <div className="mt-4 flex flex-col gap-2">
                                    <Link
                                        to="/login"
                                        className="inline-flex justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                                    >
                                        Crear cuenta
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-dashed border-slate-300/80 bg-slate-100 px-4 py-3 text-center text-sm text-slate-600">
                    <strong className="font-medium text-slate-800">Próximos pasos:</strong> conectar listados a{' '}
                    <code className="rounded bg-slate-100 px-1 font-mono text-xs">GET /api/products</code> y preparar la vista de{' '}
                    <Link to="/categorias" className="font-medium text-indigo-600 hover:underline">
                        categorías
                    </Link>{' '}
                    por separado.
                </div>
            </div>
        </div>
    );
}
