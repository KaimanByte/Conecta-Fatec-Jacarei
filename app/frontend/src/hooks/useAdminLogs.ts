import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { logService } from '../services/logService';
import type { LogEntry, LogStats, SatisfactionFilter } from '../types';

export function useAdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nodes, setNodes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SatisfactionFilter>('TODAS');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [logList, nodeList] = await Promise.all([
          logService.list(filter),
          logService.listNodes(),
        ]);

        setLogs(logList);
        setNodes(
          nodeList.reduce<Record<number, string>>((nodeMap, node) => {
            nodeMap[node.id] = node.title;
            return nodeMap;
          }, {}),
        );
      } catch {
        toast.error('Erro ao buscar logs de atendimento.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter]);

  const stats = useMemo<LogStats>(() => {
    const total = logs.length;
    const satisfied = logs.filter((log) => log.satisfaction === 'ATENDEU').length;
    const unsatisfied = logs.filter((log) => log.satisfaction === 'NAO_ATENDEU').length;
    const ratedTotal = satisfied + unsatisfied;
    const rate = ratedTotal > 0 ? Math.round((satisfied / ratedTotal) * 100) : 0;

    const dailyMap: Record<string, number> = {};
    logs.forEach((log) => {
      const date = new Date(log.createdAt).toLocaleDateString();
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });

    return {
      total,
      satisfied,
      unsatisfied,
      rate,
      satisfactionData: [
        { name: 'Satisfeitos', value: satisfied, color: '#10b981' },
        { name: 'Insatisfeitos', value: unsatisfied, color: '#f43f5e' },
      ],
      volumeData: Object.entries(dailyMap)
        .map(([date, count]) => ({ date, count }))
        .reverse()
        .slice(-7),
    };
  }, [logs]);

  return { logs, nodes, loading, filter, setFilter, stats };
}
