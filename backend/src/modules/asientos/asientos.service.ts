import { EstadoAsiento, EstadoPeriodo, OrigenAsiento, Prisma, TipoAsiento } from '@prisma/client';
import prisma from '../../config/prisma';
import { ContabilidadService } from '../contabilidad/contabilidad.service';

const contabilidadService = new ContabilidadService();

type ListarAsientosFiltros = {
  empresaId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  estado?: EstadoAsiento;
};

type CrearAsientoInput = {
  empresaId: string;
  fecha: string;
  descripcion: string;
  tipo: TipoAsiento;
  origen?: OrigenAsiento;
  lineas: Array<{
    cuentaId: string;
    detalle?: string;
    debe?: Prisma.Decimal.Value;
    haber?: Prisma.Decimal.Value;
  }>;
};

export class AsientosService {
  async listarAsientos(filtros: ListarAsientosFiltros) {
    const asientos = await prisma.asientoContable.findMany({
      where: this.buildWhere(filtros),
      select: {
        id: true,
        empresaId: true,
        periodoId: true,
        fecha: true,
        numero: true,
        descripcion: true,
        estado: true,
        tipo: true,
        origen: true,
      },
      orderBy: [
        {
          fecha: 'desc',
        },
        {
          numero: 'desc',
        },
      ],
    });

    return asientos;
  }

  async obtenerAsiento(id: string) {
    const asiento = await prisma.asientoContable.findUnique({
      where: {
        id,
      },
      include: {
        lineas: {
          include: {
            cuenta: true,
          },
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });

    if (!asiento) {
      throw new AsientosError('ASIENTO_NO_ENCONTRADO', 'El asiento no existe.');
    }

    return {
      id: asiento.id,
      empresaId: asiento.empresaId,
      periodoId: asiento.periodoId,
      fecha: asiento.fecha,
      numero: asiento.numero,
      descripcion: asiento.descripcion,
      estado: asiento.estado,
      tipo: asiento.tipo,
      origen: asiento.origen,
      asientoReversoDeId: asiento.asientoReversoDeId,
      anuladoPorId: asiento.anuladoPorId,
      lineas: asiento.lineas.map((linea) => ({
        id: linea.id,
        orden: linea.orden,
        detalle: linea.detalle,
        debe: linea.debe.toFixed(2),
        haber: linea.haber.toFixed(2),
        cuenta: linea.cuenta,
      })),
      totales: {
        debe: asiento.lineas.reduce((total, linea) => total.plus(linea.debe), new Prisma.Decimal(0)).toFixed(2),
        haber: asiento.lineas.reduce((total, linea) => total.plus(linea.haber), new Prisma.Decimal(0)).toFixed(2),
      },
    };
  }

  async crearAsiento(input: CrearAsientoInput) {
    const fecha = new Date(input.fecha);

    if (Number.isNaN(fecha.getTime())) {
      throw new AsientosError('VALIDACION', 'La fecha del asiento no es válida.');
    }

    const periodo = await prisma.periodoContable.findFirst({
      where: {
        empresaId: input.empresaId,
        fechaInicio: {
          lte: fecha,
        },
        fechaFin: {
          gte: fecha,
        },
      },
    });

    if (!periodo) {
      throw new AsientosError('PERIODO_NO_EXISTE', 'No existe un período contable para la fecha indicada.');
    }

    if (periodo.estado !== EstadoPeriodo.ABIERTO) {
      throw new AsientosError('PERIODO_CERRADO', 'El período contable está cerrado.');
    }

    try {
      return await contabilidadService.registrarAsiento({
        empresaId: input.empresaId,
        periodoId: periodo.id,
        fecha,
        descripcion: input.descripcion,
        tipo: input.tipo,
        origen: input.origen,
        lineas: input.lineas,
      });
    } catch (error) {
      throw this.mapRegistrarError(error);
    }
  }

  async anularAsiento(id: string) {
    const asiento = await prisma.asientoContable.findUnique({
      where: {
        id,
      },
      include: {
        lineas: {
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });

    if (!asiento) {
      throw new AsientosError('ASIENTO_NO_ENCONTRADO', 'El asiento no existe.');
    }

    if (asiento.estado === EstadoAsiento.ANULADO) {
      throw new AsientosError('ASIENTO_YA_ANULADO', 'El asiento ya está anulado.');
    }

    const reverso = await contabilidadService.registrarAsiento({
      empresaId: asiento.empresaId,
      periodoId: asiento.periodoId,
      fecha: asiento.fecha,
      descripcion: `Anulación asiento #${asiento.numero}: ${asiento.descripcion}`,
      tipo: TipoAsiento.AJUSTE,
      origen: OrigenAsiento.NINGUNO,
      asientoReversoDeId: asiento.id,
      lineas: asiento.lineas.map((linea) => ({
        cuentaId: linea.cuentaId,
        detalle: linea.detalle ? `Reverso: ${linea.detalle}` : 'Reverso de anulación',
        debe: linea.haber,
        haber: linea.debe,
      })),
    });

    await prisma.asientoContable.update({
      where: {
        id: asiento.id,
      },
      data: {
        estado: EstadoAsiento.ANULADO,
        anuladoPorId: reverso.id,
      },
    });

    return {
      asientoOriginal: asiento.id,
      asientoReverso: reverso.id,
    };
  }

  private buildWhere(filtros: ListarAsientosFiltros): Prisma.AsientoContableWhereInput {
    return {
      empresaId: filtros.empresaId,
      estado: filtros.estado,
      fecha: {
        gte: filtros.fechaDesde,
        lte: filtros.fechaHasta,
      },
    };
  }

  private mapRegistrarError(error: unknown) {
    if (!(error instanceof Error)) {
      return new AsientosError('ERROR_INTERNO', 'Error interno.');
    }

    if (error.message.includes('cuadrado')) {
      return new AsientosError('ASIENTO_DESCUADRADO', error.message);
    }

    if (error.message.includes('período contable debe estar ABIERTO')) {
      return new AsientosError('PERIODO_CERRADO', error.message);
    }

    if (error.message.includes('período contable no existe')) {
      return new AsientosError('PERIODO_NO_EXISTE', error.message);
    }

    if (error.message.includes('está inactiva')) {
      return new AsientosError('CUENTA_INACTIVA', error.message);
    }

    if (error.message.includes('cuenta') || error.message.includes('Cuenta')) {
      return new AsientosError('CUENTA_INVALIDA', error.message);
    }

    return new AsientosError('VALIDACION', error.message);
  }
}

export type CodigoErrorAsiento =
  | 'VALIDACION'
  | 'ASIENTO_DESCUADRADO'
  | 'PERIODO_CERRADO'
  | 'PERIODO_NO_EXISTE'
  | 'CUENTA_INVALIDA'
  | 'CUENTA_INACTIVA'
  | 'ASIENTO_NO_ENCONTRADO'
  | 'ASIENTO_YA_ANULADO'
  | 'ERROR_INTERNO';

export class AsientosError extends Error {
  constructor(
    public readonly codigo: CodigoErrorAsiento,
    mensaje: string,
  ) {
    super(mensaje);
  }
}
