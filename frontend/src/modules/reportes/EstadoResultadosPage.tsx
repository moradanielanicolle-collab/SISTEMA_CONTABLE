import { Banknote, MinusCircle, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FiltrosReporte } from './FiltrosReporte';
import {
  formatContable,
  obtenerEstadoResultados,
  type EstadoResultados,
  type ReporteFiltros,
} from './reportes.api';

const metricas = [
  {
    key: 'totalIngresos',
    label: 'Ingresos',
    icon: TrendingUp,
    tone: 'text-green-700 bg-green-50',
  },
  {
    key: 'totalCostos',
    label: 'Costos',
    icon: WalletCards,
    tone: 'text-sky-800 bg-sky-50',
  },
  {
    key: 'totalGastos',
    label: 'Gastos',
    icon: MinusCircle,
    tone: 'text-amber-800 bg-amber-50',
  },
  {
    key: 'utilidadNeta',
    label: 'Utilidad Neta',
    icon: Banknote,
    tone: 'text-violet-900 bg-violet-100',
  },
] as const;

export function EstadoResultadosPage() {
  const [estadoResultados, setEstadoResultados] = useState<EstadoResultados | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReporte({});
  }, []);

  async function cargarReporte(filtros: ReporteFiltros) {
    setLoading(true);
    setError('');

    try {
      const data = await obtenerEstadoResultados(filtros);
      setEstadoResultados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el estado de resultados.');
      setEstadoResultados(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-violet-950">Estado de Resultados</h1>
        <p className="text-sm text-slate-500">Resumen de ingresos, costos, gastos y utilidad del período.</p>
      </div>

      <FiltrosReporte loading={loading} onConsultar={cargarReporte} />

      {estadoResultados ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricas.map((metrica) => {
            const Icon = metrica.icon;

            return (
              <article key={metrica.key} className="erp-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(91,33,182,0.14)]">
                <div
                  className={[
                    'mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl',
                    metrica.tone,
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-slate-500">{metrica.label}</div>
                <div className="mt-1 text-2xl font-black text-violet-950">
                  {formatContable(estadoResultados[metrica.key])}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        !loading && (
          <section className="erp-card px-4 py-8 text-center text-sm text-slate-500">
            Sin datos para los filtros seleccionados.
          </section>
        )
      )}

      {loading && <div className="text-sm text-slate-500">Cargando...</div>}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
    </div>
  );
}
