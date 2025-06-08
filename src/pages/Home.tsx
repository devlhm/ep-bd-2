import React from 'react';
import logo from '../assets/logo.svg'

const Home: React.FC = () => {
    return (
        <div className='flex items-center justify-self-end'>
            <img src={logo} className='h-3/4' />
        </div>
    );
};

export default Home;