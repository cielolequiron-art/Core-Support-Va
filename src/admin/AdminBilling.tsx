import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Download,
  ArrowUpRight,
  TrendingUp,
  PieChart,
  Activity,
  User,
  MoreVertical,
  ShieldCheck,
  Zap,
  Star,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Subscription, Payment, UserData } from '../types';

export const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'CANCELED' | 'ALL'>('ACTIVE');

  const fetchSubscriptions = async () => {
    setLoading(true);
    let query = supabase.from('subscriptions').select('*');
    if (activeTab !== 'ALL') query = query.eq('status', activeTab.toLowerCase());
    const { data } = await query.order('created_at', { ascending: false });
    if (data) setSubscriptions(data as Subscription[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [activeTab]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Subscriptions', value: '156', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Monthly Recurring Revenue', value: '$12,450', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Churn Rate', value: '2.4%', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</div>
            </div>
            <div className="text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subscription List */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Active Subscriptions</h3>
            <p className="text-sm text-zinc-500">Manage employer billing and plan statuses.</p>
          </div>
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {(['ACTIVE', 'CANCELED', 'ALL'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === tab 
                    ? "bg-white text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <th className="px-8 py-5">Employer</th>
                <th className="px-8 py-5">Plan Details</th>
                <th className="px-8 py-5">Billing Status</th>
                <th className="px-8 py-5">Next Payment</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse h-20 bg-zinc-50/50"></tr>
                ))
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-500 font-medium">No active subscriptions found.</td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-600">E</div>
                        <div>
                          <div className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">Employer Name</div>
                          <div className="text-xs text-zinc-500">employer@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          sub.plan_name === 'PREMIUM' ? "bg-red-50 text-red-600 border border-red-100" :
                          sub.plan_name === 'PRO' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        )}>
                          {sub.plan_name}
                        </span>
                        <span className="text-xs font-bold text-zinc-900">${sub.price}/mo</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Monthly Billing</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          sub.status === 'active' ? "bg-emerald-500" : "bg-red-500"
                        )}></div>
                        <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest">{sub.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-zinc-900">{new Date(sub.end_date).toLocaleDateString()}</div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Renewal Date</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-zinc-400 hover:text-indigo-600 border border-transparent hover:border-zinc-200">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    if (data) setPayments(data as Payment[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Transaction History</h3>
            <p className="text-sm text-zinc-500">Monitor all platform payments and refunds.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse h-20 bg-zinc-50/50"></tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-medium">No transactions recorded yet.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs text-zinc-500">{payment.transaction_id}</td>
                    <td className="px-8 py-5 font-bold text-zinc-900">${payment.amount} {payment.currency}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        payment.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        payment.status === 'FAILED' ? "bg-red-50 text-red-600 border border-red-100" :
                        "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest">{payment.payment_method}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-zinc-500">
                      {new Date(payment.created_at).toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
