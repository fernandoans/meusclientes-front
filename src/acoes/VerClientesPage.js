import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function VerClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [nivelAcesso, setNivelAcesso] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      // Obter o token armazenado na sessão
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      // Obter o acesso armazenado na seção
      const acesso = sessionStorage.getItem('acesso');
      setNivelAcesso(acesso);

      try {
        const response = await fetch('http://localhost:8080/meusclientes/cliente/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setClientes(data);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, [navigate]);

  const navAddCliente = () => {
    navigate('/addcliente');
  };

  const handleLogout = () => {
    // Limpar o sessionStorage
    sessionStorage.clear();
    
    // Redireciona para a página de login ou outra página desejada
    navigate('/'); // ajuste o caminho para a sua página de login
  };  

  if (loading) {
    return <p>Carregando clientes...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Clientes Cadastrados</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            {nivelAcesso === 'TOTAL' && (
              <th className="d-flex justify-content-center">Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td>
                <Link to={`/vercliente/${cliente.cpf}`} title="Detalhar Cliente">
                  {cliente.cpf}
                </Link>
              </td>
              <td>{cliente.nome}</td>
              <td>{cliente.emails[0]?.descricao || 'N/A'}</td>
              <td>{cliente.telefones[0]?.numero || 'N/A'}</td>
              {nivelAcesso === 'TOTAL' && (
              <td>
                <div className="d-flex justify-content-center">
                  <Link to={`/altcliente/${cliente.cpf}`} className="me-3" title="Alterar Cliente">
                    <i className="bi bi-pencil" style={{ fontSize: '15px', color: 'blue' }}></i>
                  </Link>
                  <Link to={`/exccliente/${cliente.cpf}`} title="Excluir Cliente">
                    <i className="bi bi-trash" style={{ fontSize: '15px', color: 'red' }}></i>
                  </Link>
                </div>                
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-5">
        {nivelAcesso === 'TOTAL' && (
          <button className="btn btn-primary w-20 me-5" onClick={navAddCliente}>Adicionar Clientes</button>
        )}
        <button className="btn btn-danger w-20" onClick={handleLogout}>Sair do Sistema</button>
      </div>
    </div>
  );
}

export default VerClientes;
