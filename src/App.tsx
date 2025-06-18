import React, { useState } from 'react';
import { Api } from './hooks/api';

const App: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = () => {
    Api.login(cpf, senha)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img
            src="https://via.placeholder.com/50"
            alt="Logo do Supermercado"
            className="mx-auto mb-2"
          />
          <p className="text-gray-700 font-medium">Logo do Supermercado</p>
        </div>

        <h2 className="text-xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="senha"
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={toggleMostrarSenha}
            className="absolute right-2 top-9 text-gray-500 focus:outline-none"
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default App;
