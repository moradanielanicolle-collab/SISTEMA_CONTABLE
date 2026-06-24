-- CreateEnum
CREATE TYPE "EstadoPeriodo" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "TipoCuenta" AS ENUM ('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTO');

-- CreateEnum
CREATE TYPE "NaturalezaCuenta" AS ENUM ('DEUDORA', 'ACREEDORA');

-- CreateEnum
CREATE TYPE "EstadoAsiento" AS ENUM ('BORRADOR', 'APROBADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "TipoAsiento" AS ENUM ('APERTURA', 'MANUAL', 'AUTOMATICO', 'AJUSTE', 'CIERRE');

-- CreateEnum
CREATE TYPE "OrigenAsiento" AS ENUM ('VENTA', 'COMPRA', 'GASTO', 'COBRO', 'PAGO', 'INVENTARIO', 'NINGUNO');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodoContable" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoPeriodo" NOT NULL DEFAULT 'ABIERTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodoContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaContable" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCuenta" NOT NULL,
    "naturaleza" "NaturalezaCuenta" NOT NULL,
    "nivel" INTEGER NOT NULL,
    "permiteMovimiento" BOOLEAN NOT NULL DEFAULT true,
    "cuentaPadreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsientoContable" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "numero" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoAsiento" NOT NULL DEFAULT 'BORRADOR',
    "tipo" "TipoAsiento" NOT NULL,
    "origen" "OrigenAsiento" NOT NULL DEFAULT 'NINGUNO',
    "asientoReversoDeId" TEXT,
    "anuladoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsientoContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineaAsiento" (
    "id" TEXT NOT NULL,
    "asientoId" TEXT NOT NULL,
    "cuentaId" TEXT NOT NULL,
    "detalle" TEXT,
    "debe" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "haber" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "orden" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineaAsiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ruc_key" ON "Empresa"("ruc");

-- CreateIndex
CREATE INDEX "PeriodoContable_empresaId_estado_idx" ON "PeriodoContable"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "PeriodoContable_empresaId_fechaInicio_fechaFin_idx" ON "PeriodoContable"("empresaId", "fechaInicio", "fechaFin");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodoContable_empresaId_anio_mes_key" ON "PeriodoContable"("empresaId", "anio", "mes");

-- CreateIndex
CREATE INDEX "CuentaContable_empresaId_tipo_idx" ON "CuentaContable"("empresaId", "tipo");

-- CreateIndex
CREATE INDEX "CuentaContable_empresaId_naturaleza_idx" ON "CuentaContable"("empresaId", "naturaleza");

-- CreateIndex
CREATE INDEX "CuentaContable_empresaId_cuentaPadreId_idx" ON "CuentaContable"("empresaId", "cuentaPadreId");

-- CreateIndex
CREATE INDEX "CuentaContable_empresaId_permiteMovimiento_idx" ON "CuentaContable"("empresaId", "permiteMovimiento");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaContable_empresaId_codigo_key" ON "CuentaContable"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "AsientoContable_empresaId_fecha_idx" ON "AsientoContable"("empresaId", "fecha");

-- CreateIndex
CREATE INDEX "AsientoContable_empresaId_periodoId_idx" ON "AsientoContable"("empresaId", "periodoId");

-- CreateIndex
CREATE INDEX "AsientoContable_empresaId_estado_idx" ON "AsientoContable"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "AsientoContable_empresaId_tipo_idx" ON "AsientoContable"("empresaId", "tipo");

-- CreateIndex
CREATE INDEX "AsientoContable_empresaId_origen_idx" ON "AsientoContable"("empresaId", "origen");

-- CreateIndex
CREATE UNIQUE INDEX "AsientoContable_empresaId_numero_key" ON "AsientoContable"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "LineaAsiento_asientoId_idx" ON "LineaAsiento"("asientoId");

-- CreateIndex
CREATE INDEX "LineaAsiento_cuentaId_idx" ON "LineaAsiento"("cuentaId");

-- CreateIndex
CREATE INDEX "LineaAsiento_cuentaId_asientoId_idx" ON "LineaAsiento"("cuentaId", "asientoId");

-- AddForeignKey
ALTER TABLE "PeriodoContable" ADD CONSTRAINT "PeriodoContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_cuentaPadreId_fkey" FOREIGN KEY ("cuentaPadreId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "PeriodoContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_asientoReversoDeId_fkey" FOREIGN KEY ("asientoReversoDeId") REFERENCES "AsientoContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_anuladoPorId_fkey" FOREIGN KEY ("anuladoPorId") REFERENCES "AsientoContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineaAsiento" ADD CONSTRAINT "LineaAsiento_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "AsientoContable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineaAsiento" ADD CONSTRAINT "LineaAsiento_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
