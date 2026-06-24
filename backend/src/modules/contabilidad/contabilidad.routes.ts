import { Router } from 'express';
import { ContabilidadController } from './contabilidad.controller';

const router = Router();
const controller = new ContabilidadController();

// Define contabilidad module routes here

export default router;
