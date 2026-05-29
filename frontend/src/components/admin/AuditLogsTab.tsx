import { useState, useEffect, useCallback } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

interface UserShortInfo {
  name: string;
  email: string;
}

interface AuditLog {
  _id: string;
  action: string;
  targetType: string;
  targetId: string;
  user: UserShortInfo | null;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function AuditLogsTab({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const { user, fetchWithAuth } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async (pageNum: number) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/users/audit-logs?page=${pageNum}&limit=20`);

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setPage(data.page || 1);
        setTotalPages(data.pages || 1);
        setTotalLogs(data.total || 0);
      } else {
        triggerToast('Failed to load system audit logs.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error connecting to security logs service.');
    } finally {
      setLoading(false);
    }
  }, [user?.token, triggerToast]);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const getActionBadgeColor = (action: string) => {
    if (action.startsWith('CREATE_')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (action.startsWith('UPDATE_')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (action.startsWith('DELETE_')) return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  return (
    <div className="space-y-8 px-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em] mb-1">Security Audit</p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Audit Logs
            <span className="text-indigo-400">.</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
            Review critical administrator writes, role changes, and settings modifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-400">
            Total Records: {totalLogs}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table of logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Action</th>
                    <th className="py-4 px-6">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-xs text-slate-500 font-mono tracking-wider">
                        Syncing activity records...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-xs text-slate-500 font-mono tracking-wider">
                        No administrator actions logged.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log._id}
                        onClick={() => setSelectedLog(log)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedLog(log);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View log details for action ${log.action}`}
                        className={`text-xs hover:bg-white/[0.01] cursor-pointer transition-colors focus:outline-none focus:bg-white/[0.03] focus:ring-1 focus:ring-indigo-500/30 ${
                          selectedLog?._id === log._id ? 'bg-white/[0.02]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-6 font-mono text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-slate-200">
                            {log.user?.name || 'System / Hook'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {log.user?.email || 'automated'}
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 font-mono text-[10px]">
                          {log.targetType} ({log.targetId.substring(0, 8)}...)
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 rounded-lg border border-white/5 bg-slate-900 text-xs font-semibold text-slate-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 rounded-lg border border-white/5 bg-slate-900 text-xs font-semibold text-slate-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Log Inspector */}
        <div className="space-y-4">
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6 h-fit space-y-6">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400 mb-1">
                Record Inspector
              </h3>
              <p className="text-[10px] text-slate-500">
                Select any row to analyze metadata, JSON parameters, and origin IP details.
              </p>
            </div>

            {selectedLog ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Action</span>
                    <span className="font-bold text-indigo-400">{selectedLog.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Type</span>
                    <span className="font-mono text-slate-300">{selectedLog.targetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target ID</span>
                    <span className="font-mono text-slate-300">{selectedLog.targetId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operator</span>
                    <span className="font-semibold text-slate-300">
                      {selectedLog.user ? selectedLog.user.name : 'System'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operator IP</span>
                    <span className="font-mono text-slate-300">{selectedLog.ipAddress || 'unknown'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                    Modification Details (JSON)
                  </label>
                  <pre className="p-4 bg-slate-950 border border-white/5 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto max-h-[300px] whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>

                {selectedLog.userAgent && (
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Client Signature
                    </label>
                    <div className="p-2.5 bg-slate-950 border border-white/5 rounded-xl font-mono text-[9px] text-slate-400 break-all leading-normal">
                      {selectedLog.userAgent}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-mono italic">
                No activity log record selected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
