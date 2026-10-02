import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useDispatch } from "react-redux";
import { setAuth } from "../store";
import { BriefcaseBusiness } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      const data = await api.login({ email, password });
      dispatch(setAuth({ user: data, token: data.token }));
      navigate("/jobs");
    } catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-5 py-12">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <div className="mb-7">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-indigo-600"><BriefcaseBusiness/></div>
          <h1 className="text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-slate-500">Sign in to continue to CareerNest.</p>
        </div>
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <label className="mb-4 block text-sm font-semibold">Email<input className="input mt-1.5" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label className="mb-6 block text-sm font-semibold">Password<input className="input mt-1.5" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button className="btn-primary w-full">Login</button>
        <p className="mt-5 text-center text-sm text-slate-500">New here? <Link className="font-bold text-indigo-600" to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
