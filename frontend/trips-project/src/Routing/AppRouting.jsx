import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Trips from "../Pages/Trips/Trips";
import Login from "../Pages/Login/Login";

import Register from "../Pages/Register/Register";
import MainLayout from "../Layout/MaineLayout";
import NotFound from "../Pages/NotFound/NotFound";

export const router = createBrowserRouter([
 {
  element:<MainLayout/>,
  children :[
      {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/trips",
    element: <Trips/>,
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