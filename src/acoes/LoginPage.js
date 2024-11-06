import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Criptografando a senha em Base64
    const senhaBase64 = btoa(senha);
    

    try {
      const response = await fetch('http://localhost:8080/meusclientes/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha: senhaBase64 }),
      });
      if (response.ok) {
        const data = await response.json();
  
        // Decodificar o token Base64
        const decodedToken = atob(data.mensagem);
  
        // Separar os campos usando o separador ":"
        const [, username, acesso,] = decodedToken.split(':');

        // Armazenar o usuario em sessionStorage
        sessionStorage.setItem('usuario', username);
        // Armazenar o nível de acesso em sessionStorage
        sessionStorage.setItem('acesso', acesso);
        // Armazenar o token na sessão
        sessionStorage.setItem('token', data.mensagem);

        // Agora você pode usar o nível de acesso em qualquer parte da aplicação
        navigate('/verclientes');
        console.log('Login bem-sucedido:', data.mensagem);
      } else {
        const data = await response.json();
        setErrorMessage(data.erro);
        console.error('Erro no login:', data.erro);
      }      

      // if (!response.ok) {
      //   throw new Error('Falha ao conectar ao servidor');
      // }
      // const result = await response.json();
      // if (result === 1) {
      //   // Armazenar o token na sessão
      //   sessionStorage.setItem('mensagem', result.mensagem);      
      //   setErrorMessage('Menu não existe');
      // } else {
      //   setErrorMessage('Problemas para encontrar este usuário');
      // }
    } catch (error) {
      setErrorMessage('Erro ao fazer login, tente novamente mais tarde.');
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Meus Clientes</h2>
        <h6 className="text-center mb-4">Entre com suas credenciais</h6>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuário:</label>
            <input
              type="text"
              className="form-control"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha:</label>
            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Entrar</button>
          {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
