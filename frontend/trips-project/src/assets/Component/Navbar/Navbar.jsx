import { Link, NavLink } from "react-router-dom";


export default function Navbar() {
const links = [
     {
       
        body: "Home",
        path: "/",
      },
      {
        
        body: "About",
        path: "/about",
      },
      {
        
        body: "trips",
        path: "/Trips",
      },
      {
        
        body: "Contact",
        path: "contact",
      },
  ]



  return (
     <nav >

  <div >
    <Link to={"/"}>Travel-Trips</Link>

    <div >
      <ul >
        {links.map((link, index) => {
          return (
           <li
           key={index}>
          <NavLink

          
             to={link.path}>
            {link.body}
            </NavLink>
            </li>

          );
        }
      )}
  
      </ul>
    </div>
  </div>
</nav>
  )
}
