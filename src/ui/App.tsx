// File: src/ui/App.tsx
import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/CategoryPage";
const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/cadastros/categoria" element={<Category/>}/>
        <Route path="*" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
