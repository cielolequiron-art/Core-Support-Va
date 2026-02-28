import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  Flag,
  MessageSquare,
  ShieldAlert,
  Trash2,
  Ban,
  Settings,
  Globe,
  Mail,
  Bell,
  Lock,
  Activity,
  User,
  History,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Report, AdminLog, UserData } from '../types';

export const AdminReports = ({ admin }: { admin: UserData }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (data) setReports(data as Report[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Moderation System</h2>
          <p className="text-sm text-zinc-500">Handle reported users, job listings, and abuse complaints.</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          {['PENDING', 'RESOLVED', 'ALL'].map((tab) => (
            <button key={tab} className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest">
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 animate-pulse h-32"></div>)
        ) : reports.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-zinc-200 text-center">
            <ShieldAlert className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No reports to review</h3>
            <p className="text-zinc-500">Great job! The platform is clean.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{report.target_type} REPORT</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest">• {new Date(report.created_at).toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-1">Reason: {report.reason}</h4>
                  <p className="text-xs text-zinc-500">Target ID: <span className="font-mono">{report.target_id}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-zinc-50 text-zinc-600 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-all">Review</button>
                <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all">Resolve</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AdminSettings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" /> Platform Configuration
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Platform Name</label>
              <input type="text" defaultValue="VAHub Marketplace" className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Support Email</label>
              <input type="email" defaultValue="support@vahub.com" className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div>
                <div className="text-sm font-bold text-zinc-900">Maintenance Mode</div>
                <div className="text-xs text-zinc-500">Disable platform access for all users except admins.</div>
              </div>
              <button className="w-12 h-6 bg-zinc-200 rounded-full relative transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" /> Email Templates
          </h3>
          <div className="space-y-4">
            {['Welcome Email', 'Job Approved', 'Subscription Success', 'Password Reset'].map((template) => (
              <div key={template} className="p-4 border border-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer">
                <span className="text-sm font-bold text-zinc-700">{template}</span>
                <Settings className="w-4 h-4 text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
          <ShieldAlert className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Security Audit</h3>
          <p className="text-indigo-100 text-sm mb-6">Review critical security events and platform access logs.</p>
          <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all">Run Security Check</button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">Admin Roles</h3>
          <div className="space-y-4">
            {[
              { role: 'Super Admin', count: 2 },
              { role: 'Moderator', count: 4 },
              { role: 'Support', count: 6 },
            ].map((role) => (
              <div key={role.role} className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">{role.role}</span>
                <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-lg">{role.count}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-sm font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
            Manage Roles
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) setLogs(data as AdminLog[]);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-zinc-900">Platform Audit Logs</h3>
        <History className="w-5 h-5 text-zinc-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Admin</th>
              <th className="px-8 py-5">Action</th>
              <th className="px-8 py-5">Target</th>
              <th className="px-8 py-5">Timestamp</th>
              <th className="px-8 py-5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16 bg-zinc-50/50"></tr>)
            ) : logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center font-bold text-zinc-600 text-xs">A</div>
                    <span className="text-sm font-bold text-zinc-900">Admin ID: {log.admin_id?.slice(0, 8)}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold uppercase tracking-wider">{log.action}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="text-xs font-bold text-zinc-700 uppercase tracking-widest">{log.target_type}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{log.target_id}</div>
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-zinc-400 hover:text-indigo-600 border border-transparent hover:border-zinc-200">
                    <Info className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
