import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Calendar, Filter, ThumbsDown, ThumbsUp, TrendingUp, UserCheck } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Skeleton } from '../components/Skeleton';
import { useAdminLogs } from '../hooks/useAdminLogs';
import type { SatisfactionFilter } from '../types';
import './AdminLogs.css';

const filters: SatisfactionFilter[] = ['TODAS', 'ATENDEU', 'NAO_ATENDEU'];

const filterLabel: Record<SatisfactionFilter, string> = {
  TODAS: 'TUDO',
  ATENDEU: 'SATISFEITOS',
  NAO_ATENDEU: 'INSATISFEITOS',
};

const tooltipStyle = {
  backgroundColor: '#f3f4f6',
  border: 'none',
  borderRadius: '8px',
};

const AdminLogs = ({ setToken }: { setToken?: (value: string | null) => void }) => {
  const { logs, nodes, loading, filter, setFilter, stats } = useAdminLogs();

  return (
    <AdminLayout setToken={setToken}>
      <div className="admin-logs-header">
        <div>
          <h2 className="admin-logs-title">Painel de Analytics</h2>
          <p className="admin-logs-subtitle">Insights de desempenho e satisfação dos usuários</p>
        </div>

        <div className="admin-logs-filter">
          {filters.map((currentFilter) => (
            <button
              key={currentFilter}
              onClick={() => setFilter(currentFilter)}
              className={`admin-logs-filter-button ${filter === currentFilter ? 'admin-logs-filter-button-active' : ''}`}
              type="button"
            >
              {filterLabel[currentFilter]}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-logs-stats-grid">
        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-indigo"><TrendingUp size={24} /></div>
            <div>
              <p className="admin-logs-stat-label">Total Sessões</p>
              <h3 className="admin-logs-stat-value">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-green"><ThumbsUp size={24} /></div>
            <div>
              <p className="admin-logs-stat-label">Aprovados</p>
              <h3 className="admin-logs-stat-value">{stats.satisfied}</h3>
            </div>
          </div>
        </div>

        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-rose"><ThumbsDown size={24} /></div>
            <div>
              <p className="admin-logs-stat-label">Reprovados</p>
              <h3 className="admin-logs-stat-value">{stats.unsatisfied}</h3>
            </div>
          </div>
        </div>

        <div className="admin-logs-stat-card">
          <div className="admin-logs-stat-content">
            <div className="admin-logs-stat-icon admin-logs-stat-icon-amber"><UserCheck size={24} /></div>
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
                <Pie data={stats.satisfactionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.satisfactionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                 <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#111827' }}/>
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
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f6f3f500' }} contentStyle={tooltipStyle} labelStyle={{ color: '#111827' }} itemStyle={{ color: '#111827' }} />
                <Bar dataKey="count" fill="#b20000" radius={[4, 4, 0, 0]} barSize={32} />
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
          <span className="admin-logs-table-count">Mostrando últimos {logs.length} atendimentos</span>
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
                    <td colSpan={3} className="admin-logs-empty">Nenhuma atividade registrada.</td>
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
                          {log.navigationFlow?.length ? (
                            log.navigationFlow.map((nodeId, index) => (
                              <span key={`${log.id}-${nodeId}-${index}`} className="admin-logs-flow-tag">
                                {nodes[nodeId] || `Nó #${nodeId}`}
                              </span>
                            ))
                          ) : (
                            <span className="admin-logs-no-navigation">Sem navegação</span>
                          )}
                        </div>
                      </td>

                      <td className="admin-logs-satisfaction-cell">
                        {log.satisfaction ? (
                          <span className={`admin-logs-satisfaction-badge ${log.satisfaction === 'ATENDEU' ? 'admin-logs-satisfaction-positive' : 'admin-logs-satisfaction-negative'}`}>
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
