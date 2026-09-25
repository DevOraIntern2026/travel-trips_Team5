
import { Outlet } from 'react-router-dom'
import Navbar from '../Component/Navbar/Navbar'
import Footer from "../Component/Footer/Footer"
export default function MainLayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}
