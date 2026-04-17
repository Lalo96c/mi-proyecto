import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { type StylesConfig } from 'react-select';
import type { ApiProduct } from '../types/product';
import { fetchProduct, fetchProducts } from '../api/productsService';

type Option = {
  value: number;
  label: string;
  product: ApiProduct;
};

const selectStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 38,
    borderRadius: 8,
    borderColor: state.isFocused ? '#818cf8' : '#e2e8f0',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
    fontSize: '0.875rem',
  }),
  valueContainer: (base) => ({ ...base, paddingLeft: 10 }),
  placeholder: (base) => ({ ...base, color: '#94a3b8' }),
  singleValue: (base) => ({ ...base, color: '#0f172a' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  }),
};

type Props = {
  id: string;
  label: string;
  value: number | null;
  onChange: (product: ApiProduct | null) => void;
  disabled?: boolean;
};

export function ProductSearchSelect({
  id,
  label,
  value,
  onChange,
  disabled,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }

    let active = true;

    fetchProduct(value)
      .then((product) => {
        if (!active) return;
        setSelectedOption({
          value: product.id,
          label: `${product.name} (${product.code})`,
          product,
        });
      })
      .catch(() => {
        if (active) setSelectedOption(null);
      });

    return () => {
      active = false;
    };
  }, [value]);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    try {
      const res = await fetchProducts({
        search: inputValue,
        per_page: 10,
      });

      const products: ApiProduct[] = res.data ?? [];

      return products.map((p) => {
        const labelParts = [p.name, p.code].filter(Boolean);
        return {
          value: p.id,
          label: labelParts.length ? labelParts.join(' - ') : `Producto #${p.id}`,
          product: p,
        };
      });
    } catch (error) {
      console.error('Error buscando productos:', error);
      return [];
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="mt-1">
        <AsyncSelect<Option, false>
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          inputId={id}
          value={selectedOption}
          onChange={(opt) => {
            setSelectedOption(opt ?? null);
            onChange(opt ? opt.product : null);
          }}
          placeholder="Buscar producto…"
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