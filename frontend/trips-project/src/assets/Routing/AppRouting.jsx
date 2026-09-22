import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import Trips from "../Pages/Trips";
import Login from "../Pages/Login";
import NotFound from "../Pages/NotFound";

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
    path: "/tripx",
    element: <Trips/>,
  },
  {
    path:"/login",
    element: <Login/>,
  },
  {
    path: "/*",
    element: <NotFound/>,
  },
  ],
 },
]);