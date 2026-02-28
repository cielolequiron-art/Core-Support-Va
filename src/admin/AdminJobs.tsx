import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  Briefcase, 
  DollarSign,
  MapPin,
  ExternalLink,
  Flag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Job, UserData, JobStatus } from '../types';

export const AdminJobs = ({ admin }: { admin: UserData }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'ALL'>('PENDING');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    let query = supabase.from('jobs').select('*');
    
    if (statusFilter !== 'ALL') query = query.eq('status', statusFilter);

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (data) setJobs(data as Job[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleStatusUpdate = async (jobId: string, newStatus: JobStatus, reason?: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: newStatus,
        rejection_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (!error) {
      await supabase.from('admin_logs').insert({
        admin_id: admin.id,
        action: `JOB_STATUS_UPDATE_${newStatus}`,
        target_type: 'JOB',
        target_id: jobId,
        details: { reason }
      });
      setSelectedJob(null);
      setRejectionReason('');
      fetchJobs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Job Moderation</h2>
          <p className="text-sm text-zinc-500">Review and approve job postings from employers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {(['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED', 'ALL'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                  statusFilter === status 
                    ? "bg-white text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 animate-pulse h-48"></div>
          ))
        ) : jobs.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-zinc-200 text-center">
            <Briefcase className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No jobs found</h3>
            <p className="text-zinc-500">All caught up! No jobs matching this status.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      job.status === 'PENDING' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                      job.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      "bg-red-50 text-red-600 border border-red-100"
                    )}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                      <Clock className="w-4 h-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                      <DollarSign className="w-4 h-4" />
                      {job.salary_range}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                      <MapPin className="w-4 h-4" />
                      {job.category}
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2 mb-6">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-zinc-50 text-zinc-500 rounded-lg text-[10px] font-bold uppercase border border-zinc-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-end">
                  {job.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(job.id, 'APPROVED')}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {job.status === 'APPROVED' && (
                    <button 
                      onClick={() => handleStatusUpdate(job.id, 'FLAGGED')}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl text-sm font-bold hover:bg-amber-100 transition-all"
                    >
                      <Flag className="w-4 h-4" /> Flag Job
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 text-zinc-600 rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-all">
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Reject Job Posting</h3>
            <p className="text-sm text-zinc-500 mb-6">Provide a reason for rejection. This will be shared with the employer.</p>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Missing salary information, inappropriate content..."
              className="w-full h-32 p-4 border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-500 mb-6"
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedJob(null)}
                className="flex-1 py-3 text-zinc-500 font-bold hover:bg-zinc-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedJob.id, 'REJECTED', rejectionReason)}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
