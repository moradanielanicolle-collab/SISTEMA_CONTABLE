import { Router } from 'express';
import { ReportesController } from './reportes.controller';

const router = Router();
const controller = new ReportesController();

router.get('/libro-diario', controller.obtenerLibroDiario.bind(controller));
router.get('/libro-mayor', controller.obtenerLibroMayor.bind(controller));
router.get('/balance-comprobacion', controller.obtenerBalanceComprobacion.bind(controller));
router.get('/estado-resultados', controller.obtenerEstadoResultados.bind(controller));
router.get('/estado-situacion-financiera', controller.obtenerEstadoSituacionFinanciera.bind(controller));

export default router;
