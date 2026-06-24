import {
  EstadoAsiento,
  EstadoPeriodo,
  OrigenAsiento,
  Prisma,
  TipoAsiento,
} from '@prisma/client';
import prisma from '../../config/prisma';

type RegistrarLineaAsientoInput = {
  cuentaId: string;
  detalle?: string;
  debe?: Prisma.Decimal.Value;
  haber?: Prisma.Decimal.Value;
};

type RegistrarAsientoInput = {
  empresaId: string;
  periodoId: string;
  fecha: Date | string;
  descripcion: string;
  tipo: TipoAsiento;
  origen?: OrigenAsiento;
  estado?: EstadoAsiento;
  asientoReversoDeId?: string;
  lineas: RegistrarLineaAsientoInput[];
};

export class ContabilidadService {
  async registrarAsiento(input: RegistrarAsientoInput) {
    const fecha = new Date(input.fecha);
    const estado = input.estado ?? EstadoAsiento.BORRADOR;
    const origen = input.origen ?? OrigenAsiento.NINGUNO;

    if (Number.isNaN(fecha.getTime())) {
      throw new Error('La fecha del asiento no es válida.');
    }

    if (!input.descripcion?.trim()) {
      throw new Error('La descripción del asiento es obligatoria.');
    }

    if (!Object.values(TipoAsiento).includes(input.tipo)) {
      throw new Error('El tipo de asiento no es válido.');
    }

    if (!Object.values(OrigenAsiento).includes(origen)) {
      throw new Error('El origen del asiento no es válido.');
    }

    if (estado === EstadoAsiento.ANULADO) {
      throw new Error('Solo se pueden registrar asientos en estado BORRADOR o APROBADO.');
    }

    if (!Array.isArray(input.lineas) || input.lineas.length < 2) {
      throw new Error('El asiento debe tener al menos dos líneas.');
    }

    return prisma.$transaction(async (tx) => {
      const empresa = await tx.empresa.findUnique({
        where: { id: input.empresaId },
        select: { id: true },
      });

      if (!empresa) {
        throw new Error('La empresa no existe.');
      }

      const periodo = await tx.periodoContable.findFirst({
        where: {
          id: input.periodoId,
          empresaId: input.empresaId,
        },
      });

      if (!periodo) {
        throw new Error('El período contable no existe para la empresa indicada.');
      }

      if (periodo.estado !== EstadoPeriodo.ABIERTO) {
        throw new Error('El período contable debe estar ABIERTO.');
      }

      if (fecha < periodo.fechaInicio || fecha > periodo.fechaFin) {
        throw new Error('La fecha del asiento debe estar dentro del período contable.');
      }

      const cuentaIds = [...new Set(input.lineas.map((linea) => linea.cuentaId))];
      const cuentas = await tx.cuentaContable.findMany({
        where: {
          empresaId: input.empresaId,
          id: { in: cuentaIds },
        },
        select: {
          id: true,
          permiteMovimiento: true,
          activo: true,
          codigo: true,
        },
      });
      const cuentasPorId = new Map(cuentas.map((cuenta) => [cuenta.id, cuenta]));

      let totalDebe = 0n;
      let totalHaber = 0n;

      input.lineas.forEach((linea, index) => {
        const cuenta = cuentasPorId.get(linea.cuentaId);

        if (!cuenta) {
          throw new Error(`La cuenta de la línea ${index + 1} no existe para la empresa indicada.`);
        }

        if (!cuenta.activo) {
          throw new Error(`La cuenta ${cuenta.codigo} está inactiva.`);
        }

        if (!cuenta.permiteMovimiento) {
          throw new Error(`La cuenta ${cuenta.codigo} no permite movimiento.`);
        }

        const debe = this.toCents(linea.debe ?? 0);
        const haber = this.toCents(linea.haber ?? 0);

        if (debe < 0n || haber < 0n) {
          throw new Error(`La línea ${index + 1} no puede tener valores negativos.`);
        }

        if ((debe === 0n && haber === 0n) || (debe > 0n && haber > 0n)) {
          throw new Error(`La línea ${index + 1} debe tener valor en debe o en haber, pero no ambos.`);
        }

        totalDebe += debe;
        totalHaber += haber;
      });

      if (totalDebe !== totalHaber) {
        throw new Error('El asiento no está cuadrado: el total debe debe ser igual al total haber.');
      }

      const ultimoAsiento = await tx.asientoContable.aggregate({
        where: { empresaId: input.empresaId },
        _max: { numero: true },
      });

      return tx.asientoContable.create({
        data: {
          empresaId: input.empresaId,
          periodoId: input.periodoId,
          fecha,
          numero: (ultimoAsiento._max.numero ?? 0) + 1,
          descripcion: input.descripcion.trim(),
          estado,
          tipo: input.tipo,
          origen,
          asientoReversoDeId: input.asientoReversoDeId,
          lineas: {
            create: input.lineas.map((linea, index) => ({
              cuentaId: linea.cuentaId,
              detalle: linea.detalle?.trim() || null,
              debe: this.toDecimal(linea.debe ?? 0),
              haber: this.toDecimal(linea.haber ?? 0),
              orden: index + 1,
            })),
          },
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
    });
  }

  private toDecimal(value: Prisma.Decimal.Value) {
    return new Prisma.Decimal(value).toDecimalPlaces(2);
  }

  private toCents(value: Prisma.Decimal.Value) {
    return BigInt(this.toDecimal(value).mul(100).toFixed(0));
  }
}
