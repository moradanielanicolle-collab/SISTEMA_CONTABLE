import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cuentas = [
  {
    "codigo": "1",
    "nombre": "ACTIVO",
    "padreCodigo": null,
    "nivel": 1,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01",
    "nombre": "ACTIVO CORRIENTE",
    "padreCodigo": "1",
    "nivel": 2,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01.01",
    "nombre": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "padreCodigo": "1.01",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01.01.01",
    "nombre": "Caja",
    "padreCodigo": "1.01.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.01.02",
    "nombre": "Caja chica",
    "padreCodigo": "1.01.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.01.03",
    "nombre": "Bancos",
    "padreCodigo": "1.01.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.02",
    "nombre": "ACTIVOS FINANCIEROS",
    "padreCodigo": "1.01",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01.02.01",
    "nombre": "Cuentas por cobrar a clientes",
    "padreCodigo": "1.01.02",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.02.02",
    "nombre": "Documentos por cobrar a clientes",
    "padreCodigo": "1.01.02",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.02.03",
    "nombre": "Anticipos y préstamos por cobrar a empleados",
    "padreCodigo": "1.01.02",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.02.04",
    "nombre": "Inversiones financieras disponibles a la venta",
    "padreCodigo": "1.01.02",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.02.05",
    "nombre": "Cuentas por cobrar a propietarios",
    "padreCodigo": "1.01.02",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.02.06",
    "nombre": "Provisión cuentas incobrables (-)",
    "padreCodigo": "1.01.02",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.03",
    "nombre": "INVENTARIOS",
    "padreCodigo": "1.01",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01.03.01",
    "nombre": "Inventario de mercaderías",
    "padreCodigo": "1.01.03",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.03.02",
    "nombre": "Mercaderías en proceso de importación",
    "padreCodigo": "1.01.03",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.03.03",
    "nombre": "Inventario suministros de oficina",
    "padreCodigo": "1.01.03",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.03.04",
    "nombre": "Provisión inventario obsoleto (-)",
    "padreCodigo": "1.01.03",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.04",
    "nombre": "SERVICIOS Y OTROS PAGOS ANTICIPADOS",
    "padreCodigo": "1.01",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01.04.01",
    "nombre": "Anticipo de sueldos",
    "padreCodigo": "1.01.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.04.02",
    "nombre": "Arriendos prepagados (o pagados por anticipado)",
    "padreCodigo": "1.01.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.04.03",
    "nombre": "Seguros prepagados",
    "padreCodigo": "1.01.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.04.04",
    "nombre": "Publicidad prepagada",
    "padreCodigo": "1.01.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.05",
    "nombre": "ACTIVOS POR IMPUESTOS CORRIENTES",
    "padreCodigo": "1.01",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.01.05.01",
    "nombre": "Crédito tributario IVA",
    "padreCodigo": "1.01.05",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.05.02",
    "nombre": "IVA compras",
    "padreCodigo": "1.01.05",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.05.03",
    "nombre": "Anticipo IVA retenido",
    "padreCodigo": "1.01.05",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.05.04",
    "nombre": "Anticipo impuesto a la renta retenido",
    "padreCodigo": "1.01.05",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.01.05.05",
    "nombre": "Anticipo impuesto a la renta mínimo",
    "padreCodigo": "1.01.05",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02",
    "nombre": "ACTIVO NO CORRIENTE",
    "padreCodigo": "1",
    "nivel": 2,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.02.01",
    "nombre": "PROPIEDAD, PLANTA Y EQUIPO ( P P y E)",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.02.01.01",
    "nombre": "Terrenos",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.02",
    "nombre": "Edificios",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.03",
    "nombre": "Depreciación acumulada de edificios (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.04",
    "nombre": "Maquinaria y equipo",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.05",
    "nombre": "Depreciación acumulada de maquinaria y equipo (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.06",
    "nombre": "Equipo de computación",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.07",
    "nombre": "Depreciación acumulada de equipo de computación (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.08",
    "nombre": "Muebles y enseres",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.09",
    "nombre": "Depreciación acumulada de muebles y enseres (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.10",
    "nombre": "Muebles de oficina",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.11",
    "nombre": "Deprecación acumulada de muebles de oficina",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.12",
    "nombre": "Equipo de oficina",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.13",
    "nombre": "Depreciación acumulada de equipo de oficina (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.14",
    "nombre": "Vehículo",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.15",
    "nombre": "Depreciación acumulada de vehículo (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.16",
    "nombre": "Bienes arrendados en leasing",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.17",
    "nombre": "Depreciación acumulada/Bienes leasing",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.18",
    "nombre": "Deterioros acumulados P P & E",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.19",
    "nombre": "Bienes para publicidad",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.01.20",
    "nombre": "Depreciación acumulada bienes para publicidad (-)",
    "padreCodigo": "1.02.01",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.02",
    "nombre": "PROPIEDADES DE INVERSIÓN",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.03",
    "nombre": "ACTIVOS BIOLÓGICOS",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04",
    "nombre": "INTANGIBLES",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.02.04.01",
    "nombre": "Derechos de llave",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.02",
    "nombre": "Amortización acumulada de derechos de llave (-)",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.03",
    "nombre": "Patentes y franquicias",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.04",
    "nombre": "Amortización acumulada de patentes y franquicias (-)",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.05",
    "nombre": "Certificación ISO",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.06",
    "nombre": "Amortización acumulada de certificaciones (-)",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.07",
    "nombre": "Gastos de reorganización",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.08",
    "nombre": "Amortización acumulada gastos de reorganización (-)",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.09",
    "nombre": "Gastos de constitución",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.04.10",
    "nombre": "Amortización acumulada gastos de constitución (-)",
    "padreCodigo": "1.02.04",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.05",
    "nombre": "ACTIVOS POR IMPUESTOS DIFERIDOS",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.06",
    "nombre": "ACTIVOS FINANCIEROS NO CORRIENTES",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07",
    "nombre": "OTROS ACTIVOS NO CORRIENTES",
    "padreCodigo": "1.02",
    "nivel": 3,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "1.02.07.01",
    "nombre": "Documentos por cobrar a largo plazo",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07.02",
    "nombre": "Cuentas por cobrar a largo plazo",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07.03",
    "nombre": "Inversiones en acciones de compañías relacionadas L.P",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07.04",
    "nombre": "Inversiones mantenidas al vencimiento L.P",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07.05",
    "nombre": "Inversión en propiedades",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07.06",
    "nombre": "Bienes permanentes en proceso de construcción/instalación",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "1.02.07.07",
    "nombre": "Garantías entregadas largo plazo",
    "padreCodigo": "1.02.07",
    "nivel": 4,
    "tipo": "ACTIVO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2",
    "nombre": "PASIVO",
    "padreCodigo": null,
    "nivel": 1,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.01",
    "nombre": "PASIVO CORRIENTE",
    "padreCodigo": "2",
    "nivel": 2,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.01.01",
    "nombre": "PASIVOS FINANCIEROS A VALOR RAZONABLE",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.02",
    "nombre": "PASIVOS POR CONTRATOS DE ARRENDAMIENTO FIN.",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.03",
    "nombre": "CUENTAS Y DOCUMENTOS POR PAGAR",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.01.03.01",
    "nombre": "Cuentas por pagar proveedores",
    "padreCodigo": "2.01.03",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.03.02",
    "nombre": "Documentos por pagar proveedores",
    "padreCodigo": "2.01.03",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.04",
    "nombre": "OBLIGACIONES CON INSTITUCIONES FINANCIERA",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.01.04.01",
    "nombre": "Préstamos bancarios corto plazo",
    "padreCodigo": "2.01.04",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.05",
    "nombre": "PROVISIONES",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.06",
    "nombre": "PORCIÓN CORRIENTE OBLIGACIONES EMITIDAS",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.07",
    "nombre": "OTRAS OBLIGACIONES CORRIENTES",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.01.07.01",
    "nombre": "Impuesto a la renta causado por pagar",
    "padreCodigo": "2.01.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.07.02",
    "nombre": "Impuesto a la renta retenido por pagar",
    "padreCodigo": "2.01.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.07.03",
    "nombre": "IVA retenido por pagar",
    "padreCodigo": "2.01.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.07.04",
    "nombre": "IVA ventas",
    "padreCodigo": "2.01.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.07.05",
    "nombre": "Beneficios sociales por pagar",
    "padreCodigo": "2.01.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.07.06",
    "nombre": "Participación trabajadores por pagar",
    "padreCodigo": "2.01.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08",
    "nombre": "CUENTAS POR PAGAR DIVERSAS",
    "padreCodigo": "2.01",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.01.08.01",
    "nombre": "Servicios básicos por pagar a empresas públicas",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08.02",
    "nombre": "Sueldos acumulados por pagar",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08.03",
    "nombre": "Honorarios acumulados por pagar",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08.04",
    "nombre": "Comisiones acumuladas por pagar",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08.05",
    "nombre": "Publicidad acumulada por pagar",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08.06",
    "nombre": "Arriendos acumulados por pagar",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.01.08.07",
    "nombre": "Transporte acumulado por pagar",
    "padreCodigo": "2.01.08",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02",
    "nombre": "NO CORRIENTE A LARGO PLAZO",
    "padreCodigo": "2",
    "nivel": 2,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.02.01",
    "nombre": "PASIVOS POR CONTRATOS DE ARRENDAMIENTO FIN.",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.02",
    "nombre": "CUENTAS Y DOCUMENTOS POR PAGAR",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.03",
    "nombre": "OBLIGACIONES CON INSTITUCIONES FINANCIERAS",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.02.03.01",
    "nombre": "Préstamos bancarios a largo plazo",
    "padreCodigo": "2.02.03",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.03.02",
    "nombre": "Hipotecas por pagar a largo plazo",
    "padreCodigo": "2.02.03",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.04",
    "nombre": "CUENTAS POR PAGAR DIVERSAS / RELACIONADAS",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.05",
    "nombre": "OBLIGACIONES EMITIDAS",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.06",
    "nombre": "ANTICIPOS DE CLIENTES",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.02.06.01",
    "nombre": "Servicios cobrados por anticipado",
    "padreCodigo": "2.02.06",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.06.02",
    "nombre": "Publicidad precobrada",
    "padreCodigo": "2.02.06",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "2.02.07",
    "nombre": "PROVISIONES POR BENEFICIOS A EMPLEADOS",
    "padreCodigo": "2.02",
    "nivel": 3,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "2.02.07.01",
    "nombre": "Provisión jubilación patronal",
    "padreCodigo": "2.02.07",
    "nivel": 4,
    "tipo": "PASIVO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3",
    "nombre": "PATRIMONIO",
    "padreCodigo": null,
    "nivel": 1,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "3.01",
    "nombre": "CAPITAL",
    "padreCodigo": "3",
    "nivel": 2,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "3.01.01",
    "nombre": "CAPITAL SUSCRITO O ASIGNADO",
    "padreCodigo": "3.01",
    "nivel": 3,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "3.01.01.01",
    "nombre": "Capital suscrito",
    "padreCodigo": "3.01.01",
    "nivel": 4,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.02",
    "nombre": "APORTES DE SOCIOS O ACC. PARA FUTURA CAPIT.",
    "padreCodigo": "3",
    "nivel": 2,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.03.01",
    "nombre": "Reserva legal",
    "padreCodigo": "3",
    "nivel": 3,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.03.02",
    "nombre": "Reserva facultativa, estatutaria",
    "padreCodigo": "3",
    "nivel": 3,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.03.03",
    "nombre": "Reserva de capital",
    "padreCodigo": "3",
    "nivel": 3,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.04",
    "nombre": "OTROS RESULTADOS INTEGRALES",
    "padreCodigo": "3",
    "nivel": 2,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.05",
    "nombre": "RESULTADOS ACUMULADOS",
    "padreCodigo": "3",
    "nivel": 2,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.06",
    "nombre": "RESULTADOS DEL EJERCICIO",
    "padreCodigo": "3",
    "nivel": 2,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "3.06.01",
    "nombre": "Ganancia neta del ejercicio",
    "padreCodigo": "3.06",
    "nivel": 3,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "3.06.02",
    "nombre": "(-) Pérdida neta del ejercicio",
    "padreCodigo": "3.06",
    "nivel": 3,
    "tipo": "PATRIMONIO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4",
    "nombre": "INGRESOS",
    "padreCodigo": null,
    "nivel": 1,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.1",
    "nombre": "INGRESOS DE ACTIVIDADES ORDINARIAS",
    "padreCodigo": "4",
    "nivel": 2,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.1.01",
    "nombre": "VENTA DE BIENES",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.1.01.01",
    "nombre": "Venta de bienes",
    "padreCodigo": "4.1.01",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.01.02",
    "nombre": "(-) Descuento en ventas",
    "padreCodigo": "4.1.01",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.01.03",
    "nombre": "(-) Devolución en ventas",
    "padreCodigo": "4.1.01",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.02",
    "nombre": "PRESTACIÓN DE SERVICIOS",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.1.02.01",
    "nombre": "Servicios prestados",
    "padreCodigo": "4.1.02",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.03",
    "nombre": "CONTRATOS DE CONSTRUCCIÓN",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.04",
    "nombre": "SUBVENCIONES DEL GOBIERNO",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.05",
    "nombre": "REGALÍAS",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.06",
    "nombre": "INTERESES",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.1.06.01",
    "nombre": "Intereses generados por ventas a crédito",
    "padreCodigo": "4.1.06",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.1.07",
    "nombre": "DIVIDENDOS",
    "padreCodigo": "4.1",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.1.07.01",
    "nombre": "Dividendos ganados",
    "padreCodigo": "4.1.07",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.2",
    "nombre": "GANANCIA BRUTA",
    "padreCodigo": "4",
    "nivel": 2,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.2.01",
    "nombre": "Ganancia bruta en ventas",
    "padreCodigo": "4.2",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3",
    "nombre": "OTROS INGRESOS",
    "padreCodigo": "4",
    "nivel": 2,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.3.01",
    "nombre": "DIVIDENDOS",
    "padreCodigo": "4.3",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.02",
    "nombre": "INTERESES FINANCIEROS",
    "padreCodigo": "4.3",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.03",
    "nombre": "GANANCIAS EN INVERSIONES ASOCIADAS",
    "padreCodigo": "4.3",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.04",
    "nombre": "VALUACIÓN DE INSTRUMENTOS FINANCIEROS",
    "padreCodigo": "4.3",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05",
    "nombre": "OTRAS RENTAS",
    "padreCodigo": "4.3",
    "nivel": 3,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "4.3.05.01",
    "nombre": "Comisiones ganadas",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05.02",
    "nombre": "Arriendos ganados",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05.03",
    "nombre": "Ingresos por multas",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05.04",
    "nombre": "Premios en rifas y sorteos",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05.05",
    "nombre": "Indemnizaciones de seguros",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05.06",
    "nombre": "Donaciones recibidas",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "4.3.05.07",
    "nombre": "Utilidad ocasional en ventas de inmuebles",
    "padreCodigo": "4.3.05",
    "nivel": 4,
    "tipo": "INGRESO",
    "naturaleza": "ACREEDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5",
    "nombre": "GASTOS",
    "padreCodigo": null,
    "nivel": 1,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "5.1",
    "nombre": "COSTO",
    "padreCodigo": "5",
    "nivel": 2,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "5.1.01",
    "nombre": "COSTO DE VENTA",
    "padreCodigo": "5.1",
    "nivel": 3,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "5.1.01.01",
    "nombre": "Costo de ventas",
    "padreCodigo": "5.1.01",
    "nivel": 4,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.1.01.02",
    "nombre": "Compras",
    "padreCodigo": "5.1.01",
    "nivel": 4,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.1.01.03",
    "nombre": "(-) Descuento en compras",
    "padreCodigo": "5.1.01",
    "nivel": 4,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.1.01.04",
    "nombre": "(-) Devolución en compras",
    "padreCodigo": "5.1.01",
    "nivel": 4,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.1.01.05",
    "nombre": "Costo de ventas",
    "padreCodigo": "5.1.01",
    "nivel": 4,
    "tipo": "COSTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2",
    "nombre": "GASTOS",
    "padreCodigo": "5",
    "nivel": 2,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "5.2.01",
    "nombre": "OPERACIONALES",
    "padreCodigo": "5.2",
    "nivel": 3,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": false
  },
  {
    "codigo": "5.2.01.01",
    "nombre": "Sueldos y salarios",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.02",
    "nombre": "Beneficios y prestaciones sociales",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.03",
    "nombre": "Comisiones a vendedores",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.04",
    "nombre": "Horas extras",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.05",
    "nombre": "Subsidio familiar",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.06",
    "nombre": "Gastos de representación",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.07",
    "nombre": "Viáticos y gastos de viajes",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.08",
    "nombre": "Aporte patronal al IESS",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  },
  {
    "codigo": "5.2.01.09",
    "nombre": "Arriendo de locales y oficinas",
    "padreCodigo": "5.2.01",
    "nivel": 4,
    "tipo": "GASTO",
    "naturaleza": "DEUDORA",
    "permiteMovimiento": true
  }
] as const;

async function main() {
  const empresa = await prisma.empresa.upsert({
    where: { ruc: '9999999999001' },
    update: { nombre: 'Empresa Demo S.A.' },
    create: {
      nombre: 'Empresa Demo S.A.',
      ruc: '9999999999001',
    },
  });

  await prisma.periodoContable.upsert({
    where: {
      empresaId_anio_mes: {
        empresaId: empresa.id,
        anio: 2026,
        mes: 1,
      },
    },
    update: {
      fechaInicio: new Date('2026-01-01T00:00:00.000Z'),
      fechaFin: new Date('2026-01-31T23:59:59.999Z'),
      estado: 'ABIERTO',
    },
    create: {
      empresaId: empresa.id,
      anio: 2026,
      mes: 1,
      fechaInicio: new Date('2026-01-01T00:00:00.000Z'),
      fechaFin: new Date('2026-01-31T23:59:59.999Z'),
      estado: 'ABIERTO',
    },
  });

  const cuentasPorCodigo = new Map<string, string>();

  for (const cuenta of cuentas) {
    const cuentaPadreId = cuenta.padreCodigo ? cuentasPorCodigo.get(cuenta.padreCodigo) : undefined;

    const cuentaCreada = await prisma.cuentaContable.upsert({
      where: {
        empresaId_codigo: {
          empresaId: empresa.id,
          codigo: cuenta.codigo,
        },
      },
      update: {
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        naturaleza: cuenta.naturaleza,
        nivel: cuenta.nivel,
        permiteMovimiento: cuenta.permiteMovimiento,
        cuentaPadreId: cuentaPadreId ?? null,
      },
      create: {
        empresaId: empresa.id,
        codigo: cuenta.codigo,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        naturaleza: cuenta.naturaleza,
        nivel: cuenta.nivel,
        permiteMovimiento: cuenta.permiteMovimiento,
        cuentaPadreId: cuentaPadreId ?? null,
      },
    });

    cuentasPorCodigo.set(cuenta.codigo, cuentaCreada.id);
  }

  console.log('Seed contable creado: ' + cuentas.length + ' cuentas, Empresa Demo S.A. y periodo enero 2026 abierto.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
