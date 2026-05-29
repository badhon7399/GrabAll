import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../../types';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

interface UsersTabProps {
  triggerToast: (msg: string) => void;
}

type RoleFilterType = 'ALL' | 'SUPER_ADMIN' | 'ADMIN' | 'DEMO_ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

const ROLES = [
  { id: 'customer', label: 'Customer', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  { id: 'staff', label: 'Staff', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  { id: 'manager', label: 'Manager', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'demo_admin', label: 'Demo Admin', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'admin', label: 'Admin', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'super_admin', label: 'Super Admin', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
] as const;

export default function UsersTab({ triggerToast }: UsersTabProps) {
  const { user: currentUser, fetchWithAuth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>('ALL');
  
  // Dialog controls
  const [confirmTarget, setConfirmTarget] = useState<{ type: 'role' | 'delete'; targetUser: User } | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('customer');
  const [actionPending, setActionPending] = useState(false);

  const fetchUsers = async () => {
    if (!currentUser?.token) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        triggerToast('Failed to fetch users.');
      }
    } catch (error) {
      console.error('[UsersTab] Fetch users error:', error);
      triggerToast('Network error loading users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser, fetchWithAuth]);

  // Set default selected role when opening role dialog
  useEffect(() => {
    if (confirmTarget && confirmTarget.type === 'role') {
      setSelectedRole(confirmTarget.targetUser.role || 'customer');
    }
  }, [confirmTarget]);

  // Handle Update User Role
  const handleUpdateRole = async (targetUser: User, targetRole: string) => {
    if (!currentUser?.token) return;
    setActionPending(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/users/${targetUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ role: targetRole }),
      });

      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => (u._id === targetUser._id ? updated : u)));
        triggerToast(`Role updated to ${targetRole.replace('_', ' ').toUpperCase()} for ${targetUser.name}.`);
      } else {
        const err = await res.json();
        triggerToast(err.message || 'Failed to update user role.');
      }
    } catch (error) {
      console.error('[UsersTab] Update role error:', error);
      triggerToast('Network error updating user role.');
    } finally {
      setActionPending(false);
      setConfirmTarget(null);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (targetUser: User) => {
    if (!currentUser?.token) return;
    setActionPending(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/users/${targetUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
        triggerToast(`User account deleted for ${targetUser.name}.`);
      } else {
        const err = await res.json();
        triggerToast(err.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('[UsersTab] Delete user error:', error);
      triggerToast('Network error deleting user.');
    } finally {
      setActionPending(false);
      setConfirmTarget(null);
    }
  };

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchRole =
        roleFilter === 'ALL' ||
        (roleFilter === 'SUPER_ADMIN' && u.role === 'super_admin') ||
        (roleFilter === 'ADMIN' && u.role === 'admin') ||
        (roleFilter === 'DEMO_ADMIN' && u.role === 'demo_admin') ||
        (roleFilter === 'MANAGER' && u.role === 'manager') ||
        (roleFilter === 'STAFF' && u.role === 'staff') ||
        (roleFilter === 'CUSTOMER' && (u.role === 'customer' || !u.role));
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const getRoleStyle = (role: string) => {
    const matched = ROLES.find((r) => r.id === role);
    return matched ? matched.color : 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-7 pb-8 px-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <p className="text-[10px] font-mono text-[#0088FF] tracking-[0.3em] uppercase mb-1">User Directory</p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088FF] to-[#3B82F6]">Management</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-mono">Manage accounts · assign administrative roles · audit user credentials</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Accounts', value: `${users.length} Users`, icon: 'groups', color: '#0088FF' },
          { label: 'Administrators', value: `${users.filter((u) => u.role === 'admin' || u.role === 'super_admin' || u.role === 'demo_admin').length} Admins`, icon: 'shield_person', color: '#10B981' },
          { label: 'Managers & Staff', value: `${users.filter((u) => u.role === 'manager' || u.role === 'staff').length} Team`, icon: 'support_agent', color: '#0088FF' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 flex items-center gap-3"
            style={{ boxShadow: `0 0 20px ${s.color}08` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              <span className="material-symbols-outlined text-base" style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-sm font-black text-white truncate">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined text-slate-500 text-base absolute left-3.5 top-1/2 -translate-y-1/2">search</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono placeholder-slate-600 focus:border-[#0088FF]/40 focus:bg-slate-800 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-1 bg-slate-800/60 rounded-xl p-1">
            {([
              { id: 'ALL', label: 'All' },
              { id: 'SUPER_ADMIN', label: 'Super Admin' },
              { id: 'ADMIN', label: 'Admin' },
              { id: 'DEMO_ADMIN', label: 'Demo Admin' },
              { id: 'MANAGER', label: 'Manager' },
              { id: 'STAFF', label: 'Staff' },
              { id: 'CUSTOMER', label: 'Customer' },
            ] as const).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setRoleFilter(filter.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all uppercase flex items-center gap-1 ${roleFilter === filter.id
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-[#0088FF] animate-spin" />
            <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Fetching user records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 text-[9px] font-bold text-slate-500 font-mono tracking-[0.15em] uppercase">
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.02 }}
                      className="text-xs border-b border-slate-800/60 font-mono hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0088FF]/10 border border-[#0088FF]/20 flex items-center justify-center text-[#0088FF] font-black text-xs uppercase">
                            {u.name.slice(0, 2)}
                          </div>
                          <span className="text-slate-200 font-bold">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {u.email}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono text-[9px] font-bold border capitalize ${getRoleStyle(u.role || 'customer')}`}>
                          <span className="material-symbols-outlined text-[10px]">
                            {u.role === 'super_admin' || u.role === 'admin' || u.role === 'demo_admin' ? 'shield' : 'person'}
                          </span>
                          {(u.role || 'customer').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-BD') : '—'}
                      </td>
                      <td className="py-4 px-5 text-right flex justify-end gap-2">
                        {/* Role Change Action Button */}
                        <button
                          onClick={() => setConfirmTarget({ type: 'role', targetUser: u })}
                          disabled={currentUser?._id === u._id}
                          title={currentUser?._id === u._id ? "You cannot modify your own role" : "Modify User Role"}
                          className={`inline-flex items-center justify-center p-1.5 rounded-lg border transition-all ${
                            currentUser?._id === u._id
                              ? 'opacity-30 cursor-not-allowed bg-transparent border-slate-800 text-slate-600'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-[#0088FF]/40 text-slate-300 hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            manage_accounts
                          </span>
                        </button>
                        
                        {/* Delete Action Button */}
                        <button
                          onClick={() => setConfirmTarget({ type: 'delete', targetUser: u })}
                          disabled={currentUser?._id === u._id}
                          title={currentUser?._id === u._id ? "You cannot delete yourself" : "Delete User Account"}
                          className={`inline-flex items-center justify-center p-1.5 rounded-lg border transition-all ${
                            currentUser?._id === u._id
                              ? 'opacity-30 cursor-not-allowed bg-transparent border-slate-800 text-slate-600'
                              : 'bg-red-500/10 hover:bg-red-500/20 border-red-950/20 hover:border-red-500/40 text-red-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-2xl">person_search</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 font-mono">No users found</p>
                        <p className="text-xs text-slate-700 font-mono">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Confirmation & Role Assignment Dialog */}
      <AnimatePresence>
        {confirmTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => !actionPending && setConfirmTarget(null)} />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-96 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                  confirmTarget.type === 'delete'
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {confirmTarget.type === 'delete' ? 'warning' : 'manage_accounts'}
                  </span>
                </div>
                
                <div className="w-full">
                  <h4 className="font-black text-white text-sm font-mono uppercase tracking-wide">
                    {confirmTarget.type === 'delete' ? 'Delete User Account?' : 'Modify Role Assignment'}
                  </h4>
                  <p className="text-slate-500 text-xs mt-1.5 font-mono leading-relaxed">
                    {confirmTarget.type === 'delete'
                      ? `Are you sure you want to permanently delete the account for ${confirmTarget.targetUser.name}? This will erase their user profile completely.`
                      : `Assign a new administrative or customer role to ${confirmTarget.targetUser.name}:`
                    }
                  </p>
                </div>

                {/* Role selection selectors */}
                {confirmTarget.type === 'role' && (
                  <div className="w-full space-y-2 mt-2">
                    {ROLES.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                          selectedRole === role.id
                            ? 'bg-slate-800 border-[#0088FF]/40 text-white'
                            : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                        }`}
                      >
                        <span className="capitalize">{role.label}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedRole === role.id ? 'border-[#0088FF] bg-[#0088FF]/10' : 'border-slate-600'
                        }`}>
                          {selectedRole === role.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0088FF]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 w-full mt-4">
                  <button
                    disabled={actionPending}
                    onClick={() => setConfirmTarget(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold font-mono hover:bg-slate-750 transition-colors disabled:opacity-55"
                  >
                    CANCEL
                  </button>
                  <button
                    disabled={actionPending}
                    onClick={() => {
                      if (confirmTarget.type === 'delete') {
                        handleDeleteUser(confirmTarget.targetUser);
                      } else {
                        handleUpdateRole(confirmTarget.targetUser, selectedRole);
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono transition-colors disabled:opacity-55 flex items-center justify-center gap-1.5 ${
                      confirmTarget.type === 'delete'
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                        : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30'
                    }`}
                  >
                    {actionPending && <div className="w-3.5 h-3.5 rounded-full border border-slate-800 border-t-current animate-spin" />}
                    CONFIRM
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
