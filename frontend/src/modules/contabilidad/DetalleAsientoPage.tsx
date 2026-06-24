import { Ban, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { anularAsiento, obtenerAsiento, type AsientoDetalle } from './api';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}

function estadoClass(estado: AsientoDetalle['estado']) {
  if (estado === 'APROBADO') {
    return 'border-green-200 bg-green-50 text-green-700';
  }

  if (estado === 'ANULADO') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  return 'border-amber-200 bg-amber-50 text-amber-700';
}

export function DetalleAsientoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asiento, setAsiento] = useState<AsientoDetalle | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [anulando, setAnulando] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Asiento no encontrado.');
      setLoading(false);
      return;
    }

    obtenerAsiento(id)
      .then(setAsiento)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el asiento.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function anular() {
    if (!id || !window.confirm('¿Desea anular este asiento?')) {
      return;
    }

    setAnulando(true);
    setError('');
    try {
      await anularAsiento(id);
      const actualizado = await obtenerAsiento(id);
      setAsiento(actualizado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo anular el asiento.');
    } finally {
      setAnulando(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Cargando...</div>;
  }

  if (!asiento) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/asientos')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-800 hover:text-violet-950"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/asientos" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-800 hover:text-violet-950">
            <ChevronLeft className="h-4 w-4" />
            Libro Diario
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-violet-950">Asiento #{asiento.numero}</h1>
          <p className="text-sm text-slate-500">{asiento.descripcion}</p>
        </div>
        {asiento.estado !== 'ANULADO' && (
          <button
            type="button"
            disabled={anulando}
            onClick={anular}
            className="erp-danger-button"
          >
            <Ban className="h-4 w-4" />
            {anulando ? 'Anulando...' : 'Anular Asiento'}
          </button>
        )}
      </div>

      <section className="erp-card p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Fecha</div>
            <div className="mt-1 font-bold text-slate-900">{formatDate(asiento.fecha)}</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Estado</div>
            <span className={['mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold', estadoClass(asiento.estado)].join(' ')}>
              {asiento.estado}
            </span>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Tipo</div>
            <div className="mt-1 font-bold text-slate-900">{asiento.tipo}</div>
          </div>
          <div className="rounded-xl bg-violet-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-violet-700">Total Debe</div>
            <div className="mt-1 font-black text-violet-950">{asiento.totales.debe}</div>
          </div>
          <div className="rounded-xl bg-violet-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-violet-700">Total Haber</div>
            <div className="mt-1 font-black text-violet-950">{asiento.totales.haber}</div>
          </div>
        </div>
      </section>

      <section className="erp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="erp-table min-w-[820px]">
            <thead className="erp-table-head">
              <tr>
                <th className="px-5 py-3">Cuenta</th>
                <th className="px-5 py-3">Detalle</th>
                <th className="px-5 py-3 text-right">Debe</th>
                <th className="px-5 py-3 text-right">Haber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {asiento.lineas.map((linea) => (
                <tr key={linea.id} className="transition hover:bg-violet-50/35">
                  <td className="px-5 py-4">
                    <div className="font-black text-violet-950">{linea.cuenta.codigo}</div>
                    <div className="text-slate-500">{linea.cuenta.nombre}</div>
                  </td>
                  <td className="px-5 py-4">{linea.detalle}</td>
                  <td className="px-5 py-4 text-right font-semibold">{linea.debe}</td>
                  <td className="px-5 py-4 text-right font-semibold">{linea.haber}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-slate-200 bg-slate-50">
              <tr>
                <td colSpan={2} className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Totales
                </td>
                <td className="px-5 py-4 text-right font-black text-violet-950">{asiento.totales.debe}</td>
                <td className="px-5 py-4 text-right font-black text-violet-950">{asiento.totales.haber}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
    </div>
  );
}
