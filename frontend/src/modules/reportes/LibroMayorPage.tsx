import { ChevronDown, ChevronRight } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { FiltrosReporte } from './FiltrosReporte';
import {
  formatContable,
  obtenerLibroMayor,
  type CuentaLibroMayor,
  type ReporteFiltros,
} from './reportes.api';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}

export function LibroMayorPage() {
  const [cuentas, setCuentas] = useState<CuentaLibroMayor[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReporte({});
  }, []);

  async function cargarReporte(filtros: ReporteFiltros) {
    setLoading(true);
    setError('');

    try {
      const data = await obtenerLibroMayor(filtros);
      setCuentas(data);
      setExpanded(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el libro mayor.');
      setCuentas([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleCuenta(cuentaId: string) {
    setExpanded((actuales) => {
      const next = new Set(actuales);
      if (next.has(cuentaId)) {
        next.delete(cuentaId);
      } else {
        next.add(cuentaId);
      }

      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-violet-950">Libro Mayor</h1>
        <p className="text-sm text-slate-500">Saldos por cuenta y movimientos contables asociados.</p>
      </div>

      <FiltrosReporte loading={loading} onConsultar={cargarReporte} />

      <section className="erp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="erp-table min-w-[920px]">
            <thead className="erp-table-head">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cuenta</th>
                <th className="px-4 py-3">Naturaleza</th>
                <th className="px-4 py-3 text-right">Debe</th>
                <th className="px-4 py-3 text-right">Haber</th>
                <th className="px-4 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cuentas.map((cuenta) => {
                const isExpanded = expanded.has(cuenta.cuentaId);
                const Icon = isExpanded ? ChevronDown : ChevronRight;

                return (
                  <Fragment key={cuenta.cuentaId}>
                    <tr className="transition hover:bg-violet-50/35">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleCuenta(cuenta.cuentaId)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-violet-800 transition hover:bg-violet-100"
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-black text-violet-950">{cuenta.codigoCuenta}</td>
                      <td className="px-4 py-3">{cuenta.nombreCuenta}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800">
                          {cuenta.naturaleza}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{formatContable(cuenta.totalDebe)}</td>
                      <td className="px-4 py-3 text-right">{formatContable(cuenta.totalHaber)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatContable(cuenta.saldo)}</td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${cuenta.cuentaId}-movimientos`}>
                        <td colSpan={7} className="bg-slate-50 px-4 py-4">
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-inner">
                            <table className="w-full min-w-[760px] text-sm">
                              <thead className="bg-violet-50 text-left text-xs uppercase text-violet-900">
                                <tr>
                                  <th className="px-4 py-3">Fecha</th>
                                  <th className="px-4 py-3">Asiento</th>
                                  <th className="px-4 py-3">Descripción</th>
                                  <th className="px-4 py-3">Detalle</th>
                                  <th className="px-4 py-3 text-right">Debe</th>
                                  <th className="px-4 py-3 text-right">Haber</th>
                                  <th className="px-4 py-3 text-right">Saldo</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {cuenta.movimientos.map((movimiento) => (
                                  <tr key={`${cuenta.cuentaId}-${movimiento.asientoId}-${movimiento.numero}`}>
                                    <td className="px-4 py-3">{formatDate(movimiento.fecha)}</td>
                                    <td className="px-4 py-3 font-medium">#{movimiento.numero}</td>
                                    <td className="px-4 py-3">{movimiento.descripcion}</td>
                                    <td className="px-4 py-3 text-slate-600">{movimiento.detalle ?? '-'}</td>
                                    <td className="px-4 py-3 text-right">{formatContable(movimiento.debe)}</td>
                                    <td className="px-4 py-3 text-right">{formatContable(movimiento.haber)}</td>
                                    <td className="px-4 py-3 text-right font-medium">
                                      {formatContable(movimiento.saldo)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!loading && cuentas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Sin datos para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {loading && <div className="text-sm text-slate-500">Cargando...</div>}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
    </div>
  );
}
