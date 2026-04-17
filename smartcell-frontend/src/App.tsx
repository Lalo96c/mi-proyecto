import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './modules/auth';
import {
  ClientesPage,
  HomeDashboard,
  HomePage,
  ProductosPage,
  SoportePage,
  VentasPage,
} from './pages';
import type { ReactNode } from 'react';

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-dvh min-h-0 max-h-dvh flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />}>
              <Route index element={<HomeDashboard />} />
              <Route
                path="productos"
                element={
                  <ProtectedRoute>
                    <ProductosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ventas"
                element={
                  <ProtectedRoute>
                    <VentasPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="clientes"
                element={
                  <ProtectedRoute>
                    <ClientesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="soporte" element={<SoportePage />} />
            </Route>
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
