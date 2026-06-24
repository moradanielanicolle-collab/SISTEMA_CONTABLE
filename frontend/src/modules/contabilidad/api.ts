import api from '../../api/axios';

export type ApiError = {
  codigo: string;
  mensaje: string;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiError;
    };

export type Cuenta = {
  id: string;
  codigo: string;
  nombre: string;
};

export type AsientoResumen = {
  id: string;
  fecha: string;
  numero: number;
  descripcion: string;
  estado: 'BORRADOR' | 'APROBADO' | 'ANULADO';
  tipo: 'APERTURA' | 'MANUAL' | 'AUTOMATICO' | 'AJUSTE' | 'CIERRE';
  origen: string;
};

export type AsientoDetalle = AsientoResumen & {
  empresaId: string;
  periodoId: string;
  asientoReversoDeId: string | null;
  anuladoPorId: string | null;
  lineas: Array<{
    id: string;
    orden: number;
    detalle: string | null;
    debe: string;
    haber: string;
    cuenta: Cuenta;
  }>;
  totales: {
    debe: string;
    haber: string;
  };
};

export type NuevaLineaAsiento = {
  cuentaId: string;
  detalle: string;
  debe: number;
  haber: number;
};

export type NuevoAsientoPayload = {
  empresaId: string;
  fecha: string;
  descripcion: string;
  tipo: string;
  lineas: NuevaLineaAsiento[];
};

export async function buscarCuentas(buscar: string) {
  const response = await api.get<ApiResponse<Cuenta[]>>('/api/cuentas', {
    params: {
      buscar,
    },
  });

  return unwrap(response.data);
}

export async function listarAsientos() {
  const response = await api.get<ApiResponse<AsientoResumen[]>>('/api/asientos');

  return unwrap(response.data);
}

export async function obtenerAsiento(id: string) {
  const response = await api.get<ApiResponse<AsientoDetalle>>(`/api/asientos/${id}`);

  return unwrap(response.data);
}

export async function crearAsiento(payload: NuevoAsientoPayload) {
  const response = await api.post<ApiResponse<AsientoDetalle>>('/api/asientos', payload);

  return unwrap(response.data);
}

export async function anularAsiento(id: string) {
  const response = await api.post<ApiResponse<{ asientoOriginal: string; asientoReverso: string }>>(
    `/api/asientos/${id}/anular`,
  );

  return unwrap(response.data);
}

function unwrap<T>(response: ApiResponse<T>) {
  if (!response.success) {
    throw new Error(`${response.error.codigo}: ${response.error.mensaje}`);
  }

  return response.data;
}
