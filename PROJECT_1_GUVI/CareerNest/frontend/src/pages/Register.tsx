import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useDispatch } from "react-redux";
import { setAuth } from "../store";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", role:"JOB_SEEKER" });
  const [error, setError] = useState("");
  const dispatch = useDispatch(); const navigate = useNavigate();
  const set = (key: string, value: string) => setForm(f => ({...f, [key]:value}));

  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      const data = await api.register(form);
      dispatch(setAuth({user:data, token:data.token}));
      navigate("/jobs");
    } catch(err) { setError(err instanceof Error ? err.message : "Registration failed"); }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-5 py-10">
      <form onSubmit={submit} className="card w-full max-w-lg p-8">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 mb-7 text-slate-500">Choose how you want to use CareerNest.</p>
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">Full name<input className="input mt-1.5" value={form.name} onChange={e=>set("name",e.target.value)} required /></label>
          <label className="text-sm font-semibold">Email<input className="input mt-1.5" type="email" value={form.email} onChange={e=>set("email",e.target.value)} required /></label>
          <label className="text-sm font-semibold">Phone<input className="input mt-1.5" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91..." required /></label>
          <label className="text-sm font-semibold sm:col-span-2">Password<input className="input mt-1.5" type="password" minLength={6} value={form.password} onChange={e=>set("password",e.target.value)} required /></label>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={()=>set("role","JOB_SEEKER")} className={`rounded-xl border p-4 text-left ${form.role==="JOB_SEEKER"?"border-indigo-500 bg-indigo-50":"border-slate-200"}`}>
            <b>Job Seeker</b><p className="mt-1 text-xs text-slate-500">Find and apply for jobs</p>
          </button>
          <button type="button" onClick={()=>set("role","EMPLOYER")} className={`rounded-xl border p-4 text-left ${form.role==="EMPLOYER"?"border-indigo-500 bg-indigo-50":"border-slate-200"}`}>
            <b>Employer</b><p className="mt-1 text-xs text-slate-500">Post and manage jobs</p>
          </button>
        </div>
        <button className="btn-primary mt-6 w-full">Create account</button>
        <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-indigo-600" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
