import { useSelector } from "react-redux";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import type { RootState } from "./store";
import { logout } from "./store";
import { useDispatch } from "react-redux";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Search, UserRoundPlus } from "lucide-react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

function Protected({ children, role }: { children: React.ReactNode; role?: "JOB_SEEKER" | "EMPLOYER" }) {
  const user = useSelector((s: RootState) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/jobs" replace />;
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/jobs" className="flex items-center gap-2.5 text-xl font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><BriefcaseBusiness size={19}/></span>
            Career<span className="text-indigo-600">Nest</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:block" to="/jobs">Find jobs</Link>
            {user ? (
              <>
                <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" to="/dashboard">
                  <span className="inline-flex items-center gap-1.5"><LayoutDashboard size={16}/> Dashboard</span>
                </Link>
                <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Logout" onClick={() => { dispatch(logout()); navigate("/login"); }}>
                  <LogOut size={17}/>
                </button>
              </>
            ) : (
              <>
                <Link className="btn-secondary !px-3 !py-2 text-sm" to="/login">Login</Link>
                <Link className="btn-primary !px-3 !py-2 text-sm" to="/register"><span className="inline-flex gap-1.5"><UserRoundPlus size={16}/> Register</span></Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function App() {
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/login" element={user ? <Navigate to="/jobs" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/jobs" replace /> : <Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/dashboard" element={
          <Protected>{user?.role === "EMPLOYER" ? <EmployerDashboard /> : <SeekerDashboard />}</Protected>
        } />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </Layout>
  );
}
