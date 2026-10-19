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
import Bookings from "../Pages/Booking/Bookings";
import Profile from "../Pages/Profile/Profile";
import Destination from "../Pages/Destination/Destination";

export const router = createBrowserRouter([
  {
    path: "/bookings",
    element: <Bookings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/trips/edit",
    element: <EditTrip />,
  },
  {
    path: "/trips/dates",
    element: <DatesAvailability />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home/expedition",
        element: <ExpeditionDiscovery />,
      },
      {
        path: "/destinations",
        element: <Destination />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/trips",
        element: <AdminTrips />,
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