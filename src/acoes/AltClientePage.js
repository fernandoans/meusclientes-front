import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EmailUtil from '../utils/EmailUtil';
import TelefoneUtil from '../utils/TelefoneUtil';

function AlterarCliente() {
  const { cpf } = useParams(); // Obtém o CPF da URL
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
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
    emails: [{ descricao: '' }],
    telefones: [{ tipo: '', numero: '' }],
  });

  // Recuperar o nível de acesso do sessionStorage ao carregar o componente
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }        
    const acesso = sessionStorage.getItem('acesso');
    if (acesso !== 'TOTAL') {
      navigate('/verclientes');
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

  // Gerenciar as mudanças
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
        ...prevCliente,
        [name]: value,
    }));
  };    

  // Ao buscar o CEP
  const handleBuscarCep = async () => {
    setErrorMessage("Localizando o CEP...");
    if (cliente.cep) {
      try {
          const token = sessionStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/meusclientes/cep/${cliente.cep}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          const { logradouro = '', bairro = '', localidade = '', uf = '' } = response.data;
          setCliente((prevCliente) => ({
              ...prevCliente,
              logradouro,
              bairro,
              cidade: localidade,
              uf,
          }));
          setErrorMessage("");
      } catch (error) {
          alert('CEP inválido ou erro na busca');
          setErrorMessage("");
      }
    } else {
      alert('Por favor, digite um CEP');
      setErrorMessage("");
    }
  };

  // Alterar o cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      console.log(JSON.stringify(cliente));

      const response = await fetch('http://localhost:8080/meusclientes/cliente/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente), // Inclui o cliente como JSON no corpo da requisição
      });
      if (response.ok) {
        alert('Cliente modificado com sucesso!');
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(`${errorData.erro}`);
        alert('Erro ao modificar o cliente!');
      }
    } catch (error) {
      setErrorMessage(`${error}`);
      alert('Erro ao modificar o cliente!');
    }                  
  };

  // Formatação dos Campos
  
  // Formatar CPF
  const handleCpfChange = (e) => {
    // Remover qualquer caractere não numérico
    let cpf = e.target.value.replace(/\D/g, ''); 
  
    // Limitar o CPF a 11 dígitos (sem a formatação)
    if (cpf.length > 11) {
      cpf = cpf.slice(0, 11);
    }

    // Aplicar a máscara do CPF
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{2})$/, '$1-$2');
  
    setCliente((prevCliente) => ({
      ...prevCliente,
      cpf: cpf,
    }));
  };

  // Formatar CEP
  const handleCepChange = (e) => {
    // Remover qualquer caractere não numérico
    let cep = e.target.value.replace(/\D/g, ''); 
  
    // Limitar o CEP a 8 dígitos (sem a formatação)
    if (cep.length > 8) {
      cep = cep.slice(0, 8);
    }
  
    // Aplicar a máscara do CEP
    cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
  
    setCliente((prevCliente) => ({
      ...prevCliente,
      cep: cep,
    }));
  };  
    
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Alterar Cliente</h2>
      {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}  
      <form onSubmit={handleSubmit} className="container mt-5">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Dados Básicos</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
                <div className="col-md-2">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input type="text" className="form-control" id="cpf" name="cpf" value={cliente.cpf} onChange={handleCpfChange} maxLength="14" required />
                </div>

                <div className="col-md-10">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="nome" name="nome" value={cliente.nome} onChange={handleChange} required />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-2">
                    <div className="row mb-3">
                        <div className="col-md-10">
                            <div>
                                <label htmlFor="cep" className="form-label">CEP</label>
                                <input type="text" className="form-control" id="cep" name="cep" value={cliente.cep} onChange={handleCepChange} maxLength="9" required />
                            </div>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <span className="mt-2 cursor-pointer" onClick={handleBuscarCep} title="Buscar CEP">
                              <i className="bi bi-geo-alt" style={{ fontSize: '20px', color: 'green' }}></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-10">
                    <label htmlFor="logradouro" className="form-label">Logradouro</label>
                    <input type="text" className="form-control" id="logradouro" name="logradouro" value={cliente.logradouro} onChange={handleChange} required />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-5">
                    <div className="mb-3">
                        <label htmlFor="bairro" className="form-label">Bairro</label>
                        <input type="text" className="form-control" id="bairro" name="bairro" value={cliente.bairro} onChange={handleChange} required />
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="mb-3">
                        <label htmlFor="cidade" className="form-label">Cidade</label>
                        <input type="text" className="form-control" id="cidade" name="cidade" value={cliente.cidade} onChange={handleChange} required />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="mb-3">
                        <label htmlFor="uf" className="form-label">UF</label>
                        <input type="text" className="form-control" id="uf" name="uf" value={cliente.uf} onChange={handleChange} required />
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="complemento" className="form-label">Complemento</label>
                <input type="text" className="form-control" id="complemento" name="complemento" value={cliente.complemento} onChange={handleChange} />
            </div>
          </div>
        </div>  

        <EmailUtil cliente={cliente} setCliente={setCliente} acesso={sessionStorage.getItem('acesso')} />
        <TelefoneUtil cliente={cliente} setCliente={setCliente} acesso={sessionStorage.getItem('acesso')} />

        <button type="submit" className="btn btn-success">Modificar Cliente</button>
      </form>
    </div>
  );
}

export default AlterarCliente;