import { TipoAsiento } from '@prisma/client';
import prisma from '../config/prisma';
import { ContabilidadService } from '../modules/contabilidad/contabilidad.service';
import { ReportesService } from '../modules/reportes/reportes.service';

const contabilidadService = new ContabilidadService();
const reportesService = new ReportesService();
const prefijoPrueba = 'VALIDACION CONTABLE';

type CuentaRequerida = {
  id: string;
  codigo: string;
  nombre: string;
};

async function buscarCuenta(empresaId: string, codigo: string, etiqueta: string) {
  const cuenta = await prisma.cuentaContable.findFirst({
    where: {
      empresaId,
      codigo,
      activo: true,
      permiteMovimiento: true,
    },
    select: {
      id: true,
      codigo: true,
      nombre: true,
    },
  });

  if (!cuenta) {
    throw new Error(`No se encontró la cuenta de movimiento ${etiqueta} con código ${codigo}.`);
  }

  return cuenta;
}

function mostrarLineaDiario(linea: {
  codigoCuenta: string;
  nombreCuenta: string;
  debe: string;
  haber: string;
}) {
  return `${linea.codigoCuenta} ${linea.nombreCuenta} | Debe ${linea.debe} | Haber ${linea.haber}`;
}

function buscarMayor(
  libroMayor: Awaited<ReturnType<ReportesService['obtenerLibroMayor']>>,
  cuenta: CuentaRequerida,
) {
  const mayor = libroMayor.find((item) => item.cuentaId === cuenta.id);

  if (!mayor) {
    throw new Error(`No se encontró mayor para ${cuenta.codigo} ${cuenta.nombre}.`);
  }

  return mayor;
}

function validarSaldo(
  libroMayor: Awaited<ReturnType<ReportesService['obtenerLibroMayor']>>,
  cuenta: CuentaRequerida,
  esperado: string,
) {
  const mayor = buscarMayor(libroMayor, cuenta);

  if (mayor.saldo !== esperado) {
    throw new Error(
      `Saldo incorrecto para ${cuenta.codigo} ${cuenta.nombre}: esperado ${esperado}, obtenido ${mayor.saldo}.`,
    );
  }

  return mayor;
}

async function main() {
  const empresa = await prisma.empresa.findFirst({
    where: {
      nombre: 'Empresa Demo S.A.',
    },
  });

  if (!empresa) {
    throw new Error('No se encontró Empresa Demo S.A.');
  }

  const periodo = await prisma.periodoContable.findFirst({
    where: {
      empresaId: empresa.id,
      anio: 2026,
      mes: 1,
      estado: 'ABIERTO',
    },
  });

  if (!periodo) {
    throw new Error('No se encontró el período abierto enero 2026.');
  }

  const [caja, capitalSocial, equipoComputacion, ingresosVentas] = await Promise.all([
    buscarCuenta(empresa.id, '1.01.01.01', 'Caja'),
    buscarCuenta(empresa.id, '3.01.01.01', 'Capital Social'),
    buscarCuenta(empresa.id, '1.02.01.06', 'Equipos de Computación'),
    buscarCuenta(empresa.id, '4.1.01.01', 'Ingresos por Ventas'),
  ]);

  await prisma.asientoContable.deleteMany({
    where: {
      empresaId: empresa.id,
      periodoId: periodo.id,
      descripcion: {
        startsWith: prefijoPrueba,
      },
    },
  });

  const asientos = [];

  asientos.push(
    await contabilidadService.registrarAsiento({
      empresaId: empresa.id,
      periodoId: periodo.id,
      fecha: '2026-01-01T00:00:00.000Z',
      descripcion: `${prefijoPrueba} - Estado de Situación Inicial`,
      tipo: TipoAsiento.APERTURA,
      lineas: [
        {
          cuentaId: caja.id,
          detalle: 'Caja inicial',
          debe: 10000,
        },
        {
          cuentaId: capitalSocial.id,
          detalle: 'Capital social inicial',
          haber: 10000,
        },
      ],
    }),
  );

  asientos.push(
    await contabilidadService.registrarAsiento({
      empresaId: empresa.id,
      periodoId: periodo.id,
      fecha: '2026-01-02T00:00:00.000Z',
      descripcion: `${prefijoPrueba} - Compra de computadora`,
      tipo: TipoAsiento.MANUAL,
      lineas: [
        {
          cuentaId: equipoComputacion.id,
          detalle: 'Compra de computadora',
          debe: 2000,
        },
        {
          cuentaId: caja.id,
          detalle: 'Pago de computadora',
          haber: 2000,
        },
      ],
    }),
  );

  asientos.push(
    await contabilidadService.registrarAsiento({
      empresaId: empresa.id,
      periodoId: periodo.id,
      fecha: '2026-01-03T00:00:00.000Z',
      descripcion: `${prefijoPrueba} - Venta de contado`,
      tipo: TipoAsiento.MANUAL,
      lineas: [
        {
          cuentaId: caja.id,
          detalle: 'Cobro de venta de contado',
          debe: 5000,
        },
        {
          cuentaId: ingresosVentas.id,
          detalle: 'Ingreso por venta de contado',
          haber: 5000,
        },
      ],
    }),
  );

  const filtros = {
    empresaId: empresa.id,
    periodoId: periodo.id,
    fechaDesde: new Date('2026-01-01T00:00:00.000Z'),
    fechaHasta: new Date('2026-01-31T23:59:59.999Z'),
  };
  const libroDiario = (await reportesService.obtenerLibroDiario(filtros)).filter((asiento) =>
    asiento.descripcion.startsWith(prefijoPrueba),
  );
  const libroMayor = await reportesService.obtenerLibroMayor(filtros);
  const balance = await reportesService.obtenerBalanceComprobacion(filtros);
  const estadoResultados = await reportesService.obtenerEstadoResultados(filtros);
  const estadoSituacionFinanciera = await reportesService.obtenerEstadoSituacionFinanciera(filtros);

  const mayorCaja = validarSaldo(libroMayor, caja, '13000.00');
  const mayorCapitalSocial = validarSaldo(libroMayor, capitalSocial, '10000.00');
  const mayorEquipoComputacion = validarSaldo(libroMayor, equipoComputacion, '2000.00');
  const mayorIngresosVentas = validarSaldo(libroMayor, ingresosVentas, '5000.00');

  if (!balance.totales.cuadrado || balance.totales.totalDebe !== balance.totales.totalHaber) {
    throw new Error('Balance de comprobación descuadrado');
  }

  if (estadoResultados.utilidadNeta !== '5000.00') {
    throw new Error(`Utilidad neta incorrecta: esperado 5000.00, obtenido ${estadoResultados.utilidadNeta}.`);
  }

  if (
    estadoSituacionFinanciera.totalActivos !== '15000.00' ||
    estadoSituacionFinanciera.totalPasivos !== '0.00' ||
    estadoSituacionFinanciera.totalPatrimonio !== '15000.00'
  ) {
    throw new Error('Estado de situación financiera no coincide con los valores esperados.');
  }

  if (!estadoSituacionFinanciera.ecuacionContable.cuadrada) {
    throw new Error('Ecuación contable descuadrada.');
  }

  console.log('Asientos creados:');
  for (const asiento of asientos) {
    console.log(`- #${asiento.numero} ${asiento.descripcion}`);
  }

  console.log('\nLibro Diario resumido:');
  for (const asiento of libroDiario) {
    console.log(`#${asiento.numero} ${asiento.fecha.toISOString().slice(0, 10)} ${asiento.descripcion}`);
    for (const linea of asiento.lineas) {
      console.log(`  ${mostrarLineaDiario(linea)}`);
    }
  }

  console.log('\nLibro Mayor resumido:');
  for (const mayor of [mayorCaja, mayorCapitalSocial, mayorEquipoComputacion, mayorIngresosVentas]) {
    console.log(
      `${mayor.codigoCuenta} ${mayor.nombreCuenta} | Debe ${mayor.totalDebe} | Haber ${mayor.totalHaber} | Saldo ${mayor.saldo}`,
    );
  }

  console.log('\nBalance de Comprobación:');
  for (const cuenta of balance.cuentas.filter((item) =>
    [caja.id, capitalSocial.id, equipoComputacion.id, ingresosVentas.id].includes(item.cuentaId),
  )) {
    console.log(
      `${cuenta.codigoCuenta} ${cuenta.nombreCuenta} | Debe ${cuenta.totalDebe} | Haber ${cuenta.totalHaber} | Saldo ${cuenta.saldo}`,
    );
  }

  console.log(`\nTotal Debe: ${balance.totales.totalDebe}`);
  console.log(`Total Haber: ${balance.totales.totalHaber}`);
  console.log('Estado del balance: ✓ Balance cuadrado');

  console.log('\nEstado de Resultados JSON:');
  console.log(JSON.stringify(estadoResultados, null, 2));

  console.log('\nEstado de Situación Financiera JSON:');
  console.log(JSON.stringify(estadoSituacionFinanciera, null, 2));

  console.log('\nValidación matemática Fase 3:');
  console.log(`Utilidad Neta: ${estadoResultados.utilidadNeta}`);
  console.log(`Total Activos: ${estadoSituacionFinanciera.totalActivos}`);
  console.log(`Total Pasivos: ${estadoSituacionFinanciera.totalPasivos}`);
  console.log(`Total Patrimonio: ${estadoSituacionFinanciera.totalPatrimonio}`);
  console.log(
    `Ecuación contable: ${estadoSituacionFinanciera.ecuacionContable.activos} = ${estadoSituacionFinanciera.ecuacionContable.pasivosMasPatrimonio}`,
  );
  console.log('Estado de la ecuación contable: ✓ Ecuación contable cuadrada');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
