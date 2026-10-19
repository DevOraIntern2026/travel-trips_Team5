import Sidebar from './Sidebar';
import Topbar from './Topbar';
export default function OperatorLayout({ crumbs, children }) {
    const logout = () => { localStorage.removeItem('access_token'); window.location.assign('/login'); };
    return (<div className="flex min-h-screen bg-surface">
      <Sidebar onLogout={logout}/>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar crumbs={crumbs}/>
        <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-6">{children}</main>
      </div>
    </div>);
}
