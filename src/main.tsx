import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar.tsx';
import App from './App.tsx';
import Procedures from './pages/Procedures.tsx';
import Clients from './pages/Clients.tsx';
import Products from './pages/Products.tsx';
import Suppliers from './pages/Suppliers.tsx';
import Professionals from './pages/Professionals.tsx';
import Billing from './pages/Billing.tsx';
import Login from './pages/Login.tsx';

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
        path: '/procedures',
        element: <Procedures />,
      },
      {
        path: '/clients',
        element: <Clients />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/suppliers',
        element: <Suppliers />
      },
      {
        path: '/professionals',
        element: <Professionals />
      },
      {
        path: '/billing',
        element: <Billing />
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
