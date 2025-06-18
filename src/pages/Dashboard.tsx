import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'

export default function Dashboard() {
    return (
        <div className='w-full h-full grid justify-center' style={{ gridTemplateColumns: "250px 1fr" }}>
            <Sidebar />

        </div>
    )
}
