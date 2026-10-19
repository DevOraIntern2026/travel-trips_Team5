import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Login from "../Pages/Login/Login";

import Register from "../Pages/Register/Register";
import MainLayout from "../Layout/MaineLayout";
import NotFound from "../Pages/NotFound/NotFound";
import ExpeditionDiscovery from "../Pages/expedition/ExpeditionDiscovery";
import ExploreExpeditions from "../Pages/expeditionExplore/ExpeditionExplore";
import HowItWorks from "../Pages/HowItWorks/HowItWorks";
import MyBooking from "../Pages/MyBooking";
import Dashboard from "../Pages/Dashboard/Dashboard";
import EditTrip from "../Pages/Dashboard/EditTrips";
import DatesAvailability from "../Pages/Dashboard/DateAvailability";
import GuestRoute from "../GuestRoute/GuestRoute";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import AdminUsers from "../Pages/AdminDashboard/AdminUsers";
import AdminTrips from "../Pages/AdminDashboard/AdminTrips";

const routePaths = ["/", "/home/expedition", "/dashboard", "/admin", "/admin/users", "/admin/trips", "/trips/edit", "/trips/dates", "/about", "/explore-expeditions", "/how-it-works", "/my-booking", "/login", "/register", "/*"];
// #region agent log
fetch('http://127.0.0.1:7940/ingest/438fa240-d876-4130-8fe5-cb8f36bf1e89',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'377b2a'},body:JSON.stringify({sessionId:'377b2a',runId:'pre-fix',hypothesisId:'C',location:'AppRouting.jsx:routes',message:'Registered router paths',data:{routePaths,hasBookings:routePaths.includes('/bookings'),hasProfile:routePaths.includes('/profile')},timestamp:Date.now()})}).catch(()=>{});
// #endregion
export const router = createBrowserRouter([
 {
  element:<MainLayout/>,
children :[
{
path: "/",
element: <Home />,
},
{
path: "/home/expedition",
element: <ExpeditionDiscovery/>,
},
{
path: "/dashboard",
element: <Dashboard/>,
},
{
path: "/admin",
element: <AdminDashboard/>,
},
{
path: "/admin/users",
element: <AdminUsers/>,
},
{
path: "/admin/trips",
element: <AdminTrips/>,
},
{
path: "/trips/edit",
element: <EditTrip/>,
},
{
path: "/trips/dates",
element: <DatesAvailability/>,
},

{
path: "/about",
element: <About />,
},
{
path: "/explore-expeditions",
element: <ExploreExpeditions/>,
},
{
path: "/how-it-works",
element: <HowItWorks/>,
},
{
path: "/my-booking",
element: <MyBooking/>,
},
{
element: <GuestRoute/>,
children:[{
  path:"/login",
  element:<Login/>
}
]
},
{
path:"/register",
element: <Register/>,
},
  {
    path: "/*",
    element: <NotFound/>,
  },
  ],
 },
]);