// Em: src/App.jsx

import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import Planos from "./pages/Planos.jsx";
import Welcome from "./pages/Welcome";
import Checkout from "./pages/Checkout.jsx";
import Overview from "./pages/dashboard/Overview";
import DashboardLayout from "./layouts/DashboardLayout";

// Layout Público (Site, Landing Page, Login)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> Futura Navbar do Site */}
      <div className="flex-1">
        <Outlet />
      </div>
      {/* <Footer /> Futuro Footer do Site */}
    </div>
  );
}

function App() {
  return (
    <Routes>
      
      {/* --- GRUPO 1: ROTAS PÚBLICAS --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/welcome/:planName" element={<Welcome />} />
        <Route path="/checkout/:planName" element={<Checkout />} />
      </Route>

      {/* --- GRUPO 2: ROTAS DO DASHBOARD (Separado) --- */}
      {/* Aqui usamos o DashboardLayout como "pai" */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Quando acessar /dashboard, renderiza o Overview dentro do Layout */}
        <Route index element={<Overview />} />
        
        {/* Futuras rotas ficarão aqui dentro: */}
        {/* <Route path="lojas" element={<Stores />} /> */}
        {/* <Route path="estoque" element={<Inventory />} /> */}
      </Route>

    </Routes>
  );
}

export default App;