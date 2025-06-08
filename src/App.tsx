import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'

const App: React.FC = () => {
  return (
    <div className='w-full h-full grid justify-center' style={{ gridTemplateColumns: "250px 1fr" }}>
      <Sidebar />

      <Outlet />
    </div>
  )
}

export default App
