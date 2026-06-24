import { AlertTriangle, CheckCircle2, Landmark, Scale, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FiltrosReporte } from './FiltrosReporte';
import {
  formatContable,
  obtenerEstadoSituacionFinanciera,
  type EstadoSituacionFinanciera,
  type ReporteFiltros,
} from './reportes.api';

export function EstadoSituacionFinancieraPage() {
  const [estadoSituacion, setEstadoSituacion] = useState<EstadoSituacionFinanciera | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReporte({});
  }, []);

  async function cargarReporte(filtros: ReporteFiltros) {
    setLoading(true);
    setError('');

    try {
      const data = await obtenerEstadoSituacionFinanciera(filtros);
      setEstadoSituacion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el estado de situación financiera.');
      setEstadoSituacion(null);
    } finally {
      setLoading(false);
    }
  }

  const cuadrada = estadoSituacion?.ecuacionContable.cuadrada ?? false;
  const EstadoIcon = cuadrada ? CheckCircle2 : AlertTriangle;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-violet-950">Estado de Situación Financiera</h1>
        <p className="text-sm text-slate-500">Vista de activos, pasivos, patrimonio y ecuación contable.</p>
      </div>

      <FiltrosReporte loading={loading} onConsultar={cargarReporte} />

      {estadoSituacion ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="erp-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(91,33,182,0.14)]">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold uppercase text-slate-500">Activos</div>
              <div className="mt-1 text-sm text-slate-500">Total Activos</div>
              <div className="text-2xl font-black text-violet-950">{formatContable(estadoSituacion.totalActivos)}</div>
            </article>
            <article className="erp-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(91,33,182,0.14)]">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-800">
                <Scale className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold uppercase text-slate-500">Pasivos</div>
              <div className="mt-1 text-sm text-slate-500">Total Pasivos</div>
              <div className="text-2xl font-black text-violet-950">{formatContable(estadoSituacion.totalPasivos)}</div>
            </article>
            <article className="erp-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(91,33,182,0.14)]">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold uppercase text-slate-500">Patrimonio</div>
              <div className="mt-1 text-sm text-slate-500">Total Patrimonio</div>
              <div className="text-2xl font-black text-violet-950">
                {formatContable(estadoSituacion.totalPatrimonio)}
              </div>
            </article>
          </section>

          <section className="erp-card p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase text-slate-500">Patrimonio Contable</div>
                <div className="mt-1 text-lg font-black text-slate-950">
                  {formatContable(estadoSituacion.detallePatrimonio.patrimonioContable)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase text-slate-500">Resultado del Ejercicio</div>
                <div className="mt-1 text-lg font-black text-slate-950">
                  {formatContable(estadoSituacion.detallePatrimonio.resultadoEjercicio)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase text-slate-500">Estado</div>
                <div
                  className={[
                    'mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold',
                    cuadrada ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800',
                  ].join(' ')}
                >
                  <EstadoIcon className="h-4 w-4" />
                  {cuadrada ? '✓ Ecuación Contable Cuadrada' : '⚠ Revisar saldos'}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-950">
              Activos = Pasivos + Patrimonio: {formatContable(estadoSituacion.ecuacionContable.activos)} ={' '}
              {formatContable(estadoSituacion.ecuacionContable.pasivosMasPatrimonio)}
            </div>
          </section>
        </>
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
