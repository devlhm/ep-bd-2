import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../hooks/api';
import { jwtDecode } from 'jwt-decode';
import olhoAberto from '../assets/olho_aberto.png';
import olhoFechado from '../assets/olho_fechado.png';
import logo from '../assets/supermecado_logo.png';

const App: React.FC = () => {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();


    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    const handleLogin = () => {
        try {
            Api.login(cpf, senha)

            const token = localStorage.getItem('authToken');
            const decodedToken = jwtDecode(token ? token : '') as { [key: string]: any };
            const userRole =
                decodedToken['[http://schemas.microsoft.com/ws/2008/06/identity/claims/role]'] ||
                decodedToken['role'] ||
                'Usuário';

            // Define as rotas baseadas no cargo do usuário
            const roleRoutes: { [key: string]: string } = {
                gerente: '/clientes',
                caixa: '/produtos',
                repositor: '/produtos',
            };

            const route = roleRoutes[userRole.toLowerCase()];
            if (route) {
                navigate(route);
            }

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
        }
    };

    useEffect(() => {
        // Verifica se o usuário já está logado
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/clientes');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen min-w-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
                <div className="text-center mb-6 flex flex-col items-center">
                    <img
                        src={logo}
                        alt={"Logo do Supermercado"}
                        className="w-52 h-52"
                    />
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
                        <img
                            src={mostrarSenha ? olhoAberto : olhoFechado}
                            alt={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            className="w-5 h-5"
                        />
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
