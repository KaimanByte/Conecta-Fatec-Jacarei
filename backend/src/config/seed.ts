import { Node as ChatNode, InteractionLog, User } from '../models/index.js';
import { randomUUID } from 'crypto';

export async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados com conteúdo integral...');

  try {
    // 1. Limpar dados existentes para evitar duplicatas
    await ChatNode.destroy({ where: {}, cascade: true });

    // --- BLOCOS DE TEXTO REPETIDOS (Conforme "Igual ao item X") ---
    
    const CONTENT_1_2_DATAS = `Segue o calendário acadêmico do 1º semestre letivo de 2026:
• Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026
• Rematrícula de alunos veteranos: 12 a 18/01/2026
• Início das aulas: 09/02/2026
• Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026
• Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026
• Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026
• Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026
• Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026
• Exame de nivelamento sem ajuste de horário: 27/02/2026
• Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026
• Prazo final para desistência de disciplina (Art. 30): 25/03/2026
• Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026
• Término das aulas: 27/06/2026
• Período de exames finais (Art. 34): 06 a 08/07/2026`;

    const CONTENT_1_5_1_APROVEITAMENTO = `A solicitação deve ser realizada pelo SIGA, anexando:
• Histórico escolar
• Ementas das disciplinas cursadas
Requisitos:
• Disciplinas cursadas nos últimos 10 anos
• Similaridade ≥ 70% → aprovação direta
• Similaridade entre 50% e 70% → exame de proficiência
• Similaridade < 50% → indeferimento
Referência: Regulamento Geral dos Cursos Superiores das Fatecs – Seção I, p. 25.`;

    const CONTENT_1_5_2_ETEC = `É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.
Referência: Regulamento Geral dos Cursos Superiores das Fatecs – Seção II, p. 27.`;

    const CONTENT_1_5_3_CONHECIMENTOS = `Para solicitar, é necessário:
• Diploma(s) ou certificado(s);
• Realizar exame de proficiência.
Comprovantes aceitos:
• Declaração da empresa (experiência profissional);
• Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;
• Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);
• Cursos de inglês para habilitação às provas de Inglês II, III e IV.
A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.
Referência: Regulamento Geral dos Cursos Superiores das Fatecs – Seção III, p. 27.`;

    const CONTENT_1_5_4_PROFICIENCIA = `No início do 3º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.
• Plataforma: NEPLE
• Uso obrigatório de fones de ouvido
• Aplicação exclusiva no início do 3º semestre
Não é possível realizar a prova em outro período do curso.`;

    const CONTENT_1_6_2_INICIO_ESTAGIO = `O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.
Após conseguir a vaga, entre em contato com a Secretaria Administrativa: f258adm@cps.sp.gov.br`;

    const CONTENT_1_6_4_EQUIPARACAO = `Pode ser comprovado por:
• Iniciação Científica
• Monitoria
• Atividade profissional na área
Consultar anexos correspondentes no Manual de Estágio.`;

    // --- CRIAÇÃO DA ÁRVORE ---

    const root = await ChatNode.create({ 
      title: 'Início', 
      content: 'Olá! Sou o assistente virtual da Fatec Jacareí. Escolha uma das opções abaixo para começar:' 
    });

    // --- 1. DESENVOLVIMENTO DE SOFTWARE MULTIPLATAFORMA (DSM) ---
    const dsm = await ChatNode.create({ title: '1. DESENVOLVIMENTO DE SOFTWARE MULTIPLATAFORMA (DSM)', parentId: root.id });
    
    await ChatNode.create({ title: '1.1. Atividades Complementares (AACC)', content: 'O curso de Desenvolvimento de Software Multiplataforma não possui Atividades Acadêmico-Científico-Culturais (AACC) previstas em sua matriz curricular.', parentId: dsm.id });
    await ChatNode.create({ title: '1.2. Datas importantes do semestre', content: CONTENT_1_2_DATAS, parentId: dsm.id });
    await ChatNode.create({ title: '1.3. Disciplinas com atividades de extensão', content: 'No curso de DSM, as atividades de extensão estão vinculadas ao ABP e às seguintes disciplinas do 2º ao 6º semestre (consulte o guia para a lista completa de Engenharia de Software a Cloud Computing).', parentId: dsm.id });
    await ChatNode.create({ title: '1.4. Disciplinas remotas', content: 'No 5º semestre: Inglês III e Fundamentos da Redação Técnica. No 6º semestre: Todas as disciplinas são remotas.', parentId: dsm.id });
    
    const dsmDispensa = await ChatNode.create({ title: '1.5. Dispensa de disciplinas', content: 'Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular. Escolha a modalidade:', parentId: dsm.id });
    await ChatNode.create({ title: '1.5.1. Aproveitamento de estudos', content: CONTENT_1_5_1_APROVEITAMENTO, parentId: dsmDispensa.id });
    await ChatNode.create({ title: '1.5.2. Reconhecimento de competências – Etec', content: CONTENT_1_5_2_ETEC, parentId: dsmDispensa.id });
    await ChatNode.create({ title: '1.5.3. Aproveitamento de conhecimentos e experiências anteriores', content: CONTENT_1_5_3_CONHECIMENTOS, parentId: dsmDispensa.id });
    await ChatNode.create({ title: '1.5.4. Proficiência em Inglês', content: CONTENT_1_5_4_PROFICIENCIA, parentId: dsmDispensa.id });

    const dsmEstagio = await ChatNode.create({ title: '1.6. Estágio', content: 'Escolha a opção desejada sobre estágio:', parentId: dsm.id });
    await ChatNode.create({ title: '1.6.1. Duração do estágio supervisionado', content: 'Carga horária obrigatória: 240 horas. Pode iniciar: a partir do 1º semestre.', parentId: dsmEstagio.id });
    await ChatNode.create({ title: '1.6.2. Início do estágio', content: CONTENT_1_6_2_INICIO_ESTAGIO, parentId: dsmEstagio.id });
    await ChatNode.create({ title: '1.6.3. Comprovação', content: 'Após concluir as 240 horas, o aluno deve elaborar o Relatório Final de Estágio, assinado pelo supervisor e encaminhado ao Professor Orientador.', parentId: dsmEstagio.id });
    await ChatNode.create({ title: '1.6.4. Equiparação de estágio', content: CONTENT_1_6_4_EQUIPARACAO, parentId: dsmEstagio.id });

    await ChatNode.create({ title: '1.7. Horário das aulas', content: 'Qual semestre você deseja consultar? (1º ao 6º semestre – exibir imagem correspondente)', parentId: dsm.id });
    await ChatNode.create({ title: '1.8. Portfólio', content: 'O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital. Contato: marcelo.sudo@fatec.sp.gov.br', parentId: dsm.id });
    await ChatNode.create({ title: '1.9. Trabalho de Graduação (TG/TCC)', content: 'O curso de DSM não possui Trabalho de Graduação (TG/TCC). O TG é substituído pela construção do Portfólio Digital.', parentId: dsm.id });

    // --- 2. GEOPROCESSAMENTO ---
    const geo = await ChatNode.create({ title: '2. GEOPROCESSAMENTO', parentId: root.id });
    await ChatNode.create({ title: '2.1. Atividades Complementares (AACC)', content: 'É necessário cumprir 60 horas de Atividades Acadêmico Científico Culturais (AACC). Inclui cursos, feiras como a FEITEC, visitas e voluntariado.', parentId: geo.id });
    await ChatNode.create({ title: '2.2. Datas importantes do semestre', content: CONTENT_1_2_DATAS, parentId: geo.id });
    await ChatNode.create({ title: '2.3. Disciplinas remotas', content: 'Não possui disciplinas remotas.', parentId: geo.id });
    
    const geoDispensa = await ChatNode.create({ title: '2.4. Dispensa de disciplinas', content: 'Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular.', parentId: geo.id });
    await ChatNode.create({ title: '2.4.1. Aproveitamento de estudos', content: CONTENT_1_5_1_APROVEITAMENTO, parentId: geoDispensa.id });
    await ChatNode.create({ title: '2.4.5. Disciplinas com atividades de extensão (Geo)', content: 'Vinculadas a: Processamento Digital de Imagens, Cartografia Aplicada, Análise Ambiental, Projetos I e II e Geomarketing.', parentId: geoDispensa.id });

    const geoEstagio = await ChatNode.create({ title: '2.5. Estágio (Geo)', content: 'Escolha a opção:', parentId: geo.id });
    await ChatNode.create({ title: '2.5.1. Duração do estágio supervisionado', content: 'Carga horária obrigatória: 180 horas. Pode iniciar: a partir do 4º semestre.', parentId: geoEstagio.id });
    await ChatNode.create({ title: '2.5.3. Comprovação', content: 'Após concluir as 180 horas, encaminhar relatório ao Professor Orientador (adilson.neves@fatec.sp.gov.br).', parentId: geoEstagio.id });

    await ChatNode.create({ title: '2.8. Trabalho de Graduação (TG/TCC)', content: 'Deve ser iniciado no 5º semestre e concluído no 6º. Elaborado no formato de artigo científico com defesa perante banca.', parentId: geo.id });

    // --- 3. MEIO AMBIENTE E RECURSOS HÍDRICOS (MARH) ---
    const marh = await ChatNode.create({ title: '3. MEIO AMBIENTE E RECURSOS HÍDRICOS (MARH)', parentId: root.id });
    await ChatNode.create({ title: '3.1. Atividades Complementares (AACC)', content: 'É necessário cumprir 60 horas de Atividades Acadêmico Científico Culturais (AACC).', parentId: marh.id });
    await ChatNode.create({ title: '3.2. Datas importantes do semestre', content: CONTENT_1_2_DATAS, parentId: marh.id });
    await ChatNode.create({ title: '3.3. Disciplinas remotas', content: 'No 5º semestre: 20% da carga de cada disciplina é remota. No 6º semestre: Todas as disciplinas são remotas.', parentId: marh.id });
    
    const marhDispensa = await ChatNode.create({ title: '3.4. Dispensa de disciplinas', content: 'Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular.', parentId: marh.id });
    await ChatNode.create({ title: '3.4.1. Disciplinas com atividades de extensão (MARH)', content: '1º sem: Biologia, Química. 2º sem: Hidrologia, Meteorologia. 4º sem: Ed. Ambiental. 5º e 6º sem: Projetos e Gestão.', parentId: marhDispensa.id });

    const marhEstagio = await ChatNode.create({ title: '3.5. Estágio (MARH)', content: 'Carga: 180 horas. Pode iniciar a partir do 4º semestre.', parentId: marh.id });
    await ChatNode.create({ title: '3.8. Trabalho de Graduação (TG/TCC)', content: 'Iniciado no 5º semestre na disciplina Projetos Ambientais I e concluído no 6º semestre.', parentId: marh.id });

    // --- 4. NÃO SOU ALUNO ---
    const naoAluno = await ChatNode.create({ title: '4. NÃO SOU ALUNO', parentId: root.id });
    await ChatNode.create({ title: '4.1. A Fatec possui cursos técnicos?', content: 'A Fatec oferece exclusivamente cursos de graduação tecnológica (ensino superior). Para cursos técnicos, acesse: https://vestibulinho.etec.sp.gov.br/unidades-cursos/escola.asp?c=77', parentId: naoAluno.id });
    await ChatNode.create({ title: '4.2. Como ingressar na Fatec?', content: 'O ingresso ocorre por meio de vestibular, realizado duas vezes ao ano. Informações: https://vestibular.fatec.sp.gov.br/home/', parentId: naoAluno.id });
    await ChatNode.create({ title: '4.3. Como realizar a matrícula?', content: 'A matrícula dos candidatos aprovados é realizada de forma totalmente online no portal oficial do vestibular.', parentId: naoAluno.id });
    await ChatNode.create({ title: '4.4. Cursos oferecidos na Fatec Jacareí', content: 'Desenvolvimento de Software Multiplataforma, Geoprocessamento e Meio Ambiente e Recursos Hídricos. Todos noturnos (18h45 às 23h05).', parentId: naoAluno.id });
    await ChatNode.create({ title: '4.5. Horários das aulas', content: 'As aulas de todos os cursos da Fatec Jacareí ocorrem no período noturno, das 18h45 às 23h05.', parentId: naoAluno.id });

    console.log('✅ Árvore de canais populada com nomes oficiais.');

    // 4. Logs para Dashboard
    const logs = [];
    for (let i = 0; i < 30; i++) {
      logs.push({
        sessionId: randomUUID(),
        navigationFlow: [root.id],
        satisfaction: i % 5 === 0 ? 'NAO_ATENDEU' : 'ATENDEU',
        createdAt: new Date()
      });
    }
    await InteractionLog.bulkCreate(logs);

    console.log('✨ Seed finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}