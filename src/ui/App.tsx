// File: src/ui/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserPage from "./pages/UserPage";
import Category from "./pages/CategoryPage";
import GenderPage from "./pages/GenderPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PausePage from "./pages/PausePage";
import LossPage from "./pages/LossPage";
import OperationalAssessmentPage from "./pages/OperationalAssessmentPage";
import QuestionsPage from "./pages/QuestionsPage";
import StorePage from "./pages/StorePage";
import AuditPage from "./pages/AuditPage";

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastros/usuario" element={<UserPage />} />
        <Route path="/cadastros/categoria" element={<Category />} />
        <Route path="cadastros/genero" element={<GenderPage />} />
        <Route path="cadastros/forma-pagamento" element={<PaymentMethodPage />} />
        <Route path="cadastros/motivo-pausa" element={<PausePage />} />
        <Route path="cadastros/motivo-perdas" element={<LossPage />} />
        <Route path="cadastros/avaliacao-operacional" element={<OperationalAssessmentPage />} />
        <Route path="cadastros/questoes" element={<QuestionsPage />} />
        <Route path="cadastros/loja" element={<StorePage />} />
        <Route path="/auditoria/agendamento" element={<AuditPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
