import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  Ban, 
  Unlock, 
  Trash2, 
  Eye, 
  Download,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserData, UserRole, UserStatus } from '../types';

export const AdminUsers = ({ admin, filterRole }: { admin: UserData, filterRole?: UserRole }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>(filterRole || 'ALL');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase.from('profiles').select('*');
    
    if (roleFilter !== 'ALL') query = query.eq('role', roleFilter);
    if (statusFilter !== 'ALL') query = query.eq('status', statusFilter);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (data) setUsers(data as UserData[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search]);

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);

    if (!error) {
      // Log action
      await supabase.from('admin_logs').insert({
        admin_id: admin.id,
        action: `USER_STATUS_UPDATE_${newStatus}`,
        target_type: 'USER',
        target_id: userId,
        details: { previous_status: users.find(u => u.id === userId)?.status, new_status: newStatus }
      });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYER">Employer</option>
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="MODERATOR">Moderator</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
            <option value="PENDING">Pending</option>
          </select>
          <button className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-zinc-100 transition-colors">
            <Download className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <th className="px-8 py-5">User Details</th>
                <th className="px-8 py-5">Role & Status</th>
                <th className="px-8 py-5">Subscription</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6 h-20 bg-zinc-50/50"></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-500 font-medium">No users found matching your filters.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center font-bold text-zinc-600 border border-zinc-200">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit",
                          user.role === 'ADMIN' ? "bg-purple-50 text-purple-600 border border-purple-100" :
                          user.role === 'EMPLOYER' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        )}>
                          {user.role}
                        </span>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit",
                          user.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          user.status === 'SUSPENDED' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-red-50 text-red-600 border border-red-100"
                        )}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          user.subscription_status === 'active' ? "bg-emerald-500" : "bg-zinc-300"
                        )}></div>
                        <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest">
                          {user.subscription_status || 'NONE'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-zinc-900">{new Date(user.created_at).toLocaleDateString()}</div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Joined</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-zinc-400 hover:text-indigo-600 border border-transparent hover:border-zinc-200"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <div className="relative group/menu">
                          <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                            {user.status === 'ACTIVE' ? (
                              <button 
                                onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                                className="w-full px-4 py-2 text-left text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                              >
                                <Ban className="w-4 h-4" /> Suspend Account
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                className="w-full px-4 py-2 text-left text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                              >
                                <Unlock className="w-4 h-4" /> Activate Account
                              </button>
                            )}
                            <button className="w-full px-4 py-2 text-left text-sm font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> Verify Employer
                            </button>
                            <div className="h-px bg-zinc-100 my-2"></div>
                            <button className="w-full px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 className="w-4 h-4" /> Delete User
                            </button>
                          </div>
                        </div>
                      </div>
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
