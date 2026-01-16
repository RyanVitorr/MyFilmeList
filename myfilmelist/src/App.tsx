import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import MinhaLista from './pages/lista/MinhaLista';
import Detalhes from './pages/detalhes/Detalhes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Minha-lista" element={<MinhaLista/>}/>
        <Route path="/detalhes/:id" element={<Detalhes/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
