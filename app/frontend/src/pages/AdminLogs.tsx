import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Filter,
  Calendar,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import './AdminLogs.css';

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
          api.get('/admin/nodes'),
        ]);

        setLogs(logsRes.data);

        const nodeMap: Record<number, string> = {};
        nodesRes.data.forEach((n: any) => {
          nodeMap[n.id] = n.title;
        });

        setNodes(nodeMap);
      } catch (err) {
        console.error('Erro ao buscar logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const stats = useMemo(() => {
    const total = logs.length;
    const satisfied = logs.filter((l) => l.satisfaction === 'ATENDEU').length;
    const unsatisfied = logs.filter((l) => l.satisfaction === 'NAO_ATENDEU').length;

    const rate =
      total > 0 ? Math.round((satisfied / (satisfied + unsatisfied || 1)) * 100) : 0;

    const satisfactionData = [
      { name: 'Satisfeitos', value: satisfied, color: '#10b981' },
      { name: 'Insatisfeitos', value: unsatisfied, color: '#f43f5e' },
    ];

    const dailyMap: Record<string, number> = {};

    logs.forEach((log) => {
      const date = new Date(log.createdAt).toLocaleDateString();
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });

    const volumeData = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .reverse()
      .slice(-7);

    return { total, satisfied, unsatisfied, rate, satisfactionData, volumeData };
  }, [logs]);

  return (
    <AdminLayout setToken={setToken}>
      <div className="admin-logs-header">
        <div>
          <h2 className="admin-logs-title">Painel de Analytics</h2>
          <p className="admin-logs-subtitle">
            Insights de desempenho e satisfação dos usuários
          </p>
        </div>

        <div className="admin-logs-filter">
          {(['TODAS', 'ATENDEU', 'NAO_ATENDEU'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`admin-logs-filter-button ${
                filter === f ? 'admin-logs-filter-button-active' : ''
              }`}
            >
              {f === 'TODAS' ? 'Tudo' : f === 'ATENDEU' ? 'Satisfeitos' : 'Insatisfeitos'}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-logs-stats-grid">
        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-indigo">
              <TrendingUp size={24} />
            </div>

            <div>
              <p className="admin-logs-stat-label">Total Sessões</p>
              <h3 className="admin-logs-stat-value">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-green">
              <ThumbsUp size={24} />
            </div>

            <div>
              <p className="admin-logs-stat-label">Aprovados</p>
              <h3 className="admin-logs-stat-value">{stats.satisfied}</h3>
            </div>
          </div>
        </div>

        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-rose">
              <ThumbsDown size={24} />
            </div>

            <div>
              <p className="admin-logs-stat-label">Reprovados</p>
              <h3 className="admin-logs-stat-value">{stats.unsatisfied}</h3>
            </div>
          </div>
        </div>

        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-amber">
              <UserCheck size={24} />
            </div>

            <div>
              <p className="admin-logs-stat-label">Taxa de Sucesso</p>
              <h3 className="admin-logs-stat-value">{stats.rate}%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-logs-charts-grid">
        <div className="admin-logs-chart-card">
          <h3 className="admin-logs-chart-title">Satisfação dos Atendimentos</h3>

          <div className="admin-logs-chart-wrapper">
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

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-logs-chart-card">
          <h3 className="admin-logs-chart-title">Volume de Interações (Semanas)</h3>

          <div className="admin-logs-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />

                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-logs-table-card">
        <div className="admin-logs-table-header">
          <h3 className="admin-logs-table-title">
            <Filter size={18} className="admin-logs-table-title-icon" />
            Atendimentos Recentes
          </h3>

          <span className="admin-logs-table-count">
            Mostrando últimos {logs.length} atendimentos
          </span>
        </div>

        {loading ? (
          <div className="admin-logs-skeleton-wrapper">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="admin-logs-table-wrapper">
            <table className="admin-logs-table">
              <thead>
                <tr>
                  <th>Sessão / Data</th>
                  <th>Fluxo Percorrido</th>
                  <th className="admin-logs-center">Satisfação</th>
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="admin-logs-empty">
                      Nenhuma atividade registrada.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td className="admin-logs-session-cell">
                        <span className="admin-logs-session-id">{log.sessionId}</span>

                        <div className="admin-logs-date">
                          <Calendar size={10} />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>

                      <td className="admin-logs-flow-cell">
                        <div className="admin-logs-flow">
                          {log.navigationFlow?.map((nodeId, idx) => (
                            <span key={idx} className="admin-logs-flow-tag">
                              {nodes[nodeId] || `Nó #${nodeId}`}
                            </span>
                          )) || <span className="admin-logs-no-navigation">Sem navegação</span>}
                        </div>
                      </td>

                      <td className="admin-logs-satisfaction-cell">
                        {log.satisfaction ? (
                          <span
                            className={`admin-logs-satisfaction-badge ${
                              log.satisfaction === 'ATENDEU'
                                ? 'admin-logs-satisfaction-positive'
                                : 'admin-logs-satisfaction-negative'
                            }`}
                          >
                            {log.satisfaction}
                          </span>
                        ) : (
                          <span className="admin-logs-not-rated">Não Avaliado</span>
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