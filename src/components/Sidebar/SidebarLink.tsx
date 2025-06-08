import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
    to: string;
    text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = (props: SidebarLinkProps) => {
    const { pathname } = useLocation();

    return (
        <li className={(pathname == props.to ? "selected" : "") + " hover:scale-105 transition"}>
            <Link to={props.to}>
                {props.text}
            </Link>
        </li>
    );
};

export default SidebarLink;