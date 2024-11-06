import React, { } from 'react';

const MeuComponente = ({ cliente, setCliente, acesso }) => {

  // Função para adicionar um novo e-mail
  const handleAddEmail = () => {
    const newEmail = { descricao: '' };
    setCliente((prevCliente) => ({
      ...prevCliente, // Mantém o estado original do cliente
      emails: [...prevCliente.emails, newEmail], // Adiciona um novo e-mail
    }));
  };

  // Função para remover um e-mail específico
  const handleRemoveEmail = (index) => {
    setCliente((prevCliente) => ({
      ...prevCliente, // Mantém o estado original do cliente
      emails: prevCliente.emails.filter((_, i) => i !== index), // Remove o e-mail
    }));
  };

  // Função para atualizar o campo 'descrição' do e-mail
  const handleEmailChange = (index, field, value) => {
    setCliente((prevCliente) => {
      const updatedEmails = [...prevCliente.emails]; // Cria uma cópia da lista de e-mails
      updatedEmails[index] = {
        ...updatedEmails[index], // Mantém os outros campos do cliente
        [field]: value, // Atualiza apenas o campo específico
      };
      return {
        ...prevCliente, // Mantém o estado original do cliente
        emails: updatedEmails, // Atualiza a lista de e-mails
      };
    });
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          {acesso === 'TOTAL' && (
          <span className="cursor-pointer me-2" onClick={handleAddEmail} title="Adicionar E-mail">
            <i className="bi bi-plus-circle" style={{ fontSize: '20px', color: 'blue' }}></i>
          </span>
          )}
          E-mails
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
            <label className="form-label">E-mails</label>
            {cliente.emails && cliente.emails.map((email, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
                <input type="email" className="form-control me-2" placeholder="Digite o e-mail" value={email.descricao} 
                onChange={(e) => handleEmailChange(index, 'descricao', e.target.value)} readOnly={acesso === 'LEITURA'}  required />
                {acesso === 'TOTAL' && (
                <span className="cursor-pointer" onClick={() => handleRemoveEmail(index)} title="Remover E-mail">
                  <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
                </span>
                )}
            </div>
            ))}
        </div>        
      </div>
    </div>          
  );
};

export default MeuComponente;