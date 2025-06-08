import React from 'react';
import SidebarLink from './SidebarLink';

const Sidebar: React.FC = () => {

    return (
        <ul className='w-full h-full text-left flex flex-col gap-y-6 px-5 justify-center items-start self-start text-2xl'>
            <li className='fixed top-10 font-bold text-4xl'>BeautySoft</li>

            <SidebarLink to={'/'} text={'Início'}></SidebarLink>
            <SidebarLink to={'/clients'} text={'Clientes'}></SidebarLink>
            <SidebarLink to={'/procedures'} text={'Procedimentos'}></SidebarLink>
            <SidebarLink to={'/professionals'} text={'Profissionais'}></SidebarLink>
            <SidebarLink to={'/suppliers'} text={'Fornecedores'}></SidebarLink>
            <SidebarLink to={'/products'} text={'Produtos'}></SidebarLink>
            <SidebarLink to={'/billing'} text={'Faturamento'}></SidebarLink>
        </ul>
    );
};

export default Sidebar;