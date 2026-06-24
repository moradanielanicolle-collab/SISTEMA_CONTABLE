import { Router } from 'express';
import { AsientosController } from './asientos.controller';

const router = Router();
const controller = new AsientosController();

router.get('/', controller.listarAsientos.bind(controller));
router.get('/:id', controller.obtenerAsiento.bind(controller));
router.post('/', controller.crearAsiento.bind(controller));
router.post('/:id/anular', controller.anularAsiento.bind(controller));

export default router;
