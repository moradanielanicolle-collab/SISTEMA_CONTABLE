import prisma from '../../config/prisma';

export class CuentasService {
  async listarCuentas(buscar?: string) {
    const filtroBusqueda = buscar?.trim();

    return prisma.cuentaContable.findMany({
      where: {
        activo: true,
        permiteMovimiento: true,
        ...(filtroBusqueda
          ? {
              OR: [
                {
                  codigo: {
                    contains: filtroBusqueda,
                    mode: 'insensitive',
                  },
                },
                {
                  nombre: {
                    contains: filtroBusqueda,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
      orderBy: {
        codigo: 'asc',
      },
      take: 30,
    });
  }
}
