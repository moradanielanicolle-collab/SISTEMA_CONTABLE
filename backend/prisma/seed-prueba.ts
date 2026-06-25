import {
  EstadoAsiento,
  EstadoPeriodo,
  NaturalezaCuenta,
  OrigenAsiento,
  PrismaClient,
  TipoAsiento,
  TipoCuenta,
} from '@prisma/client';
import 'dotenv/config';
import { ContabilidadService } from '../src/modules/contabilidad/contabilidad.service';
import { ReportesService } from '../src/modules/reportes/reportes.service';

const prisma = new PrismaClient();
const contabilidadService = new ContabilidadService();
const reportesService = new ReportesService();

const EMPRESA_NOMBRE = 'Soluciones Empresariales S.A.';
const EMPRESA_RUC = '1799999999001';
const SEED_PREFIX = 'SEMANA 12';

type CuentaSeed = {
  codigo: string;
  nombre: string;
  tipo: TipoCuenta;
  naturaleza: NaturalezaCuenta;
  nivel: number;
};

type LineaSeed = {
  codigo: string;
  detalle: string;
  debe?: number;
  haber?: number;
};

type AsientoSeed = {
  numeroDocumento: string;
  fecha: string;
  tipo: TipoAsiento;
  origen?: OrigenAsiento;
  descripcion: string;
  lineas: LineaSeed[];
};

const asientos: AsientoSeed[] = [
  {
    numeroDocumento: '1',
    fecha: '2026-01-01T00:00:00.000Z',
    tipo: TipoAsiento.APERTURA,
    descripcion: 'V. Registro del estado de situación inicial',
    lineas: [
      debe('1.01.01.01', 'Caja', 5000),
      debe('1.01.01.03', 'Bancos', 45000),
      debe('1.01.02.04', 'Inversiones Temporales', 10000),
      debe('1.01.02.01', 'Cuentas por Cobrar', 12000),
      debe('1.01.02.02', 'Documentos por Cobrar', 8000),
      debe('1.01.05.02', 'IVA Compras', 2500),
      debe('1.01.03.01', 'Inventario de Mercancía', 35000),
      debe('1.01.03.03', 'Suministros de Oficina', 1200),
      debe('1.01.04.03', 'Seguros Pagados por Anticipado', 2400),
      debe('1.02.01.10', 'Muebles de Oficina', 15000),
      debe('1.02.01.06', 'Equipo de Computación', 20000),
      debe('1.02.01.14', 'Vehículos', 25000),
      debe('1.02.01.02', 'Edificios', 80000),
      debe('1.02.01.01', 'Terrenos', 50000),
      haber('2.01.03.01', 'Cuentas por Pagar', 8000),
      haber('2.01.03.02', 'Documentos por Pagar', 12000),
      haber('2.01.04.01', 'Préstamos Bancarios', 15000),
      haber('2.01.07.02', 'Retenciones por Pagar', 800),
      haber('2.01.07.06', 'IESS por Pagar', 1200),
      haber('2.01.08.02', 'Sueldos por Pagar', 3500),
      haber('2.01.08.03', 'Intereses por Pagar', 500),
      haber('2.02.03.02', 'Hipotecas por Pagar', 40000),
      haber('2.01.03.02', 'Documentos por Pagar (corregido de 2.2.02)', 20000),
      haber('3.01', 'Capital Social Suscrito (corregido de 3,01)', 201000),
      haber('3.03.01', 'Reservas', 5100),
      haber('3.05', 'Utilidades Acumuladas', 4000),
    ],
  },
  {
    numeroDocumento: '2',
    fecha: '2026-01-01T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.COMPRA,
    descripcion: 'V. Compra de mercadería con transf. y crédito',
    lineas: [
      debe('1.01.03.01', 'Inventario de mercaderías', 10000),
      debe('1.01.05.02', 'IVA Compras', 1500),
      haber('1.01.01.03', 'Bancos', 3450),
      haber('2.01.03.01', 'Cuentas por pagar proveedores', 8050),
    ],
  },
  {
    numeroDocumento: '3',
    fecha: '2026-01-02T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.VENTA,
    descripcion: 'V. Venta de mercadería en efectivo y crédito',
    lineas: [
      debe('1.01.01.01', 'Caja', 8625),
      debe('1.01.02.01', 'Cuentas por cobrar a clientes', 8625),
      haber('4.1.01.01', 'Ventas Bienes', 15000),
      haber('1.01.05.02', 'IVA Compras', 2250),
    ],
  },
  {
    numeroDocumento: '3.1',
    fecha: '2026-01-02T00:00:00.000Z',
    tipo: TipoAsiento.AUTOMATICO,
    descripcion: 'V. Registro costo de ventas',
    lineas: [
      debe('5.1.01.01', 'Costos de Ventas', 7000),
      haber('1.01.03.01', 'Inventario de Mercaderías', 7000),
    ],
  },
  {
    numeroDocumento: '4',
    fecha: '2026-01-03T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.GASTO,
    descripcion: 'V. Pago publicidad con transferencia',
    lineas: [
      debe('5.2.01.10', 'Gasto de publicidad', 1200),
      haber('1.01.01.03', 'Banco', 1200),
    ],
  },
  {
    numeroDocumento: '5',
    fecha: '2026-01-04T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    descripcion: 'V. Depósito efectivo de la venta anterior',
    lineas: [
      debe('1.01.01.03', 'Bancos', 8625),
      haber('1.01.01.01', 'Caja', 8625),
    ],
  },
  {
    numeroDocumento: '6',
    fecha: '2026-01-05T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.COMPRA,
    descripcion: 'V. Compra de computador con transferencia',
    lineas: [
      debe('1.02.01.06', 'Equipo de computación', 2000),
      haber('1.01.01.03', 'Bancos', 2000),
    ],
  },
  {
    numeroDocumento: '7',
    fecha: '2026-01-06T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.COBRO,
    descripcion: 'V. Cobro cuenta por cobrar a un cliente con transf.',
    lineas: [
      debe('1.01.01.03', 'Bancos', 3000),
      haber('1.01.02.01', 'Cuentas por cobrar a clientes', 3000),
    ],
  },
  {
    numeroDocumento: '8',
    fecha: '2026-01-07T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.GASTO,
    descripcion: 'V. Pago servicios básicos con transferencia',
    lineas: [
      debe('5.2.01.11', 'Servicios básicos', 450),
      haber('1.01.01.03', 'Bancos', 450),
    ],
  },
  {
    numeroDocumento: '9',
    fecha: '2026-01-08T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.VENTA,
    descripcion: 'V. Venta de mercadería a crédito',
    lineas: [
      debe('1.01.02.01', 'Cuentas por cobrar a clientes', 9200),
      haber('4.1.01.01', 'Venta de bienes', 8000),
      haber('2.01.07.04', 'IVA ventas', 1200),
    ],
  },
  {
    numeroDocumento: '10',
    fecha: '2026-01-09T00:00:00.000Z',
    tipo: TipoAsiento.AUTOMATICO,
    descripcion: 'V. Registro costo de ventas',
    lineas: [
      debe('5.1.01.01', 'Costo de ventas', 4000),
      haber('1.01.03.01', 'Inventario de mercaderías', 4000),
    ],
  },
  {
    numeroDocumento: '11',
    fecha: '2026-01-10T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.PAGO,
    descripcion: 'V. Pago préstamo bancario capital más interés',
    lineas: [
      debe('5.2.01.14', 'Gastos financieros - Intereses', 1000),
      debe('2.01.04.01', 'Préstamos bancarios corto plazo', 2000),
      haber('1.01.01.03', 'Bancos', 3000),
    ],
  },
  {
    numeroDocumento: '12',
    fecha: '2026-01-11T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.GASTO,
    descripcion: 'V. Compra suministros de oficina',
    lineas: [
      debe('5.2.01.10', 'Gasto suministros de Oficina', 300),
      haber('1.01.01.01', 'Caja', 300),
    ],
  },
  {
    numeroDocumento: '13',
    fecha: '2026-01-12T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.GASTO,
    descripcion: 'V. Pago arriendo',
    lineas: [
      debe('5.2.01.09', 'Arriendo de locales y oficinas', 900),
      haber('1.01.01.03', 'Bancos', 900),
    ],
  },
  {
    numeroDocumento: '14',
    fecha: '2026-01-13T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.GASTO,
    descripcion: 'V. Pago mantenimiento vehículos',
    lineas: [
      debe('5.2.01.12', 'Mantenimiento de vehículos', 600),
      haber('1.01.01.03', 'Bancos', 600),
    ],
  },
  {
    numeroDocumento: '15',
    fecha: '2026-01-14T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    descripcion: 'V. Creación de caja chica',
    lineas: [
      debe('1.01.01.02', 'Caja chica', 2000),
      haber('1.01.01.03', 'Bancos', 2000),
    ],
  },
  {
    numeroDocumento: '16',
    fecha: '2026-01-15T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.PAGO,
    descripcion: 'V. Pago nómina del personal',
    lineas: [
      debe('2.01.08.02', 'Sueldos por Pagar', 3500),
      debe('5.2.01.01', 'Gastos de Sueldo y Salario', 1000),
      haber('1.01.01.03', 'Bancos', 4500),
    ],
  },
  {
    numeroDocumento: '17',
    fecha: '2026-01-16T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.COMPRA,
    descripcion: 'V. Adq. de muebles a crédito',
    lineas: [
      debe('1.02.01.10', 'Muebles de oficina', 1500),
      haber('2.01.03.01', 'Cuentas por pagar proveedores', 1500),
    ],
  },
  {
    numeroDocumento: '18',
    fecha: '2026-01-17T00:00:00.000Z',
    tipo: TipoAsiento.AJUSTE,
    descripcion: 'V. Ajuste de seguros pagados por anticipado',
    lineas: [
      debe('5.2.01.11', 'Gastos de Seguro', 200),
      haber('1.01.04.03', 'Seguros Pagados por Anticipado (corregido de 1.01.01.01)', 200),
    ],
  },
  {
    numeroDocumento: '20',
    fecha: '2026-01-27T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    origen: OrigenAsiento.COBRO,
    descripcion: 'V. Cobro en efectivo comisiones',
    lineas: [
      debe('1.01.01.01', 'Caja', 1200),
      haber('4.3.05.01', 'Comisiones ganadas', 1200),
    ],
  },
  {
    numeroDocumento: '21',
    fecha: '2026-01-28T00:00:00.000Z',
    tipo: TipoAsiento.MANUAL,
    descripcion: 'V. Pago dividendos con transf.',
    lineas: [
      debe('3.05', 'Resultados acumulados', 2500),
      haber('3.05', 'Utilidades Acumuladas', 2500),
    ],
  },
];

const cuentasNecesarias = construirCuentasNecesarias(asientos);

async function main() {
  const empresa = await obtenerOCrearEmpresa();
  const periodo = await obtenerOCrearPeriodo(empresa.id);
  const cuentasPorCodigo = await upsertCuentas(empresa.id);

  await limpiarAsientosPrevios(empresa.id, periodo.id);

  const exitosos: Array<{ numeroDocumento: string; numeroSistema: number }> = [];
  const fallidos: Array<{ numeroDocumento: string; error: string }> = [];

  for (const asiento of asientos) {
    try {
      validarLineas(asiento);
      const creado = await contabilidadService.registrarAsiento({
        empresaId: empresa.id,
        periodoId: periodo.id,
        fecha: asiento.fecha,
        descripcion: `${SEED_PREFIX} - Asiento ${asiento.numeroDocumento} - ${asiento.descripcion}`,
        tipo: asiento.tipo,
        origen: asiento.origen,
        estado: EstadoAsiento.APROBADO,
        lineas: asiento.lineas.map((linea, index) => {
          const cuentaId = cuentasPorCodigo.get(linea.codigo);

          if (!cuentaId) {
            throw new Error(`línea ${index + 1}: cuenta ${linea.codigo} no encontrada.`);
          }

          return {
            cuentaId,
            detalle: linea.detalle,
            debe: linea.debe,
            haber: linea.haber,
          };
        }),
      });

      exitosos.push({ numeroDocumento: asiento.numeroDocumento, numeroSistema: creado.numero });
      console.log(`OK Asiento ${asiento.numeroDocumento} registrado como #${creado.numero}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido.';
      fallidos.push({ numeroDocumento: asiento.numeroDocumento, error: message });
      console.error(`ERROR Asiento ${asiento.numeroDocumento}: ${message}`);
      break;
    }
  }

  imprimirResumenCarga(exitosos, fallidos);

  if (fallidos.length > 0) {
    throw new Error('Seed detenido por error en asiento. No se continuó silenciosamente.');
  }

  await validarReportes(empresa.id, periodo.id);
  imprimirAdvertencias();
}

async function obtenerOCrearEmpresa() {
  const existente = await prisma.empresa.findFirst({
    where: {
      OR: [{ nombre: EMPRESA_NOMBRE }, { ruc: EMPRESA_RUC }],
    },
  });

  if (existente) {
    return prisma.empresa.update({
      where: { id: existente.id },
      data: {
        nombre: EMPRESA_NOMBRE,
        ruc: existente.ruc ?? EMPRESA_RUC,
      },
    });
  }

  return prisma.empresa.create({
    data: {
      nombre: EMPRESA_NOMBRE,
      ruc: EMPRESA_RUC,
    },
  });
}

function obtenerOCrearPeriodo(empresaId: string) {
  return prisma.periodoContable.upsert({
    where: {
      empresaId_anio_mes: {
        empresaId,
        anio: 2026,
        mes: 1,
      },
    },
    update: {
      fechaInicio: new Date('2026-01-01T00:00:00.000Z'),
      fechaFin: new Date('2026-01-31T23:59:59.999Z'),
      estado: EstadoPeriodo.ABIERTO,
    },
    create: {
      empresaId,
      anio: 2026,
      mes: 1,
      fechaInicio: new Date('2026-01-01T00:00:00.000Z'),
      fechaFin: new Date('2026-01-31T23:59:59.999Z'),
      estado: EstadoPeriodo.ABIERTO,
    },
  });
}

async function upsertCuentas(empresaId: string) {
  const cuentasPorCodigo = new Map<string, string>();

  for (const item of cuentasNecesarias) {
    const existente = await prisma.cuentaContable.findFirst({
      where: {
        empresaId,
        codigo: item.codigo,
      },
    });

    const cuentaGuardada = existente
      ? await prisma.cuentaContable.update({
          where: { id: existente.id },
          data: {
            nombre: item.nombre,
            tipo: item.tipo,
            naturaleza: item.naturaleza,
            nivel: item.nivel,
            permiteMovimiento: true,
            activo: true,
          },
        })
      : await prisma.cuentaContable.create({
          data: {
            empresaId,
            codigo: item.codigo,
            nombre: item.nombre,
            tipo: item.tipo,
            naturaleza: item.naturaleza,
            nivel: item.nivel,
            permiteMovimiento: true,
            activo: true,
          },
        });

    cuentasPorCodigo.set(item.codigo, cuentaGuardada.id);
  }

  console.log(`Cuentas de prueba listas: ${cuentasNecesarias.length}.`);

  return cuentasPorCodigo;
}

async function limpiarAsientosPrevios(empresaId: string, periodoId: string) {
  const result = await prisma.asientoContable.deleteMany({
    where: {
      empresaId,
      periodoId,
      descripcion: {
        startsWith: SEED_PREFIX,
      },
    },
  });

  if (result.count > 0) {
    console.log(`Asientos previos del seed eliminados: ${result.count}.`);
  }
}

async function validarReportes(empresaId: string, periodoId: string) {
  const filtros = {
    empresaId,
    periodoId,
    fechaDesde: new Date('2026-01-01T00:00:00.000Z'),
    fechaHasta: new Date('2026-01-31T23:59:59.999Z'),
  };
  const [libroDiario, libroMayor, balance] = await Promise.all([
    reportesService.obtenerLibroDiario(filtros),
    reportesService.obtenerLibroMayor(filtros),
    reportesService.obtenerBalanceComprobacion(filtros),
  ]);

  console.log('\nValidación de reportes por servicio:');
  console.log(`- GET /api/reportes/libro-diario -> ${libroDiario.length} asientos`);
  console.log(`- GET /api/reportes/libro-mayor -> ${libroMayor.length} cuentas`);
  console.log(`- GET /api/reportes/balance-comprobacion -> ${balance.cuentas.length} cuentas`);
  console.log(`- Total Debe: ${balance.totales.totalDebe}`);
  console.log(`- Total Haber: ${balance.totales.totalHaber}`);

  if (balance.totales.cuadrado) {
    console.log('- Estado: Balance de Comprobación CUADRADO.');
    return;
  }

  const diferencia = Math.abs(Number(balance.totales.totalDebe) - Number(balance.totales.totalHaber)).toFixed(2);
  console.log(`- Estado: Balance de Comprobación DESCUADRADO. Diferencia: ${diferencia}`);
  console.log('- Sospechosos principales según notas del documento: asientos 3, 12, 18 y 21.');
}

function imprimirResumenCarga(
  exitosos: Array<{ numeroDocumento: string; numeroSistema: number }>,
  fallidos: Array<{ numeroDocumento: string; error: string }>,
) {
  console.log('\nResumen de carga:');
  console.log(`- Asientos OK: ${exitosos.length}`);
  console.log(`- Asientos fallidos: ${fallidos.length}`);

  for (const fallido of fallidos) {
    console.log(`  * Asiento ${fallido.numeroDocumento}: ${fallido.error}`);
  }
}

function imprimirAdvertencias() {
  console.log('\nAdvertencias del documento respetadas:');
  console.log('- Asiento 3: se mantiene 1.01.05.02 IVA Compras en Haber, tal como indica el documento.');
  console.log('- Asiento 12: se mantiene 5.2.01.10 para suministros, aunque también se usa para publicidad.');
  console.log('- Asiento 18: se corrige el Haber a 1.01.04.03 y se mantiene 5.2.01.11 aunque también se usa para servicios básicos.');
  console.log('- Asiento 21: se mantiene 3.05 en Debe y Haber; queda como cuenta contra sí misma por instrucción del documento.');
  console.log('- No existe asiento 19; se respetó la numeración real del documento.');
}

function construirCuentasNecesarias(items: AsientoSeed[]) {
  const cuentasPorCodigo = new Map<string, CuentaSeed>();

  for (const asiento of items) {
    for (const linea of asiento.lineas) {
      if (cuentasPorCodigo.has(linea.codigo)) {
        continue;
      }

      cuentasPorCodigo.set(linea.codigo, cuenta(linea.codigo, nombreCanonico(linea.codigo, linea.detalle)));
    }
  }

  return [...cuentasPorCodigo.values()].sort((a, b) => a.codigo.localeCompare(b.codigo));
}

function validarLineas(asiento: AsientoSeed) {
  asiento.lineas.forEach((linea, index) => {
    if (!cuentasNecesarias.some((cuentaItem) => cuentaItem.codigo === linea.codigo)) {
      throw new Error(`línea ${index + 1}: cuenta ${linea.codigo} no definida en el seed.`);
    }
  });
}

function debe(codigo: string, detalle: string, value: number): LineaSeed {
  return {
    codigo,
    detalle,
    debe: value,
  };
}

function haber(codigo: string, detalle: string, value: number): LineaSeed {
  return {
    codigo,
    detalle,
    haber: value,
  };
}

function cuenta(codigo: string, nombre: string): CuentaSeed {
  const tipo = tipoPorCodigo(codigo);

  return {
    codigo,
    nombre,
    tipo,
    naturaleza: naturalezaPorTipo(tipo),
    nivel: codigo.split('.').length,
  };
}

function nombreCanonico(codigo: string, fallback: string) {
  const nombres: Record<string, string> = {
    '1.01.01.01': 'Caja',
    '1.01.01.02': 'Caja chica',
    '1.01.01.03': 'Bancos',
    '1.01.02.01': 'Cuentas por cobrar a clientes',
    '1.01.02.02': 'Documentos por cobrar a clientes',
    '1.01.02.04': 'Inversiones Temporales',
    '1.01.03.01': 'Inventario de Mercancía',
    '1.01.03.03': 'Suministros de Oficina',
    '1.01.04.03': 'Seguros Pagados por Anticipado',
    '1.01.05.02': 'IVA Compras',
    '1.02.01.01': 'Terrenos',
    '1.02.01.02': 'Edificios',
    '1.02.01.06': 'Equipo de Computación',
    '1.02.01.10': 'Muebles de Oficina',
    '1.02.01.14': 'Vehículos',
    '2.01.03.01': 'Cuentas por Pagar',
    '2.01.03.02': 'Documentos por Pagar',
    '2.01.04.01': 'Préstamos Bancarios',
    '2.01.07.02': 'Retenciones por Pagar',
    '2.01.07.04': 'IVA Ventas',
    '2.01.07.06': 'IESS por Pagar',
    '2.01.08.02': 'Sueldos por Pagar',
    '2.01.08.03': 'Intereses por Pagar',
    '2.02.03.02': 'Hipotecas por Pagar',
    '3.01': 'Capital Social Suscrito',
    '3.03.01': 'Reservas',
    '3.05': 'Utilidades Acumuladas',
    '4.1.01.01': 'Ventas Bienes',
    '4.3.05.01': 'Comisiones ganadas',
    '5.1.01.01': 'Costos de Ventas',
    '5.2.01.01': 'Gastos de Sueldo y Salario',
    '5.2.01.09': 'Arriendo de locales y oficinas',
    '5.2.01.10': 'Gasto de publicidad / suministros de Oficina',
    '5.2.01.11': 'Servicios básicos / Gastos de Seguro',
    '5.2.01.12': 'Mantenimiento de vehículos',
    '5.2.01.14': 'Gastos financieros - Intereses',
  };

  return nombres[codigo] ?? fallback;
}

function tipoPorCodigo(codigo: string) {
  if (codigo.startsWith('1.')) {
    return TipoCuenta.ACTIVO;
  }

  if (codigo.startsWith('2.')) {
    return TipoCuenta.PASIVO;
  }

  if (codigo.startsWith('3.')) {
    return TipoCuenta.PATRIMONIO;
  }

  if (codigo.startsWith('4.')) {
    return TipoCuenta.INGRESO;
  }

  if (codigo.startsWith('5.1.')) {
    return TipoCuenta.COSTO;
  }

  return TipoCuenta.GASTO;
}

function naturalezaPorTipo(tipo: TipoCuenta) {
  if (tipo === TipoCuenta.ACTIVO || tipo === TipoCuenta.GASTO || tipo === TipoCuenta.COSTO) {
    return NaturalezaCuenta.DEUDORA;
  }

  return NaturalezaCuenta.ACREEDORA;
}

main()
  .catch((error) => {
    console.error('\nSeed de prueba falló.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
