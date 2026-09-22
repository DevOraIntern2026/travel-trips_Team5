import { RouterProvider } from "react-router-dom"
import { router } from "./assets/Routing/AppRouting"


function App() {


  return (
<>
  <RouterProvider router={router}></RouterProvider>
</>
  )
}

export default App
