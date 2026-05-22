import { WhereOptions } from 'sequelize';
import { InteractionLog } from '../models/index.js';
import { AppError } from '../errors/AppError.js';

type Satisfaction = 'ATENDEU' | 'NAO_ATENDEU';

type ListLogFilters = {
  satisfaction?: string;
};

const isValidSatisfaction = (value: string): value is Satisfaction => {
  return value === 'ATENDEU' || value === 'NAO_ATENDEU';
};

export class InteractionLogService {
  async registerNavigation(sessionId: string, nodeId?: number) {
    if (!sessionId) {
      throw new AppError('sessionId obrigatório', 400);
    }

    let log = await InteractionLog.findOne({ where: { sessionId } });

    if (!log) {
      log = await InteractionLog.create({
        sessionId,
        navigationFlow: nodeId ? [nodeId] : [],
      });
    } else if (nodeId) {
      const flow = Array.isArray(log.navigationFlow) ? [...log.navigationFlow] : [];

      if (flow[flow.length - 1] !== nodeId) {
        flow.push(nodeId);
        await log.update({ navigationFlow: flow });
      }
    }

    return { sessionId, id: log.id };
  }

  async registerSatisfaction(sessionId: string, satisfaction: string) {
    if (!isValidSatisfaction(satisfaction)) {
      throw new AppError('satisfaction deve ser ATENDEU ou NAO_ATENDEU', 400);
    }

    const [count] = await InteractionLog.update(
      { satisfaction },
      { where: { sessionId } }
    );

    if (count === 0) {
      await InteractionLog.create({
        sessionId,
        navigationFlow: [],
        satisfaction,
      });
    }

    return { message: 'Avaliação registrada. Obrigado!' };
  }

  async listLogs(filters: ListLogFilters) {
    const where: WhereOptions = {};

    if (filters.satisfaction && filters.satisfaction !== 'TODAS') {
      Object.assign(where, { satisfaction: filters.satisfaction });
    }

    return InteractionLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
  }
}
