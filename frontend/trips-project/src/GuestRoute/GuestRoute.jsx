import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../Context/AppContext"


export default function GuestRoute() {
const {isLoggedIn}=useAppContext();
console.log(isLoggedIn)    
return isLoggedIn? (
        <Navigate to="/dashboard" replace/>
    ):(
        <Outlet/>
    )
}
