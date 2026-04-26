import { Node as ChatNode, InteractionLog, User, Inquiry } from '../models/index.js';
import { randomUUID } from 'crypto';

export async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // 1. Criar Usuário Admin (se não existir)
    const adminEmail = 'admin@fatec.edu';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      } as any);
      console.log('✅ Usuário Admin criado: admin@fatec.edu / admin123');
    }

    // 2. Criar Estrutura de Canais (Nós)
    const count = await ChatNode.count();
    if (count === 0) {
      const root = await ChatNode.create({ title: 'Início', content: 'Olá! Como posso ajudar você hoje?' });
      
      const mat = await ChatNode.create({ 
        title: 'Matrícula', 
        content: 'Para informações sobre matrícula, acesse o portal do aluno ou compareça à secretaria.',
        parentId: root.id 
      });

      await ChatNode.create({ 
        title: 'Rematrícula', 
        content: 'A rematrícula ocorre semestralmente via SIGA. Fique atento aos prazos no calendário.',
        parentId: mat.id 
      });

      console.log('✅ Árvore de canais inicial populada.');
    }

    // 3. Criar Logs de Exemplo para os Gráficos (Phase 3)
    const logCount = await InteractionLog.count();
    if (logCount === 0) {
      const now = new Date();
      const logs = [];
      
      for (let i = 0; i < 20; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (i % 7)); // Espalhar nos últimos 7 dias
        
        logs.push({
          sessionId: randomUUID(),
          navigationFlow: [1],
          satisfaction: i % 3 === 0 ? 'NAO_ATENDEU' : 'ATENDEU',
          createdAt: date
        });
      }
      
      await InteractionLog.bulkCreate(logs);
      console.log('✅ Logs de exemplo criados para o Dashboard.');
    }

    console.log('✨ Seed finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed do banco de dados:', error);
  }
}
