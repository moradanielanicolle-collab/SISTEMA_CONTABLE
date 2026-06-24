import { Request, Response } from 'express';
import { CuentasService } from './cuentas.service';

const cuentasService = new CuentasService();

export class CuentasController {
  async listarCuentas(req: Request, res: Response) {
    try {
      const buscar = typeof req.query.buscar === 'string' ? req.query.buscar : undefined;
      const data = await cuentasService.listarCuentas(buscar);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          codigo: 'ERROR_INTERNO',
          mensaje: error instanceof Error ? error.message : 'Error interno.',
        },
      });
    }
  }
}
