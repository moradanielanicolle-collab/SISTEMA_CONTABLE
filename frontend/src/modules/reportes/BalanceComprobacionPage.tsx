import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FiltrosReporte } from './FiltrosReporte';
import {
  formatContable,
  obtenerBalanceComprobacion,
  type BalanceComprobacion,
  type ReporteFiltros,
} from './reportes.api';

export function BalanceComprobacionPage() {
  const [balance, setBalance] = useState<BalanceComprobacion | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReporte({});
  }, []);

  async function cargarReporte(filtros: ReporteFiltros) {
    setLoading(true);
    setError('');

    try {
      const data = await obtenerBalanceComprobacion(filtros);
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el balance de comprobación.');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }

  const cuadrado = balance?.totales.cuadrado ?? false;
  const EstadoIcon = cuadrado ? CheckCircle2 : AlertTriangle;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-violet-950">Balance de Comprobación</h1>
        <p className="text-sm text-slate-500">Verificación de movimientos deudores y acreedores por cuenta.</p>
      </div>

      <FiltrosReporte loading={loading} onConsultar={cargarReporte} />

      <section className="erp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="erp-table min-w-[820px]">
            <thead className="erp-table-head">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cuenta</th>
                <th className="px-4 py-3 text-right">Debe</th>
                <th className="px-4 py-3 text-right">Haber</th>
                <th className="px-4 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {balance?.cuentas.map((cuenta) => (
                <tr key={cuenta.cuentaId} className="transition hover:bg-violet-50/35">
                  <td className="px-4 py-3 font-black text-violet-950">{cuenta.codigoCuenta}</td>
                  <td className="px-4 py-3">{cuenta.nombreCuenta}</td>
                  <td className="px-4 py-3 text-right">{formatContable(cuenta.totalDebe)}</td>
                  <td className="px-4 py-3 text-right">{formatContable(cuenta.totalHaber)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatContable(cuenta.saldo)}</td>
                </tr>
              ))}
              {!loading && (!balance || balance.cuentas.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Sin datos para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {balance && (
        <section className="erp-card grid gap-4 p-5 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Total Debe</div>
            <div className="mt-1 text-xl font-black text-slate-950">{formatContable(balance.totales.totalDebe)}</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Total Haber</div>
            <div className="mt-1 text-xl font-black text-slate-950">{formatContable(balance.totales.totalHaber)}</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Estado</div>
            <div
              className={[
                'mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold',
                cuadrado ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800',
              ].join(' ')}
            >
              <EstadoIcon className="h-4 w-4" />
              {cuadrado ? '✓ Balance Cuadrado' : '⚠ Balance Descuadrado'}
            </div>
          </div>
        </section>
      )}

      {loading && <div className="text-sm text-slate-500">Cargando...</div>}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
    </div>
  );
}
