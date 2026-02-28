import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '../lib/supabase';

const data = [
  { name: 'Mon', users: 400, revenue: 2400 },
  { name: 'Tue', users: 300, revenue: 1398 },
  { name: 'Wed', users: 200, revenue: 9800 },
  { name: 'Thu', users: 278, revenue: 3908 },
  { name: 'Fri', users: 189, revenue: 4800 },
  { name: 'Sat', users: 239, revenue: 3800 },
  { name: 'Sun', users: 349, revenue: 4300 },
];

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    pendingJobs: 0,
    revenue: 12450,
    activeSubs: 156
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: employersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'EMPLOYER');
      const { count: jobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      const { count: pendingJobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');

      setStats(prev => ({
        ...prev,
        totalUsers: usersCount || 0,
        totalEmployers: employersCount || 0,
        totalJobs: jobsCount || 0,
        pendingJobs: pendingJobsCount || 0
      }));
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', trend: '+12%', up: true },
    { label: 'Active Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-teal-600', trend: '+5%', up: true },
    { label: 'Monthly Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', trend: '+18%', up: true },
    { label: 'Pending Approvals', value: stats.pendingJobs, icon: Clock, color: 'text-amber-600', trend: '-2%', up: false },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl bg-zinc-50", card.color)}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                card.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <div className="text-3xl font-black text-zinc-900 tracking-tight">{card.value}</div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">User Growth</h3>
              <p className="text-sm text-zinc-500">Daily registration activity</p>
            </div>
            <button className="p-2 hover:bg-zinc-50 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Revenue Stream</h3>
              <p className="text-sm text-zinc-500">Subscription earnings overview</p>
            </div>
            <button className="p-2 hover:bg-zinc-50 rounded-lg transition-colors">
              <DollarSign className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900">Recent Registrations</h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <div className="divide-y divide-zinc-100">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-600">J</div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">John Doe</div>
                    <div className="text-xs text-zinc-500">john@example.com</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-zinc-900">EMPLOYER</div>
                  <div className="text-[10px] text-zinc-400 uppercase">2 mins ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900">Moderation Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Reported Job</span>
                </div>
                <p className="text-xs text-amber-800 font-medium mb-2">Job listing "Senior React Dev" has been flagged for spam by 3 users.</p>
                <button className="text-[10px] font-bold text-amber-600 uppercase tracking-widest hover:underline">Review Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for tailwind classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
