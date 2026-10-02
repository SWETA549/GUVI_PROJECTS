import { FormEvent, useEffect, useState } from "react";
import { api } from "../api";
import type { Job, JobApplication } from "../types";
import { Plus, Trash2, Pencil, Users } from "lucide-react";

const empty={title:"",description:"",location:"",salary:"",deadline:""};

export default function EmployerDashboard() {
  const [jobs,setJobs]=useState<Job[]>([]); const [apps,setApps]=useState<JobApplication[]>([]);
  const [form,setForm]=useState(empty); const [editing,setEditing]=useState<string|null>(null);
  const [showForm,setShowForm]=useState(false); const [message,setMessage]=useState("");
  const load=async()=>{ const [j,a]=await Promise.all([api.jobs(),api.employerApplications()]); setJobs(j); setApps(a); };
  useEffect(()=>{load().catch(e=>setMessage(e.message));},[]);

  async function submit(e:FormEvent){e.preventDefault();try{
    if(editing) await api.updateJob(editing,form); else await api.createJob(form);
    setForm(empty);setEditing(null);setShowForm(false);setMessage("Saved successfully.");await load();
  }catch(e){setMessage(e instanceof Error?e.message:"Could not save");}}
  async function remove(id:string){if(!confirm("Delete this job?"))return;try{await api.deleteJob(id);await load();}catch(e){setMessage(e instanceof Error?e.message:"Delete failed");}}

  return <main className="mx-auto max-w-7xl px-5 py-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-black">Employer dashboard</h1><p className="mt-1 text-slate-500">Create roles and manage incoming applications.</p></div><button onClick={()=>{setForm(empty);setEditing(null);setShowForm(true)}} className="btn-primary inline-flex items-center gap-2"><Plus size={18}/> Post a job</button></div>
    {message&&<div className="mt-5 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">{message}</div>}
    {showForm&&<form onSubmit={submit} className="card mt-6 p-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-black">{editing?"Edit job":"Create job posting"}</h2><button type="button" onClick={()=>setShowForm(false)} className="text-sm font-bold text-slate-500">Cancel</button></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">Title<input className="input mt-1.5" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></label>
        <label className="text-sm font-semibold">Location<input className="input mt-1.5" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required/></label>
        <label className="text-sm font-semibold">Salary<input className="input mt-1.5" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} required/></label>
        <label className="text-sm font-semibold">Deadline<input className="input mt-1.5" type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label>
        <label className="text-sm font-semibold md:col-span-2">Description<textarea className="input mt-1.5 min-h-32" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></label>
      </div>
      <button className="btn-primary mt-5">{editing?"Update job":"Publish job"}</button>
    </form>}

    <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <div><div className="mb-3 flex items-center gap-2"><h2 className="text-xl font-black">Your job postings</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{jobs.length}</span></div>
        <div className="space-y-3">{jobs.map(j=><div className="card p-5" key={j.id}><div className="flex justify-between gap-3"><div><h3 className="font-black">{j.title}</h3><p className="mt-1 text-sm text-slate-500">{j.location} · {j.salary}</p></div><div className="flex gap-1"><button className="rounded-lg p-2 hover:bg-slate-100" onClick={()=>{setForm({title:j.title,description:j.description,location:j.location,salary:j.salary,deadline:j.deadline||""});setEditing(j.id);setShowForm(true)}}><Pencil size={16}/></button><button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={()=>remove(j.id)}><Trash2 size={16}/></button></div></div></div>)}</div>
      </div>
      <div><div className="mb-3 flex items-center gap-2"><Users size={19}/><h2 className="text-xl font-black">Applications</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{apps.length}</span></div>
        <div className="space-y-3">{apps.length===0?<div className="card p-7 text-sm text-slate-500">Applications will appear here when candidates apply.</div>:apps.map(a=><div key={a.id} className="card p-5"><div className="flex justify-between gap-3"><div><h3 className="font-black">{a.seekerName}</h3><p className="text-sm text-slate-500">{a.seekerEmail}</p><p className="mt-2 text-sm font-semibold">{a.jobTitle}</p></div><select className="h-fit rounded-lg border border-slate-200 p-2 text-xs font-bold" value={a.status} onChange={async e=>{await api.updateStatus(a.id,e.target.value);await load()}}><option>APPLIED</option><option>REVIEWING</option><option>SHORTLISTED</option><option>REJECTED</option><option>HIRED</option></select></div></div>)}</div>
      </div>
    </section>
  </main>;
}
