import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx';
import Clientes from './pages/Clientes.tsx';
import Produtos from './pages/Produtos.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Funcionarios from './pages/Funcionarios.tsx';
import Compras from './pages/Compras.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/clientes',
        element: <Clientes />,
      },
      {
        path: '/produtos',
        element: <Produtos />,
      },
      {
        path: '/funcionarios',
        element: <Funcionarios />
      },
      {
        path: '/compras',
        element: <Compras />
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
