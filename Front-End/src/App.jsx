// Em: src/App.jsx (Este é um ARQUIVO NOVO)

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import  Home  from './pages/Home.jsx'; 
import { Login } from './pages/Login.jsx';
import  Planos  from './pages/Planos.jsx';
import Welcome from './pages/Welcome'; 
import Checkout from './pages/Checkout.jsx';
// (Eventualmente, podemos adicionar Navbar/Footer aqui)
function Layout() {
  return (
    <div>
      {/* <Navbar /> */}
      <Outlet /> {/* As páginas (Home, Login, etc.) serão renderizadas aqui */}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rota 1: A Home Page */}
        <Route index element={<Home />} />
        
        {/* Rota 2: Login/Cadastro */}
        <Route path="login" element={<Login />} />
        
        <Route path="Home" element={<Home />} />

        {/* Rota 3: Planos */}
        <Route path="planos" element={<Planos />} />

        <Route path="/welcome/:planName" element={<Welcome />} />

        <Route path="/checkout/:planName" element={<Checkout />} />

        {/* (Futuramente) Rota 4: Pagamento */}
        {/* <Route path="pagamento" element={<Pagamento />} /> */}

      </Route>
    </Routes>
  );
}

export default App;