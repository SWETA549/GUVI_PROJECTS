import { useEffect, useState } from "react";
import { api } from "../api";
import type { JobApplication } from "../types";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const statusClass: Record<string,string> = {
  APPLIED:"bg-blue-50 text-blue-700", REVIEWING:"bg-amber-50 text-amber-700",
  SHORTLISTED:"bg-emerald-50 text-emerald-700", REJECTED:"bg-red-50 text-red-700", HIRED:"bg-indigo-50 text-indigo-700"
};

export default function SeekerDashboard() {
  const [apps,setApps]=useState<JobApplication[]>([]); const [error,setError]=useState("");
  useEffect(()=>{api.myApplications().then(setApps).catch(e=>setError(e.message));},[]);
  return <main className="mx-auto max-w-6xl px-5 py-10">
    <h1 className="text-3xl font-black">My applications</h1><p className="mt-1 text-slate-500">Track every opportunity you've applied for.</p>
    {error && <div className="mt-5 rounded-xl bg-red-50 p-3 text-red-700">{error}</div>}
    <div className="mt-7 space-y-3">
      {apps.length===0 ? <div className="card p-10 text-center"><p className="font-bold">No applications yet</p><p className="mt-1 text-sm text-slate-500">Find a job and submit your first application.</p></div> :
      apps.map(a=><div key={a.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-black">{a.jobTitle}</h2><p className="mt-1 text-sm text-slate-500">Applied {new Date(a.appliedAt).toLocaleDateString()}</p></div>
        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${statusClass[a.status]||"bg-slate-100"}`}>
          {a.status==="REJECTED"?<XCircle size={14}/>:a.status==="HIRED"?<CheckCircle2 size={14}/>:<Clock3 size={14}/>} {a.status}
        </span>
      </div>)}
    </div>
  </main>;
}
