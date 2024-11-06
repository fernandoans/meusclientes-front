import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './acoes/LoginPage';
import VerClientes from './acoes/VerClientesPage';
import VerCliente from './acoes/VerClientePage';
import AddCliente from './acoes/AddClientePage';
import AlterarCliente from './acoes/AltClientePage';
import ExcluirCliente from './acoes/ExcClientePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

//function Menu() {
//  return <h1>Bem-vindo ao Menu!</h1>;
//}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verclientes" element={<VerClientes />} />
        <Route path="/vercliente/:cpf" element={<VerCliente />} />        
        <Route path="/addcliente" element={<AddCliente />} />
        <Route path="/altcliente/:cpf" element={<AlterarCliente />} />        
        <Route path="/exccliente/:cpf" element={<ExcluirCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
