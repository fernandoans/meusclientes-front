import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmailUtil from '../utils/EmailUtil';
import TelefoneUtil from '../utils/TelefoneUtil';

function VerCliente() {
  const { cpf } = useParams(); // Obtém o CPF da URL
  const [loading, setLoading] = useState(true);
  const [errorMessage] = useState('');
  const navigate = useNavigate();

  // Estrutura de Cliente
  const [cliente, setCliente] = useState({
    cpf: '',
    nome: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: '',
    emails: [{ id: '', descricao: '' }],
    telefones: [{ id: '', tipo: '', numero: '' }],
  });

  // Recuperar o nível de acesso do sessionStorage ao carregar o componente
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }        

    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:8080/meusclientes/cliente/${cpf}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCliente(data);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }    
    };
    fetchCliente();
  }, [navigate, cpf]);

  if (loading) {
    return <p>Carregando o cliente...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Visualizar o Cliente</h2>
      {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}  
      <form className="container mt-5">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Dados Básicos</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
                <div className="col-md-2">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input type="text" className="form-control" id="cpf" name="cpf" value={cliente.cpf} maxLength="14" readOnly required />
                </div>

                <div className="col-md-10">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="nome" name="nome" value={cliente.nome} readOnly required />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-2">
                    <div>
                        <label htmlFor="cep" className="form-label">CEP</label>
                        <input type="text" className="form-control" id="cep" name="cep" value={cliente.cep} maxLength="9" readOnly required />
                    </div>
                </div>
                <div className="col-md-10">
                    <label htmlFor="logradouro" className="form-label">Logradouro</label>
                    <input type="text" className="form-control" id="logradouro" name="logradouro" value={cliente.logradouro} readOnly required />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-5">
                    <div className="mb-3">
                        <label htmlFor="bairro" className="form-label">Bairro</label>
                        <input type="text" className="form-control" id="bairro" name="bairro" value={cliente.bairro} readOnly required />
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="mb-3">
                        <label htmlFor="cidade" className="form-label">Cidade</label>
                        <input type="text" className="form-control" id="cidade" name="cidade" value={cliente.cidade} readOnly required />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="mb-3">
                        <label htmlFor="uf" className="form-label">UF</label>
                        <input type="text" className="form-control" id="uf" name="uf" value={cliente.uf} readOnly required />
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="complemento" className="form-label">Complemento</label>
                <input type="text" className="form-control" id="complemento" name="complemento" value={cliente.complemento} readOnly />
            </div>
          </div>
        </div>  

        <EmailUtil cliente={cliente} setCliente={setCliente} acesso="LEITURA" />
        <TelefoneUtil cliente={cliente} setCliente={setCliente} acesso="LEITURA" />
      </form>
    </div>
  );
}

export default VerCliente;