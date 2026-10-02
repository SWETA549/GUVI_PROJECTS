import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import type { Job } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { CalendarDays, IndianRupee, MapPin, Building2, CheckCircle2 } from "lucide-react";

export default function JobDetails() {
  const {id} = useParams(); const [job,setJob] = useState<Job|null>(null); const [message,setMessage] = useState("");
  const user = useSelector((s:RootState)=>s.auth.user);
  useEffect(()=>{ if(id) api.job(id).then(setJob).catch(e=>setMessage(e.message)); },[id]);
  if (!job) return <main className="mx-auto max-w-5xl px-5 py-14">{message || "Loading..."}</main>;

  async function apply() {
    try { await api.apply(job.id); setMessage("Application submitted successfully!"); }
    catch(e) { setMessage(e instanceof Error ? e.message : "Could not apply"); }
  }

  return <main className="mx-auto max-w-5xl px-5 py-10">
    <Link to="/jobs" className="text-sm font-bold text-indigo-600">← Back to jobs</Link>
    <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="card p-7">
        <div className="flex items-start gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-xl font-black text-indigo-600">{job.title[0]}</div><div><h1 className="text-3xl font-black">{job.title}</h1><p className="mt-1 text-slate-500">{job.employerName}</p></div></div>
        <div className="my-7 grid gap-3 border-y border-slate-100 py-5 text-sm sm:grid-cols-3">
          <p className="flex gap-2"><MapPin size={18}/>{job.location}</p><p className="flex gap-2"><IndianRupee size={18}/>{job.salary}</p><p className="flex gap-2"><CalendarDays size={18}/>{job.deadline || "Open deadline"}</p>
        </div>
        <h2 className="text-xl font-black">About the role</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{job.description}</p>
      </article>
      <aside className="card h-fit p-6">
        <h3 className="font-black">Ready to apply?</h3><p className="mt-2 text-sm text-slate-500">Submit your application and track updates from your dashboard.</p>
        {user?.role === "JOB_SEEKER" ? <button onClick={apply} className="btn-primary mt-5 w-full">Apply now</button> :
          !user ? <Link to="/login" className="btn-primary mt-5 block text-center">Login to apply</Link> :
          <p className="mt-5 rounded-xl bg-slate-100 p-3 text-sm">Employers cannot apply to jobs.</p>}
        {message && <div className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={18}/>{message}</div>}
      </aside>
    </div>
  </main>;
}
