import { EstadoAsiento, NaturalezaCuenta, Prisma, TipoCuenta } from '@prisma/client';
import prisma from '../../config/prisma';

type ReporteFiltros = {
  empresaId?: string;
  periodoId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  estado?: EstadoAsiento;
};

type LineaReporte = Prisma.LineaAsientoGetPayload<{
  include: {
    asiento: true;
    cuenta: true;
  };
}>;

export class ReportesService {
  async obtenerLibroDiario(filtros: ReporteFiltros = {}) {
    const asientos = await prisma.asientoContable.findMany({
      where: this.buildAsientoWhere(filtros),
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
      orderBy: [
        {
          fecha: 'asc',
        },
        {
          numero: 'asc',
        },
      ],
    });

    return asientos.map((asiento) => ({
      id: asiento.id,
      empresaId: asiento.empresaId,
      periodoId: asiento.periodoId,
      fecha: asiento.fecha,
      numero: asiento.numero,
      descripcion: asiento.descripcion,
      estado: asiento.estado,
      tipo: asiento.tipo,
      origen: asiento.origen,
      lineas: asiento.lineas.map((linea) => ({
        id: linea.id,
        orden: linea.orden,
        cuentaId: linea.cuentaId,
        codigoCuenta: linea.cuenta.codigo,
        nombreCuenta: linea.cuenta.nombre,
        detalle: linea.detalle,
        debe: this.decimalToString(linea.debe),
        haber: this.decimalToString(linea.haber),
      })),
    }));
  }

  async obtenerLibroMayor(filtros: ReporteFiltros = {}) {
    const lineas = await this.obtenerLineasReporte(filtros);
    const cuentas = new Map<string, {
      cuentaId: string;
      codigoCuenta: string;
      nombreCuenta: string;
      tipoCuenta: TipoCuenta;
      naturaleza: NaturalezaCuenta;
      totalDebe: bigint;
      totalHaber: bigint;
      saldo: bigint;
      movimientos: Array<{
        asientoId: string;
        fecha: Date;
        numero: number;
        descripcion: string;
        detalle: string | null;
        debe: string;
        haber: string;
        saldo: string;
      }>;
    }>();

    for (const linea of lineas) {
      const cuenta = cuentas.get(linea.cuentaId) ?? {
        cuentaId: linea.cuentaId,
        codigoCuenta: linea.cuenta.codigo,
        nombreCuenta: linea.cuenta.nombre,
        tipoCuenta: linea.cuenta.tipo,
        naturaleza: linea.cuenta.naturaleza,
        totalDebe: 0n,
        totalHaber: 0n,
        saldo: 0n,
        movimientos: [],
      };

      const debe = this.decimalToCents(linea.debe);
      const haber = this.decimalToCents(linea.haber);

      cuenta.totalDebe += debe;
      cuenta.totalHaber += haber;
      cuenta.saldo = this.calcularSaldo(cuenta.naturaleza, cuenta.totalDebe, cuenta.totalHaber);
      cuenta.movimientos.push({
        asientoId: linea.asientoId,
        fecha: linea.asiento.fecha,
        numero: linea.asiento.numero,
        descripcion: linea.asiento.descripcion,
        detalle: linea.detalle,
        debe: this.centsToString(debe),
        haber: this.centsToString(haber),
        saldo: this.centsToString(cuenta.saldo),
      });

      cuentas.set(linea.cuentaId, cuenta);
    }

    return [...cuentas.values()].map((cuenta) => ({
      cuentaId: cuenta.cuentaId,
      codigoCuenta: cuenta.codigoCuenta,
      nombreCuenta: cuenta.nombreCuenta,
      tipoCuenta: cuenta.tipoCuenta,
      naturaleza: cuenta.naturaleza,
      totalDebe: this.centsToString(cuenta.totalDebe),
      totalHaber: this.centsToString(cuenta.totalHaber),
      saldo: this.centsToString(cuenta.saldo),
      movimientos: cuenta.movimientos,
    }));
  }

  async obtenerBalanceComprobacion(filtros: ReporteFiltros = {}) {
    const lineas = await this.obtenerLineasReporte(filtros);
    const cuentas = new Map<string, {
      cuentaId: string;
      codigoCuenta: string;
      nombreCuenta: string;
      naturaleza: NaturalezaCuenta;
      totalDebe: bigint;
      totalHaber: bigint;
      saldo: bigint;
    }>();
    let totalDebe = 0n;
    let totalHaber = 0n;

    for (const linea of lineas) {
      const cuenta = cuentas.get(linea.cuentaId) ?? {
        cuentaId: linea.cuentaId,
        codigoCuenta: linea.cuenta.codigo,
        nombreCuenta: linea.cuenta.nombre,
        naturaleza: linea.cuenta.naturaleza,
        totalDebe: 0n,
        totalHaber: 0n,
        saldo: 0n,
      };
      const debe = this.decimalToCents(linea.debe);
      const haber = this.decimalToCents(linea.haber);

      cuenta.totalDebe += debe;
      cuenta.totalHaber += haber;
      cuenta.saldo = this.calcularSaldo(cuenta.naturaleza, cuenta.totalDebe, cuenta.totalHaber);
      totalDebe += debe;
      totalHaber += haber;
      cuentas.set(linea.cuentaId, cuenta);
    }

    return {
      cuentas: [...cuentas.values()].map((cuenta) => ({
        cuentaId: cuenta.cuentaId,
        codigoCuenta: cuenta.codigoCuenta,
        nombreCuenta: cuenta.nombreCuenta,
        naturaleza: cuenta.naturaleza,
        totalDebe: this.centsToString(cuenta.totalDebe),
        totalHaber: this.centsToString(cuenta.totalHaber),
        saldo: this.centsToString(cuenta.saldo),
      })),
      totales: {
        totalDebe: this.centsToString(totalDebe),
        totalHaber: this.centsToString(totalHaber),
        cuadrado: totalDebe === totalHaber,
      },
    };
  }

  async obtenerEstadoResultados(filtros: ReporteFiltros = {}) {
    const lineas = await this.obtenerLineasReporte(filtros);
    let totalIngresos = 0n;
    let totalCostos = 0n;
    let totalGastos = 0n;

    for (const linea of lineas) {
      const debe = this.decimalToCents(linea.debe);
      const haber = this.decimalToCents(linea.haber);
      const saldo = this.calcularSaldo(linea.cuenta.naturaleza, debe, haber);

      if (linea.cuenta.tipo === TipoCuenta.INGRESO) {
        totalIngresos += saldo;
      }

      if (linea.cuenta.tipo === TipoCuenta.COSTO) {
        totalCostos += saldo;
      }

      if (linea.cuenta.tipo === TipoCuenta.GASTO) {
        totalGastos += saldo;
      }
    }

    const utilidadNeta = totalIngresos - totalCostos - totalGastos;

    return {
      totalIngresos: this.centsToString(totalIngresos),
      totalCostos: this.centsToString(totalCostos),
      totalGastos: this.centsToString(totalGastos),
      utilidadNeta: this.centsToString(utilidadNeta),
    };
  }

  async obtenerEstadoSituacionFinanciera(filtros: ReporteFiltros = {}) {
    const [libroMayor, estadoResultados] = await Promise.all([
      this.obtenerLibroMayor(filtros),
      this.obtenerEstadoResultados(filtros),
    ]);

    const totalActivos = libroMayor
      .filter((cuenta) => cuenta.tipoCuenta === TipoCuenta.ACTIVO)
      .reduce((total, cuenta) => total + this.stringToCents(cuenta.saldo), 0n);
    const totalPasivos = libroMayor
      .filter((cuenta) => cuenta.tipoCuenta === TipoCuenta.PASIVO)
      .reduce((total, cuenta) => total + this.stringToCents(cuenta.saldo), 0n);
    const patrimonioContable = libroMayor
      .filter((cuenta) => cuenta.tipoCuenta === TipoCuenta.PATRIMONIO)
      .reduce((total, cuenta) => total + this.stringToCents(cuenta.saldo), 0n);
    const resultadoEjercicio = this.stringToCents(estadoResultados.utilidadNeta);
    const totalPatrimonio = patrimonioContable + resultadoEjercicio;
    const ecuacionCuadrada = totalActivos === totalPasivos + totalPatrimonio;

    return {
      totalActivos: this.centsToString(totalActivos),
      totalPasivos: this.centsToString(totalPasivos),
      totalPatrimonio: this.centsToString(totalPatrimonio),
      detallePatrimonio: {
        patrimonioContable: this.centsToString(patrimonioContable),
        resultadoEjercicio: this.centsToString(resultadoEjercicio),
      },
      ecuacionContable: {
        activos: this.centsToString(totalActivos),
        pasivosMasPatrimonio: this.centsToString(totalPasivos + totalPatrimonio),
        cuadrada: ecuacionCuadrada,
      },
    };
  }

  private obtenerLineasReporte(filtros: ReporteFiltros) {
    return prisma.lineaAsiento.findMany({
      where: {
        asiento: this.buildAsientoWhere(filtros),
      },
      include: {
        asiento: true,
        cuenta: true,
      },
      orderBy: [
        {
          cuenta: {
            codigo: 'asc',
          },
        },
        {
          asiento: {
            fecha: 'asc',
          },
        },
        {
          asiento: {
            numero: 'asc',
          },
        },
        {
          orden: 'asc',
        },
      ],
    });
  }

  private buildAsientoWhere(filtros: ReporteFiltros): Prisma.AsientoContableWhereInput {
    return {
      empresaId: filtros.empresaId,
      periodoId: filtros.periodoId,
      estado: filtros.estado,
      fecha: {
        gte: filtros.fechaDesde,
        lte: filtros.fechaHasta,
      },
    };
  }

  private calcularSaldo(naturaleza: NaturalezaCuenta, debe: bigint, haber: bigint) {
    if (naturaleza === NaturalezaCuenta.DEUDORA) {
      return debe - haber;
    }

    return haber - debe;
  }

  private decimalToString(value: Prisma.Decimal) {
    return value.toFixed(2);
  }

  private decimalToCents(value: Prisma.Decimal) {
    return BigInt(value.mul(100).toFixed(0));
  }

  private centsToString(value: bigint) {
    const sign = value < 0n ? '-' : '';
    const absolute = value < 0n ? -value : value;
    const units = absolute / 100n;
    const cents = absolute % 100n;

    return `${sign}${units}.${cents.toString().padStart(2, '0')}`;
  }

  private stringToCents(value: string) {
    const sign = value.startsWith('-') ? -1n : 1n;
    const [units, cents = '0'] = value.replace('-', '').split('.');

    return sign * (BigInt(units) * 100n + BigInt(cents.padEnd(2, '0').slice(0, 2)));
  }
}
