import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Filter, Calendar, TrendingUp, ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';

interface Log {
  id: number;
  sessionId: string;
  navigationFlow: number[];
  satisfaction?: 'ATENDEU' | 'NAO_ATENDEU';
  createdAt: string;
}

const AdminLogs = ({ setToken }: { setToken?: (v: string | null) => void }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [nodes, setNodes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'TODAS' | 'ATENDEU' | 'NAO_ATENDEU'>('TODAS');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [logsRes, nodesRes] = await Promise.all([
          api.get(`/admin/logs${filter !== 'TODAS' ? `?satisfaction=${filter}` : ''}`),
          api.get('/admin/nodes')
        ]);
        
        setLogs(logsRes.data);
        const nodeMap: Record<number, string> = {};
        nodesRes.data.forEach((n: any) => { nodeMap[n.id] = n.title; });
        setNodes(nodeMap);
      } catch (err) {
        console.error('Erro ao buscar logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  // Data processing for charts
  const stats = useMemo(() => {
    const total = logs.length;
    const satisfied = logs.filter(l => l.satisfaction === 'ATENDEU').length;
    const unsatisfied = logs.filter(l => l.satisfaction === 'NAO_ATENDEU').length;
    const rate = total > 0 ? Math.round((satisfied / (satisfied + unsatisfied || 1)) * 100) : 0;

    const satisfactionData = [
      { name: 'Satisfeitos', value: satisfied, color: '#10b981' },
      { name: 'Insatisfeitos', value: unsatisfied, color: '#f43f5e' }
    ];

    // Grouping by day (last 7 days)
    const dailyMap: Record<string, number> = {};
    logs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString();
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });
    const volumeData = Object.entries(dailyMap).map(([date, count]) => ({ date, count })).reverse().slice(-7);

    return { total, satisfied, unsatisfied, rate, satisfactionData, volumeData };
  }, [logs]);

  return (
    <AdminLayout setToken={setToken}>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Painel de Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Insights de desempenho e satisfação dos usuários</p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-1 transition-colors">
          {(['TODAS', 'ATENDEU', 'NAO_ATENDEU'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {f === 'TODAS' ? 'Tudo' : f === 'ATENDEU' ? 'Satisfeitos' : 'Insatisfeitos'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 transition-colors">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Total Sessões</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
              <ThumbsUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Aprovados</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats.satisfied}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <ThumbsDown size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Reprovados</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats.unsatisfied}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Taxa de Sucesso</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats.rate}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 transition-colors">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
           <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Satisfação dos Atendimentos</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={stats.satisfactionData}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {stats.satisfactionData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
           <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Volume de Interações (Semanas)</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.volumeData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                 <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                 <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Filter size={18} className="text-indigo-500" />
            Atendimentos Recentes
          </h3>
          <span className="text-xs text-gray-400 font-medium">Mostrando últimos {logs.length} atendimentos</span>
        </div>
        
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/50 dark:bg-slate-900/50 border-b border-gray-50 dark:border-slate-800">
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sessão / Data</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Fluxo Percorrido</th>
                  <th className="px-8 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Satisfação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {logs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-10 text-center text-gray-400 italic">Nenhuma atividade registrada.</td>
                    </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-indigo-50/20 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 block truncate max-w-[150px]">{log.sessionId}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase font-bold">
                          <Calendar size={10} />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {log.navigationFlow?.map((nodeId, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 dark:border-slate-700">
                              {nodes[nodeId] || `Nó #${nodeId}`}
                            </span>
                          )) || <span className="text-gray-300">Sem navegação</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {log.satisfaction ? (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            log.satisfaction === 'ATENDEU' 
                              ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                              : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                          }`}>
                            {log.satisfaction}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-300 dark:text-gray-600 font-bold uppercase">Não Avaliado</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;
