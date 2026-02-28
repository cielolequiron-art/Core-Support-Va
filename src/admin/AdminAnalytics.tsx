import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

const data = [
  { name: 'Jan', jobs: 400, apps: 2400, revenue: 2400 },
  { name: 'Feb', jobs: 300, apps: 1398, revenue: 2210 },
  { name: 'Mar', jobs: 200, apps: 9800, revenue: 2290 },
  { name: 'Apr', jobs: 278, apps: 3908, revenue: 2000 },
  { name: 'May', jobs: 189, apps: 4800, revenue: 2181 },
  { name: 'Jun', jobs: 239, apps: 3800, revenue: 2500 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export const AdminAnalytics = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Platform Analytics</h2>
          <p className="text-sm text-zinc-500 font-medium">Deep dive into platform growth and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-indigo-600', trend: '+0.4%', up: true },
          { label: 'Avg. Apps per Job', value: '18.5', icon: Activity, color: 'text-emerald-600', trend: '+2.1%', up: true },
          { label: 'Employer Retention', value: '84%', icon: Users, color: 'text-blue-600', trend: '-1.2%', up: false },
          { label: 'Avg. Revenue/User', value: '$42.50', icon: DollarSign, color: 'text-amber-600', trend: '+5.4%', up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl bg-zinc-50", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trend}
              </div>
            </div>
            <div className="text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-zinc-900">Job Posting vs Applications</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                <span className="text-xs font-bold text-zinc-500">Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-bold text-zinc-500">Apps</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="jobs" stroke="#4f46e5" strokeWidth={3} fillOpacity={0.1} fill="#4f46e5" />
                <Area type="monotone" dataKey="apps" stroke="#10b981" strokeWidth={3} fillOpacity={0.1} fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-8">User Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Employers', value: 400 },
                    { name: 'Job Seekers', value: 300 },
                    { name: 'Admins', value: 50 },
                    { name: 'Support', value: 100 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
            {[
              { label: 'Employers', value: '40%', color: 'bg-indigo-600' },
              { label: 'Job Seekers', value: '30%', color: 'bg-emerald-500' },
              { label: 'Admins', value: '5%', color: 'bg-amber-500' },
              { label: 'Support', value: '10%', color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                  <span className="text-xs font-bold text-zinc-600">{item.label}</span>
                </div>
                <span className="text-xs font-black text-zinc-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
