import { Router } from 'express';
import { CuentasController } from './cuentas.controller';

const router = Router();
const controller = new CuentasController();

router.get('/', controller.listarCuentas.bind(controller));

export default router;
