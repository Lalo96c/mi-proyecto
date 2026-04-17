import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { type StylesConfig } from 'react-select';
import type { ApiClient } from '../types/sale';
import { clientDisplayName } from '../types/sale';
import { fetchClient, fetchClients } from '../api/clientsService';

type Option = { value: number; label: string };

const selectStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 38,
    borderRadius: 8,
    borderColor: state.isFocused ? '#818cf8' : '#e2e8f0',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
    fontSize: '0.875rem',
    '&:hover': {
      borderColor: state.isFocused ? '#818cf8' : '#cbd5e1',
    },
  }),
  valueContainer: (base) => ({ ...base, paddingLeft: 10 }),
  placeholder: (base) => ({ ...base, color: '#94a3b8' }),
  input: (base) => ({ ...base, margin: 0, padding: 0 }),
  singleValue: (base) => ({ ...base, color: '#0f172a' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    cursor: 'pointer',
    backgroundColor: state.isSelected
      ? '#4f46e5'
      : state.isFocused
        ? '#eef2ff'
        : 'white',
    color: state.isSelected ? 'white' : '#0f172a',
    ':active': {
      backgroundColor: state.isSelected ? '#4f46e5' : '#e0e7ff',
    },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#64748b',
    paddingRight: 8,
  }),
};

type ClientSearchSelectProps = {
  id: string;
  label: string;
  value: number | null;
  onChange: (clientId: number) => void;
  disabled?: boolean;
};

export function ClientSearchSelect({
  id,
  label,
  value,
  onChange,
  disabled,
}: ClientSearchSelectProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }

    let active = true;

    fetchClient(value)
      .then((client) => {
        if (!active) return;
        setSelectedOption({
          value: client.id,
          label: `${clientDisplayName(client)} (${client.dni})`,
        });
      })
      .catch(() => {
        if (active) setSelectedOption(null);
      });

    return () => {
      active = false;
    };
  }, [value]);

  // 🔥 FUNCIÓN QUE CONSULTA AL BACKEND
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    try {
      const res = await fetchClients({
        search: inputValue,
        per_page: 15,
      });

      const clients: ApiClient[] = res.data ?? [];

      return clients.map((c) => {
        const label = clientDisplayName(c);
        return {
          value: c.id,
          label: c.dni ? `${label} (${c.dni})` : label,
        };
      });
    } catch (error) {
      console.error('Error buscando clientes:', error);
      return [];
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="mt-1">
        <AsyncSelect<Option, false>
          cacheOptions
          defaultOptions   // 👈 carga algunos al inicio
          loadOptions={loadOptions}
          inputId={id}
          value={selectedOption}
          onChange={(opt) => {
            setSelectedOption(opt ?? null);
            onChange(opt ? opt.value : 0);
          }}
          placeholder="Buscar por nombre o DNI…"
          isClearable
          isSearchable
          isDisabled={disabled}
          noOptionsMessage={() => 'Sin coincidencias'}
          loadingMessage={() => 'Buscando...'}
          menuPortalTarget={
            typeof document !== 'undefined' ? document.body : null
          }
          menuPosition="fixed"
          styles={selectStyles}
        />
      </div>
    </div>
  );
}