import React from 'react';
import SidebarLink from './SidebarLink';
import './styles.css'


const Sidebar: React.FC = () => {
    const userRole = localStorage.getItem('cargo') || 'Usuário';
    return (
        <ul className='w-full h-full text-left flex flex-col gap-y-6 px-5 justify-center items-start self-start text-2xl sidebar'>
            <li className='font-bold text-4xl text-blue-500 title'>Supermecado</li>

            <SidebarLink to={'/dashboard'} text={'Dashboard'}></SidebarLink>
            <SidebarLink to={'/funcionarios'} text={'Funcionários'}></SidebarLink>
            <SidebarLink to={'/clientes'} text={'Clientes'}></SidebarLink>
            <SidebarLink to={'/produtos'} text={'Produtos'}></SidebarLink>
            <li className='text-sm flex justify-center align-middle w-full select-none'>{userRole}</li>
        </ul>

    );
};

export default Sidebar;