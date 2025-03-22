// File: src/ui/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserPage from "./pages/UserPage";
import Category from "./pages/CategoryPage";
import GenderPage from "./pages/GenderPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";

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
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
