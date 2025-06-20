import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
    to: string;
    text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, text }) => {
    const { pathname } = useLocation();
    const isActive = pathname === to;

    return (
        <li className="w-full">
            <Link
                to={to}
                className={
                    `block w-full px-4 py-2 rounded-md transition hover:bg-blue-700 hover:scale-105 text-white ${isActive ? 'active' : ''
                    }`
                }
            >
                {text}
            </Link>
        </li>
    );
};

export default SidebarLink;
