import { EstadoAsiento } from '@prisma/client';
import { Request, Response } from 'express';
import { ReportesService } from './reportes.service';

const reportesService = new ReportesService();

export class ReportesController {
  async obtenerLibroDiario(req: Request, res: Response) {
    try {
      const data = await reportesService.obtenerLibroDiario(this.parseFiltros(req));

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async obtenerLibroMayor(req: Request, res: Response) {
    try {
      const data = await reportesService.obtenerLibroMayor(this.parseFiltros(req));

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async obtenerBalanceComprobacion(req: Request, res: Response) {
    try {
      const data = await reportesService.obtenerBalanceComprobacion(this.parseFiltros(req));

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async obtenerEstadoResultados(req: Request, res: Response) {
    try {
      const data = await reportesService.obtenerEstadoResultados(this.parseFiltros(req));

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async obtenerEstadoSituacionFinanciera(req: Request, res: Response) {
    try {
      const data = await reportesService.obtenerEstadoSituacionFinanciera(this.parseFiltros(req));

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private parseFiltros(req: Request) {
    const { empresaId, periodoId, fechaDesde, fechaHasta, estado } = req.query;

    return {
      empresaId: this.getString(empresaId),
      periodoId: this.getString(periodoId),
      fechaDesde: this.getDate(fechaDesde, 'fechaDesde'),
      fechaHasta: this.getDate(fechaHasta, 'fechaHasta'),
      estado: this.getEstadoAsiento(estado),
    };
  }

  private getString(value: unknown) {
    if (typeof value !== 'string' || value.trim() === '') {
      return undefined;
    }

    return value.trim();
  }

  private getDate(value: unknown, fieldName: string) {
    const text = this.getString(value);

    if (!text) {
      return undefined;
    }

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`El parámetro ${fieldName} no es una fecha válida.`);
    }

    return date;
  }

  private getEstadoAsiento(value: unknown) {
    const text = this.getString(value);

    if (!text) {
      return undefined;
    }

    if (!Object.values(EstadoAsiento).includes(text as EstadoAsiento)) {
      throw new Error('El parámetro estado no es válido.');
    }

    return text as EstadoAsiento;
  }

  private handleError(error: unknown, res: Response) {
    const message = error instanceof Error ? error.message : 'Error inesperado.';

    res.status(400).json({
      success: false,
      message,
    });
  }
}
