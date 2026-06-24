-- AlterTable
ALTER TABLE "CuentaContable" ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "LineaAsiento_asientoId_orden_key" ON "LineaAsiento"("asientoId", "orden");
