import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import asientosRoutes from './modules/asientos/asientos.routes';
import cuentasRoutes from './modules/cuentas/cuentas.routes';
import reportesRoutes from './modules/reportes/reportes.routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/asientos', asientosRoutes);
app.use('/api/reportes', reportesRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "Sistema Contable funcionando"
  });
});

// Start Server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
