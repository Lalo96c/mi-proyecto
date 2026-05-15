import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { type StylesConfig } from 'react-select';
import { fetchTechnicians } from '../api/techniciansService';

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
    color: '#94a3b8',
    '&:hover': { color: '#64748b' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#94a3b8',
    '&:hover': { color: '#64748b' },
  }),
};

type TechnicianSearchSelectProps = {
  value?: number | null;
  onChange: (technicianId: number | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  menuPortalTarget?: HTMLElement;
};

export function TechnicianSearchSelect({
  value,
  onChange,
  placeholder = 'Buscar técnico...',
  isDisabled = false,
  menuPortalTarget,
}: TechnicianSearchSelectProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  // Load selected technician when value changes
  useEffect(() => {
    if (value) {
      fetchTechnicians({ per_page: 100, status: 'activo' })
        .then((response) => {
          const technician = response.data.find((t) => t.id === value);
          if (technician) {
            setSelectedOption({
              value: technician.id,
              label: `${technician.name} (${technician.specialty})`,
            });
          }
        })
        .catch(() => {
          // Ignore errors when loading selected technician
        });
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    try {
      const response = await fetchTechnicians({
        per_page: 50,
        status: 'activo',
      });

      const options = response.data
        .filter((technician) =>
          technician.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          technician.specialty.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((technician) => ({
          value: technician.id,
          label: `${technician.name} (${technician.specialty})`,
        }));

      return options;
    } catch (error) {
      console.error('Error loading technicians:', error);
      return [];
    }
  };

  const handleChange = (option: Option | null) => {
    setSelectedOption(option);
    onChange(option?.value ?? null);
  };

  return (
    <AsyncSelect
      value={selectedOption}
      onChange={handleChange}
      loadOptions={loadOptions}
      defaultOptions
      placeholder={placeholder}
      isDisabled={isDisabled}
      styles={selectStyles}
      menuPortalTarget={menuPortalTarget}
      isClearable
      cacheOptions
      loadingMessage={() => 'Cargando técnicos...'}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? 'No se encontraron técnicos' : 'Escribe para buscar técnicos'
      }
    />
  );
}