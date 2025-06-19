import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const isLoginPage = location.pathname === '/';

    if (!token && !isLoginPage) {
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
