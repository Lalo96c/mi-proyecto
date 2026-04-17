import { ModulePlaceholderPage } from './modules/ModulePlaceholder';

export function CategoriasPage() {
  return (
    <ModulePlaceholderPage
      eyebrow="Catálogo"
      title="Categorías"
      description="Organización y clasificación de productos. Aquí irá el CRUD cuando conectes el API."
    />
  );
}

export function SoportePage() {
  return (
    <ModulePlaceholderPage
      eyebrow="Soporte"
      title="Soporte técnico"
      description="Incidencias, tickets y ayuda."
    />
  );
}
