import React, { } from 'react';

const MeuComponente = ({ cliente, setCliente, acesso }) => {

  // Função para adicionar um novo telefone
  const handleAddTelefone = () => {
    const newTelefone = { tipo: '', numero: '' };
    setCliente((prevCliente) => ({
      ...prevCliente, // Mantém o estado original do cliente
      telefones: [...prevCliente.telefones, newTelefone], // Adiciona um novo telefone
    }));
  };

  // Função para remover um telefone específico
  const handleRemoveTelefone = (index) => {
    setCliente((prevCliente) => ({
      ...prevCliente, // Mantém o estado original do cliente
      telefones: prevCliente.telefones.filter((_, i) => i !== index), // Remove o telefone
    }));
  };

  // Função para atualizar o campo 'tipo' ou 'numero' do telefone
  const handleTelefoneChange = (index, field, value) => {
    setCliente((prevCliente) => {
      const updatedTelefones = [...prevCliente.telefones]; // Cria uma cópia da lista de telefones
      updatedTelefones[index] = {
        ...updatedTelefones[index], // Mantém os outros campos do telefone
        [field]: value, // Atualiza apenas o campo específico
      };
      return {
        ...prevCliente, // Mantém o estado original do cliente
        telefones: updatedTelefones, // Atualiza a lista de telefones
      };
    });
  };

  // Formatar o número de acordo com o tipo
  const formatarNumero = (numero, tipo) => {
    console.log(tipo);
    // Remove todos os caracteres não numéricos
    const apenasDigitos = numero.replace(/\D/g, '');

    if (tipo === 'C' && apenasDigitos.length === 9) {
        console.log('eNTREI cele');
        // Formato para Celular: 99999-9999
        return `${apenasDigitos.slice(0, 5)}-${apenasDigitos.slice(5)}`;
    } else if (apenasDigitos.length === 8) {
        // Formato para Residencial e Comercial: 9999-9999
        return `${apenasDigitos.slice(0, 4)}-${apenasDigitos.slice(4)}`;
    }
    // Retorna o número sem formatação se não corresponder
    return apenasDigitos;
  };

  return (
    <div className="card mb-4">
    <div className="card-header">
      <h5 className="mb-0">
        {acesso === 'TOTAL' && (
        <span className="cursor-pointer me-2" onClick={handleAddTelefone} title="Adicionar Telefone">
          <i className="bi bi-plus-circle" style={{ fontSize: '20px', color: 'blue' }}></i>
        </span>
        )}
        Telefones
      </h5>
    </div>
    <div className="card-body">
      {cliente.telefones && cliente.telefones?.map((telefone, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <select className="form-select me-2" value={telefone.tipo}
            onChange={(e) => handleTelefoneChange(index, 'tipo', e.target.value)}
            required disabled={acesso === 'LEITURA'}>
            <option value="">Selecione o Tipo</option>
            <option value="R">Residencial</option>
            <option value="T">Comercial</option>
            <option value="C">Celular</option>
          </select>
          <input type="text" className="form-control me-2" placeholder="Número" value={telefone.numero} maxLength={telefone.tipo === 'C' ? 10 : 9}
            onChange={(e) => handleTelefoneChange(index, 'numero', formatarNumero(e.target.value, telefone.tipo))} readOnly={acesso === 'LEITURA'}  required
          />
          {acesso === 'TOTAL' && (
          <span className="cursor-pointer" onClick={() => handleRemoveTelefone(index)} title="Remover Telefone">
            <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
          </span>
          )}
        </div>
      ))}     
    </div>
  </div>          
  );
};

export default MeuComponente;