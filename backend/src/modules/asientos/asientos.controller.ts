import { EstadoAsiento, OrigenAsiento, TipoAsiento } from '@prisma/client';
import { Request, Response } from 'express';
import { AsientosError, AsientosService, CodigoErrorAsiento } from './asientos.service';

const asientosService = new AsientosService();

export class AsientosController {
  async listarAsientos(req: Request, res: Response) {
    try {
      const data = await asientosService.listarAsientos({
        empresaId: this.getString(req.query.empresaId),
        fechaDesde: this.getDate(req.query.fechaDesde, 'fechaDesde'),
        fechaHasta: this.getDate(req.query.fechaHasta, 'fechaHasta'),
        estado: this.getEstado(req.query.estado),
      });

      this.success(res, data);
    } catch (error) {
      this.failure(res, error);
    }
  }

  async obtenerAsiento(req: Request, res: Response) {
    try {
      const data = await asientosService.obtenerAsiento(this.requiredString(req.params.id, 'id'));

      this.success(res, data);
    } catch (error) {
      this.failure(res, error);
    }
  }

  async crearAsiento(req: Request, res: Response) {
    try {
      const data = await asientosService.crearAsiento({
        empresaId: this.requiredString(req.body.empresaId, 'empresaId'),
        fecha: this.requiredString(req.body.fecha, 'fecha'),
        descripcion: this.requiredString(req.body.descripcion, 'descripcion'),
        tipo: this.getTipo(req.body.tipo),
        origen: this.getOrigen(req.body.origen),
        lineas: Array.isArray(req.body.lineas) ? req.body.lineas : [],
      });

      this.success(res, data, 201);
    } catch (error) {
      this.failure(res, error);
    }
  }

  async anularAsiento(req: Request, res: Response) {
    try {
      const data = await asientosService.anularAsiento(this.requiredString(req.params.id, 'id'));

      this.success(res, data);
    } catch (error) {
      this.failure(res, error);
    }
  }

  private success(res: Response, data: unknown, status = 200) {
    res.status(status).json({
      success: true,
      data,
    });
  }

  private failure(res: Response, error: unknown) {
    const codigo = this.getCodigoError(error);
    const mensaje = error instanceof Error ? error.message : 'Error interno.';

    res.status(this.getStatus(codigo)).json({
      success: false,
      error: {
        codigo,
        mensaje,
      },
    });
  }

  private getStatus(codigo: CodigoErrorAsiento) {
    if (codigo === 'ASIENTO_NO_ENCONTRADO') {
      return 404;
    }

    if (codigo === 'ERROR_INTERNO') {
      return 500;
    }

    return 400;
  }

  private getCodigoError(error: unknown): CodigoErrorAsiento {
    if (error instanceof AsientosError) {
      return error.codigo;
    }

    return 'ERROR_INTERNO';
  }

  private getString(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }

  private requiredString(value: unknown, fieldName: string) {
    const text = this.getString(value);

    if (!text) {
      throw new AsientosError('VALIDACION', `El campo ${fieldName} es obligatorio.`);
    }

    return text;
  }

  private getDate(value: unknown, fieldName: string) {
    const text = this.getString(value);

    if (!text) {
      return undefined;
    }

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
      throw new AsientosError('VALIDACION', `El parámetro ${fieldName} no es una fecha válida.`);
    }

    return date;
  }

  private getEstado(value: unknown) {
    const text = this.getString(value);

    if (!text) {
      return undefined;
    }

    if (!Object.values(EstadoAsiento).includes(text as EstadoAsiento)) {
      throw new AsientosError('VALIDACION', 'El estado no es válido.');
    }

    return text as EstadoAsiento;
  }

  private getTipo(value: unknown) {
    const text = this.requiredString(value, 'tipo');

    if (!Object.values(TipoAsiento).includes(text as TipoAsiento)) {
      throw new AsientosError('VALIDACION', 'El tipo de asiento no es válido.');
    }

    return text as TipoAsiento;
  }

  private getOrigen(value: unknown) {
    const text = this.getString(value);

    if (!text) {
      return undefined;
    }

    if (!Object.values(OrigenAsiento).includes(text as OrigenAsiento)) {
      throw new AsientosError('VALIDACION', 'El origen de asiento no es válido.');
    }

    return text as OrigenAsiento;
  }
}
