
import { Outlet } from 'react-router-dom'
import Navbar from '../Component/Navbar/Navbar'

export default function MainLayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}
