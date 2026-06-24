import { Eye, FilePlus2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarAsientos, type AsientoResumen } from './api';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value));
}

function estadoClass(estado: AsientoResumen['estado']) {
  if (estado === 'APROBADO') {
    return 'border-green-200 bg-green-50 text-green-700';
  }

  if (estado === 'ANULADO') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  return 'border-amber-200 bg-amber-50 text-amber-700';
}

export function LibroDiarioPage() {
  const [asientos, setAsientos] = useState<AsientoResumen[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarAsientos()
      .then(setAsientos)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el libro diario.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-violet-950">Libro Diario</h1>
          <p className="text-sm text-slate-500">Asientos registrados en orden operativo.</p>
        </div>
        <Link
          to="/asientos/nuevo"
          className="erp-primary-button"
        >
          <FilePlus2 className="h-4 w-4" />
          Nuevo Asiento
        </Link>
      </div>

      <section className="grid gap-4">
        {asientos.map((asiento) => (
          <article key={asiento.id} className="erp-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(91,33,182,0.14)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Número</div>
                  <div className="mt-1 text-lg font-black text-violet-950">#{asiento.numero}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Fecha</div>
                  <div className="mt-1 font-semibold text-slate-800">{formatDate(asiento.fecha)}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-semibold uppercase text-slate-500">Descripción</div>
                  <div className="mt-1 font-medium text-slate-800">{asiento.descripcion}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Estado</div>
                  <span className={['mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold', estadoClass(asiento.estado)].join(' ')}>
                    {asiento.estado}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Tipo</div>
                  <div className="mt-1 font-semibold text-slate-800">{asiento.tipo}</div>
                </div>
              </div>
              <Link
                to={`/asientos/${asiento.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-800 transition hover:-translate-y-0.5 hover:bg-violet-100"
              >
                <Eye className="h-4 w-4" />
                Ver Detalle
              </Link>
            </div>
          </article>
        ))}
        {!loading && asientos.length === 0 && (
          <div className="erp-card px-4 py-10 text-center text-sm text-slate-500">No hay asientos registrados.</div>
        )}
      </section>

      {loading && <div className="text-sm text-slate-500">Cargando...</div>}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
    </div>
  );
}
