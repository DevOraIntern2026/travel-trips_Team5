import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";

import Login from "../Pages/Login/Login";

import Register from "../Pages/Register/Register";
import MainLayout from "../Layout/MaineLayout";
import NotFound from "../Pages/NotFound/NotFound";
import ExploreExpeditions from "../Pages/Explore/ExploreExpeditions.jsx";
import HowItWorks from "../Pages/HowItWorks/HowItWorks";
import MyBooking from "../Pages/MyBooking";
import ExpeditionDiscovery from "../Pages/expedition/ExpeditionDiscovery.jsx";
import ExpeditionExplore from "../Pages/expeditionExplore/ExpeditionExplore.jsx";

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
    path: "/home/expeditionExplore",
    element: <ExpeditionExplore/>,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "Explore Expeditions",
    element: <ExploreExpeditions/>,
  },
  {
    path: "/How It Works",
    element: <HowItWorks/>,
  },
  {
    path: "/my booking",
    element: <MyBooking/>,
  },
  {
    path:"/login",
    element: <Login/>,
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