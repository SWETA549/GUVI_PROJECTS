import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Job } from "../types";
import { MapPin, Search, CalendarDays, IndianRupee, ArrowRight } from "lucide-react";

export default function Jobs() {
  const [jobs,setJobs] = useState<Job[]>([]);
  const [keyword,setKeyword] = useState(""); const [location,setLocation] = useState("");
  const [loading,setLoading] = useState(true); const [error,setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setJobs(await api.jobs(keyword, location)); }
    catch(e) { setError(e instanceof Error ? e.message : "Could not load jobs"); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ load(); }, []);

  return (
    <main>
      <section className="bg-slate-950 px-5 pb-14 pt-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-bold text-indigo-300">CAREERNEST</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Find work that fits your next chapter.</h1>
          <p className="mt-5 max-w-2xl text-slate-300">Browse opportunities, compare details and apply in a few clicks.</p>
          <div className="mt-8 grid gap-3 rounded-2xl bg-white p-3 shadow-2xl md:grid-cols-[1fr_0.7fr_auto]">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400"><Search size={19}/><input className="w-full bg-transparent py-3 text-slate-900 outline-none" placeholder="Job title or keyword" value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/></div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400"><MapPin size={19}/><input className="w-full bg-transparent py-3 text-slate-900 outline-none" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/></div>
            <button onClick={load} className="btn-primary px-7">Search jobs</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex items-end justify-between"><div><h2 className="text-2xl font-black">Latest opportunities</h2><p className="mt-1 text-sm text-slate-500">{jobs.length} jobs available</p></div></div>
        {error && <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}
        {loading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(x=><div key={x} className="card h-56 animate-pulse bg-slate-100" />)}</div> :
          jobs.length === 0 ? <div className="card p-10 text-center"><p className="font-bold">No matching jobs</p><p className="mt-1 text-sm text-slate-500">Try another keyword or location.</p></div> :
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job=><article key={job.id} className="card flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600">{job.title[0]}</div>
              <h3 className="text-xl font-black">{job.title}</h3><p className="mt-1 text-sm text-slate-500">{job.employerName}</p>
              <div className="my-5 space-y-2 text-sm text-slate-600">
                <p className="flex gap-2"><MapPin size={17}/>{job.location}</p><p className="flex gap-2"><IndianRupee size={17}/>{job.salary}</p>
                {job.deadline && <p className="flex gap-2"><CalendarDays size={17}/>Apply by {job.deadline}</p>}
              </div>
              <Link to={`/jobs/${job.id}`} className="mt-auto inline-flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 font-bold hover:bg-indigo-50 hover:text-indigo-700">View details <ArrowRight size={17}/></Link>
            </article>)}
          </div>}
      </section>
    </main>
  );
}
