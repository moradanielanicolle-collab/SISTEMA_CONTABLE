import { Search } from 'lucide-react';
import { useState } from 'react';
import type { ReporteFiltros } from './reportes.api';

type FiltrosReporteProps = {
  loading?: boolean;
  onConsultar: (filtros: ReporteFiltros) => void;
};

const estados = ['', 'BORRADOR', 'APROBADO', 'ANULADO'];

export function FiltrosReporte({ loading = false, onConsultar }: FiltrosReporteProps) {
  const [filtros, setFiltros] = useState<ReporteFiltros>({
    fechaDesde: '',
    fechaHasta: '',
    empresaId: '',
    periodoId: '',
    estado: '',
  });

  function actualizarFiltro(name: keyof ReporteFiltros, value: string) {
    setFiltros((actuales) => ({
      ...actuales,
      [name]: value,
    }));
  }

  function consultar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConsultar(filtros);
  }

  return (
    <form onSubmit={consultar} className="erp-card p-5">
      <div className="grid gap-4 md:grid-cols-6">
        <label className="space-y-2">
          <span className="erp-label">Fecha desde</span>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(event) => actualizarFiltro('fechaDesde', event.target.value)}
            className="erp-field"
          />
        </label>
        <label className="space-y-2">
          <span className="erp-label">Fecha hasta</span>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(event) => actualizarFiltro('fechaHasta', event.target.value)}
            className="erp-field"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="erp-label">Empresa ID</span>
          <input
            value={filtros.empresaId}
            onChange={(event) => actualizarFiltro('empresaId', event.target.value)}
            className="erp-field"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="erp-label">Periodo ID</span>
          <input
            value={filtros.periodoId}
            onChange={(event) => actualizarFiltro('periodoId', event.target.value)}
            className="erp-field"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="erp-label">Estado</span>
          <select
            value={filtros.estado}
            onChange={(event) => actualizarFiltro('estado', event.target.value)}
            className="erp-field"
          >
            {estados.map((estado) => (
              <option key={estado || 'todos'} value={estado}>
                {estado || 'Todos'}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end md:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="erp-primary-button w-full sm:w-auto"
          >
            <Search className="h-4 w-4" />
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </div>
    </form>
  );
}
