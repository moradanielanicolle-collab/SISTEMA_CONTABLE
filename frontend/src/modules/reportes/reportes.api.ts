import api from '../../api/axios';

export type ApiError = {
  codigo?: string;
  mensaje?: string;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error?: ApiError;
      message?: string;
    };

export type ReporteFiltros = {
  fechaDesde?: string;
  fechaHasta?: string;
  empresaId?: string;
  periodoId?: string;
  estado?: string;
};

export type MovimientoMayor = {
  asientoId: string;
  fecha: string;
  numero: number;
  descripcion: string;
  detalle: string | null;
  debe: string;
  haber: string;
  saldo: string;
};

export type CuentaLibroMayor = {
  cuentaId: string;
  codigoCuenta: string;
  nombreCuenta: string;
  tipoCuenta: string;
  naturaleza: string;
  totalDebe: string;
  totalHaber: string;
  saldo: string;
  movimientos: MovimientoMayor[];
};

export type CuentaBalanceComprobacion = {
  cuentaId: string;
  codigoCuenta: string;
  nombreCuenta: string;
  naturaleza: string;
  totalDebe: string;
  totalHaber: string;
  saldo: string;
};

export type BalanceComprobacion = {
  cuentas: CuentaBalanceComprobacion[];
  totales: {
    totalDebe: string;
    totalHaber: string;
    cuadrado: boolean;
  };
};

export type EstadoResultados = {
  totalIngresos: string;
  totalCostos: string;
  totalGastos: string;
  utilidadNeta: string;
};

export type EstadoSituacionFinanciera = {
  totalActivos: string;
  totalPasivos: string;
  totalPatrimonio: string;
  detallePatrimonio: {
    patrimonioContable: string;
    resultadoEjercicio: string;
  };
  ecuacionContable: {
    activos: string;
    pasivosMasPatrimonio: string;
    cuadrada: boolean;
  };
};

export function formatContable(value: string) {
  const normalized = String(value);
  const sign = normalized.startsWith('-') ? '-' : '';
  const unsigned = sign ? normalized.slice(1) : normalized;
  const [units, decimals] = unsigned.split('.');

  if (!/^\d+$/.test(units)) {
    return normalized;
  }

  const withThousands = units.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${sign}${withThousands}${decimals !== undefined ? `.${decimals}` : ''}`;
}

export async function obtenerLibroMayor(filtros: ReporteFiltros) {
  const response = await api.get<ApiResponse<CuentaLibroMayor[]>>('/api/reportes/libro-mayor', {
    params: cleanParams(filtros),
  });

  return unwrap(response.data);
}

export async function obtenerBalanceComprobacion(filtros: ReporteFiltros) {
  const response = await api.get<ApiResponse<BalanceComprobacion>>('/api/reportes/balance-comprobacion', {
    params: cleanParams(filtros),
  });

  return unwrap(response.data);
}

export async function obtenerEstadoResultados(filtros: ReporteFiltros) {
  const response = await api.get<ApiResponse<EstadoResultados>>('/api/reportes/estado-resultados', {
    params: cleanParams(filtros),
  });

  return unwrap(response.data);
}

export async function obtenerEstadoSituacionFinanciera(filtros: ReporteFiltros) {
  const response = await api.get<ApiResponse<EstadoSituacionFinanciera>>(
    '/api/reportes/estado-situacion-financiera',
    {
      params: cleanParams(filtros),
    },
  );

  return unwrap(response.data);
}

function cleanParams(filtros: ReporteFiltros) {
  return Object.fromEntries(Object.entries(filtros).filter(([, value]) => value !== undefined && value.trim() !== ''));
}

function unwrap<T>(response: ApiResponse<T>) {
  if (!response.success) {
    const message = response.error?.mensaje ?? response.message ?? 'No se pudo cargar el reporte.';
    const code = response.error?.codigo;

    throw new Error(code ? `${code}: ${message}` : message);
  }

  return response.data;
}
