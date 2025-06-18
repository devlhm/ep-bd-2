import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'

const App: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
};
export default App