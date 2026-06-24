import { Navigate, Route, Routes } from 'react-router-dom';
import { ContabilidadLayout } from './modules/contabilidad/ContabilidadLayout';
import { DetalleAsientoPage } from './modules/contabilidad/DetalleAsientoPage';
import { LibroDiarioPage } from './modules/contabilidad/LibroDiarioPage';
import { NuevoAsientoPage } from './modules/contabilidad/NuevoAsientoPage';
import { BalanceComprobacionPage } from './modules/reportes/BalanceComprobacionPage';
import { EstadoResultadosPage } from './modules/reportes/EstadoResultadosPage';
import { EstadoSituacionFinancieraPage } from './modules/reportes/EstadoSituacionFinancieraPage';
import { LibroMayorPage } from './modules/reportes/LibroMayorPage';

function App() {
  return (
    <Routes>
      <Route element={<ContabilidadLayout />}>
        <Route path="/" element={<Navigate to="/asientos" replace />} />
        <Route path="/asientos" element={<LibroDiarioPage />} />
        <Route path="/asientos/nuevo" element={<NuevoAsientoPage />} />
        <Route path="/asientos/:id" element={<DetalleAsientoPage />} />
        <Route path="/reportes/libro-mayor" element={<LibroMayorPage />} />
        <Route path="/reportes/balance-comprobacion" element={<BalanceComprobacionPage />} />
        <Route path="/reportes/estado-resultados" element={<EstadoResultadosPage />} />
        <Route path="/reportes/estado-situacion-financiera" element={<EstadoSituacionFinancieraPage />} />
      </Route>
    </Routes>
  );
}

export default App;
