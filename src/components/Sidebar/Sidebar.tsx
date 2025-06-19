import React from 'react';
import SidebarLink from './SidebarLink';
import './styles.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token ? token : '') as { [key: string]: any };
    const userRole =
        decodedToken['[http://schemas.microsoft.com/ws/2008/06/identity/claims/role]'] ||
        decodedToken['role'] ||
        'Usuário';

    const isGerente = userRole.toLowerCase() === 'gerente';
    const isCaixa = userRole.toLowerCase() === 'caixa';
    const isRepositor = userRole.toLowerCase() === 'repositor';

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cargo');
        navigate('/'); // Redireciona para a tela de login
    };


    return (
        <ul className="w-full h-full text-left flex flex-col gap-y-6 px-5 justify-center items-start self-start text-2xl sidebar">
            <li className="font-bold text-4xl text-blue-500 title">Supermecado</li>

            {/* Telas do Gerente */}
            {isGerente && (
                <>
                    <SidebarLink to="/dashboard" text="Dashboard" />
                    <SidebarLink to="/funcionarios" text="Funcionários" />
                    <SidebarLink to="/clientes" text="Clientes" />
                    <SidebarLink to="/produtos" text="Produtos" />
                </>
            )}

            {/* Telas do Caixa */}
            {isCaixa && (
                <>
                    <SidebarLink to="/pdv" text="Ponto de Venda" />
                    <SidebarLink to="/cadastro-cliente" text="Cliente" />
                </>
            )}

            {/* Telas do Repositor */}
            {isRepositor && (
                <>
                    <SidebarLink to="/produtos" text="Produtos" />
                </>
            )}
            <li
                onClick={handleLogout}
                className='cursor-pointer text-red-500 text-base hover:underline mt-2'
            >
                Sair
            </li>

            <li className="text-sm flex justify-center align-middle w-full select-none">{userRole}</li>
        </ul>
    );
};

export default Sidebar;
