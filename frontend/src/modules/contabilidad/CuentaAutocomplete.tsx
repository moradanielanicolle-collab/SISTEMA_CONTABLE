import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { buscarCuentas, type Cuenta } from './api';

type Props = {
  value: Cuenta | null;
  onChange: (cuenta: Cuenta | null) => void;
};

export function CuentaAutocomplete({ value, onChange }: Props) {
  const [query, setQuery] = useState(value ? `${value.codigo} ${value.nombre}` : '');
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (value) {
      setQuery(`${value.codigo} - ${value.nombre}`);
    }
  }, [value]);

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      if (!open) {
        return;
      }

      setLoading(true);
      try {
        setCuentas(await buscarCuentas(query));
        setActiveIndex(0);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [open, query]);

  function seleccionarCuenta(cuenta: Cuenta) {
    onChange(cuenta);
    setQuery(`${cuenta.codigo} - ${cuenta.nombre}`);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!open || cuentas.length === 0) {
              return;
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((current) => (current + 1) % cuentas.length);
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((current) => (current - 1 + cuentas.length) % cuentas.length);
            }

            if (event.key === 'Enter') {
              event.preventDefault();
              seleccionarCuenta(cuentas[activeIndex]);
            }

            if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          className="erp-field pl-9"
          placeholder="Buscar cuenta"
        />
      </div>
      {open && (
        <div className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          {loading && <div className="px-3 py-2 text-sm text-slate-500">Buscando...</div>}
          {!loading &&
            cuentas.map((cuenta, index) => (
              <button
                type="button"
                key={cuenta.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => seleccionarCuenta(cuenta)}
                className={[
                  'flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm transition',
                  activeIndex === index ? 'bg-violet-50 text-violet-950' : 'hover:bg-violet-50',
                ].join(' ')}
              >
                <span className="font-semibold text-slate-900">{cuenta.codigo} - {cuenta.nombre}</span>
              </button>
            ))}
          {!loading && cuentas.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-500">Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
}
