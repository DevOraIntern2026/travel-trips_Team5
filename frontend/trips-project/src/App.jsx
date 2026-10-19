import { RouterProvider } from "react-router-dom"
import { router } from "./Routing/AppRouting";

function App() {
  // #region agent log
  fetch('http://127.0.0.1:7940/ingest/438fa240-d876-4130-8fe5-cb8f36bf1e89',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'377b2a'},body:JSON.stringify({sessionId:'377b2a',runId:'pre-fix',hypothesisId:'C',location:'App.jsx:boot',message:'App rendered',data:{href:typeof window!=='undefined'?window.location.pathname:null},timestamp:Date.now()})}).catch(()=>{});
  const probe = [
    '/src/services/bookings.js','/src/services/profile.js',
    '/src/Pages/services/bokkings.js','/src/Pages/services/profile.js',
    '/src/Pages/Booking/components/BookingsTable.jsx','/src/Pages/Booking/components/BookingTable.jsx',
    '/src/Pages/Profile/components/SyncBanner.jsx','/src/Pages/Profile/components/SynBanner.jsx',
    '/src/Pages/Profile/components/PersonalInfoForm.jsx','/src/Pages/Profile/components/PersonallfoForm.jsx',
    '/src/layout/OperatorLayout.jsx','/src/Layout/OperatorLayout.jsx','/src/Layout/Sidebar.jsx',
  ];
  Promise.all(probe.map((p)=>fetch(p).then((r)=>({p,ok:r.ok,status:r.status})).catch((e)=>({p,ok:false,error:String(e)})))).then((rows)=>{
    fetch('http://127.0.0.1:7940/ingest/438fa240-d876-4130-8fe5-cb8f36bf1e89',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'377b2a'},body:JSON.stringify({sessionId:'377b2a',runId:'pre-fix',hypothesisId:'A,B,D,E',location:'App.jsx:probe',message:'Vite source path probe',data:{rows},timestamp:Date.now()})}).catch(()=>{});
  });
  // #endregion

  return (
<>

  <RouterProvider router={router}></RouterProvider>
</>
  )
}

export default App
