import { Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearAsiento, type Cuenta } from './api';
import { CuentaAutocomplete } from './CuentaAutocomplete';

type LineaForm = {
  id: string;
  cuenta: Cuenta | null;
  detalle: string;
  debe: string;
  haber: string;
};

const tipos = ['APERTURA', 'MANUAL', 'AUTOMATICO', 'AJUSTE', 'CIERRE'];

function nuevaLinea(): LineaForm {
  return {
    id: crypto.randomUUID(),
    cuenta: null,
    detalle: '',
    debe: '',
    haber: '',
  };
}

function toNumber(value: string) {
  const parsed = Number(value || 0);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-EC', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function NuevoAsientoPage() {
  const navigate = useNavigate();
  const [empresaId, setEmpresaId] = useState(() => localStorage.getItem('empresaId') ?? '');
  const [fecha, setFecha] = useState('2026-01-15');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('MANUAL');
  const [lineas, setLineas] = useState<LineaForm[]>([nuevaLinea(), nuevaLinea()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const totalDebe = useMemo(
    () => lineas.reduce((total, linea) => total + toNumber(linea.debe), 0),
    [lineas],
  );
  const totalHaber = useMemo(
    () => lineas.reduce((total, linea) => total + toNumber(linea.haber), 0),
    [lineas],
  );
  const cuadrado = totalDebe > 0 && totalDebe === totalHaber;
  const puedeGuardar =
    cuadrado && empresaId.trim() && fecha && descripcion.trim() && lineas.every((linea) => linea.cuenta);

  function actualizarLinea(id: string, patch: Partial<LineaForm>) {
    setLineas((actuales) => actuales.map((linea) => (linea.id === id ? { ...linea, ...patch } : linea)));
  }

  async function guardar() {
    if (!puedeGuardar || saving) {
      return;
    }

    setSaving(true);
    setError('');
    localStorage.setItem('empresaId', empresaId.trim());

    try {
      const asiento = await crearAsiento({
        empresaId: empresaId.trim(),
        fecha,
        descripcion,
        tipo,
        lineas: lineas.map((linea) => ({
          cuentaId: linea.cuenta?.id ?? '',
          detalle: linea.detalle,
          debe: toNumber(linea.debe),
          haber: toNumber(linea.haber),
        })),
      });

      navigate(`/asientos/${asiento.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el asiento.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-violet-950">Nuevo Asiento</h1>
        <p className="text-sm text-slate-500">Registro manual contra el período abierto correspondiente.</p>
      </div>

      <section className="erp-card p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-4">
          <label className="space-y-2 lg:col-span-2">
            <span className="erp-label">ID de la empresa</span>
            <input
              value={empresaId}
              onChange={(event) => setEmpresaId(event.target.value)}
              className="erp-field"
            />
          </label>
          <label className="space-y-2">
            <span className="erp-label">Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              className="erp-field"
            />
          </label>
          <label className="space-y-2">
            <span className="erp-label">Tipo Asiento</span>
            <select
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              className="erp-field"
            >
              {tipos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 lg:col-span-4">
            <span className="erp-label">Descripción</span>
            <input
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              className="erp-field"
            />
          </label>
        </div>
      </section>

      <section className="erp-card overflow-hidden">
        <div className="flex flex-col gap-3 bg-gradient-to-r from-purple-200 via-violet-100 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-black uppercase tracking-wide text-violet-950">Líneas</h2>
          <button
            type="button"
            onClick={() => setLineas((actuales) => [...actuales, nuevaLinea()])}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(46,16,101,0.30)] transition hover:-translate-y-0.5 hover:bg-violet-900"
          >
            <Plus className="h-4 w-4" />
            Agregar línea
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="erp-table min-w-[920px]">
            <thead className="erp-table-head">
              <tr>
                <th className="px-5 py-3">Cuenta</th>
                <th className="px-5 py-3">Detalle</th>
                <th className="px-5 py-3 text-right">Debe</th>
                <th className="px-5 py-3 text-right">Haber</th>
                <th className="w-14 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineas.map((linea) => (
                <tr key={linea.id} className="bg-white transition hover:bg-violet-50/35">
                  <td className="px-5 py-3">
                    <CuentaAutocomplete
                      value={linea.cuenta}
                      onChange={(cuenta) => actualizarLinea(linea.id, { cuenta })}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      value={linea.detalle}
                      onChange={(event) => actualizarLinea(linea.id, { detalle: event.target.value })}
                      className="erp-field"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={linea.debe}
                      onChange={(event) => actualizarLinea(linea.id, { debe: event.target.value })}
                      className="erp-field text-right"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={linea.haber}
                      onChange={(event) => actualizarLinea(linea.id, { haber: event.target.value })}
                      className="erp-field text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setLineas((actuales) => actuales.filter((item) => item.id !== linea.id))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="erp-card flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Debe Total</div>
            <div className="mt-1 text-xl font-bold text-slate-950">{formatMoney(totalDebe)}</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase text-slate-500">Total Haber</div>
            <div className="mt-1 text-xl font-bold text-slate-950">{formatMoney(totalHaber)}</div>
          </div>
          <div className={['rounded-xl border px-4 py-3 shadow-sm', cuadrado ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'].join(' ')}>
            <div className="text-xs font-semibold uppercase text-slate-500">Estado</div>
            <div className={cuadrado ? 'mt-1 text-lg font-black text-green-700' : 'mt-1 text-lg font-black text-red-600'}>
              {cuadrado ? '✓ CUADRADO' : '✗ DESCUADRADO'}
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={!puedeGuardar || saving}
          onClick={guardar}
          className="erp-primary-button md:self-end"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
    </div>
  );
}
