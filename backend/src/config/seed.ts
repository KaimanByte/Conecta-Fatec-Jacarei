import { Node as ChatNode, User } from '../models/index.js';

type SeedNode = {
  key: string;
  parentKey: string | null;
  title: string;
  content?: string;
};

const seedNodes: SeedNode[] = [
  {
    key: "dsm",
    parentKey: null,
    title: "Desenvolvimento de Software Multiplataforma",
    content: "Para qual assunto você gostaria de obter informações?",
  },
  {
    key: "geo",
    parentKey: null,
    title: "Geoprocessamento",
    content: "Para qual assunto você gostaria de obter informações?",
  },
  {
    key: "marh",
    parentKey: null,
    title: "Meio Ambiente e Recursos Hídricos",
    content: "Para qual assunto você gostaria de obter informações?",
  },
  {
    key: "nao-sou-aluno",
    parentKey: null,
    title: "Não sou aluno",
    content: "Para qual assunto você gostaria de obter informações?",
  },
  {
    key: "siga",
    parentKey: null,
    title: "SIGA - Sistema Acadêmico",
    content: "Para qual assunto você gostaria de obter informações?",
  },
  {
    key: "dsm-aacc",
    parentKey: "dsm",
    title: "Atividades Complementares (AACC)",
    content: "O curso de Desenvolvimento de Software Multiplataforma não possui Atividades Acadêmico-Científico-Culturais (AACC) previstas em sua matriz curricular.",
  },
  {
    key: "dsm-datas-importantes",
    parentKey: "dsm",
    title: "Datas importantes do semestre",
    content: "• Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026\n• Rematrícula de alunos veteranos: 12 a 18/01/2026\n• Início das aulas: 09/02/2026\n• Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026\n• Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026\n• Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026\n• Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026\n• Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026\n• Exame de nivelamento sem ajuste de horário: 27/02/2026\n• Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026\n• Prazo final para desistência de disciplina (Art. 30): 25/03/2026\n• Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026\n• Término das aulas: 27/06/2026\n• Período de exames finais (Art. 34): 06 a 08/07/2026\nAcesse o calendário com todas as datas importantes para consultar prazos, eventos acadêmicos e períodos letivos completos.\n<a href='/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf#page=1' target='_blank' rel='noopener noreferrer'>Abrir Calendário Acadêmico 2026</a>.",
  },
  {
    key: "dsm-extensao",
    parentKey: "dsm",
    title: "Disciplinas com atividades de extensão",
    content: "No curso de DSM, as atividades de extensão estão vinculadas ao ABP e às seguintes disciplinas:\n2º semestre:\n• Engenharia de Software II\n• Desenvolvimento Web II\n• Banco de Dados Relacional\n• Técnicas de Programação I\n3º semestre:\n• Gestão Ágil de Projetos\n• Desenvolvimento Web III\n• Técnicas de Programação II\n• Interação Humano-Computador\n4º semestre:\n• Laboratório de Desenvolvimento Web\n• Integração e Entrega Contínua\n• Internet das Coisas e Aplicações\n5º semestre:\n• Laboratório de Desenvolvimento para Dispositivos Móveis\n• Computação em Nuvem I\n• Aprendizagem de Máquina\n6º semestre:\n• Laboratório de Desenvolvimento Multiplataforma\n• Processamento de Linguagem Natural\n• Computação em Nuvem II\nPara obter mais orientações sobre as atividades de extensão, consulte o PPC do curso de DSM, nos anexos a partir da página 102.\n<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf#page=102' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "dsm-disciplinas-remotas",
    parentKey: "dsm",
    title: "Disciplinas remotas",
    content: "No 5º semestre:\n• Inglês III\n• Fundamentos da Redação Técnica\nNo 6º semestre:\n• Todas as disciplinas são remotas.\nAs aulas são remotas e síncronas, ou seja, o aluno precisa estar presente no momento em que a aula é ministrada. Não confundir com aulas na modalidade EaD, que são remotas e assíncronas.\nPara obter mais orientações sobre a grade de disciplinas, consulte o PPC do curso de DSM, na página 28.\n<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf#page=28' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "dsm-dispensa",
    parentKey: "dsm",
    title: "Dispensa de disciplinas",
    content: "Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular. No DSM as disciplinas de extensão curricular são aquelas vinculadas ao ABP. \nEscolha a modalidade desejada:",
  },
  {
    key: "dsm-estagio",
    parentKey: "dsm",
    title: "Estágio",
    content: "Escolha a opção:",
  },
  {
    key: "dsm-horario-aulas",
    parentKey: "dsm",
    title: "Horário das aulas",
    content: "Qual semestre você deseja consultar?",
  },
  {
    key: "dsm-horario-aulas-1-semestre",
    parentKey: "dsm-horario-aulas",
    title: "1º semestre",
    content: "Horário de aulas do 1º semestre de DSM.\n<a href='/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf#page=1' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "dsm-horario-aulas-2-semestre",
    parentKey: "dsm-horario-aulas",
    title: "2º semestre",
    content: "Horário de aulas do 2º semestre de DSM.\n<a href='/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf#page=2' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "dsm-horario-aulas-3-semestre",
    parentKey: "dsm-horario-aulas",
    title: "3º semestre",
    content: "Horário de aulas do 3º semestre de DSM.\n<a href='/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf#page=3' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "dsm-horario-aulas-4-semestre",
    parentKey: "dsm-horario-aulas",
    title: "4º semestre",
    content: "Horário de aulas do 4º semestre de DSM.\n<a href='/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf#page=4' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "dsm-horario-aulas-5-semestre",
    parentKey: "dsm-horario-aulas",
    title: "5º semestre",
    content: "Horário de aulas do 5º semestre de DSM.\n<a href='/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf#page=5' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "dsm-horario-aulas-6-semestre",
    parentKey: "dsm-horario-aulas",
    title: "6º semestre",
    content: "Horário de aulas do 6º semestre de DSM.\n<a href='/assets/knowledge-base/pdf/DSM-Horario-2026-1.pdf#page=6' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "dsm-portfolio",
    parentKey: "dsm",
    title: "Portfólio",
    content: "O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital.\nOs projetos do 4º, 5º e 6º semestres compõem o portfólio.\nO portfólio deve ser hospedado em repositório privado.\nPara orientações, contate: marcelo.sudo@fatec.sp.gov.br\n<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf#page=102' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "dsm-portfolio-2",
    parentKey: "dsm",
    title: "Trabalho de Graduação (TG/TCC)",
    content: "O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital.\nOs projetos do 4º, 5º e 6º semestres compõem o portfólio.\nO portfólio deve ser hospedado em repositório privado.\nPara orientações, contate: marcelo.sudo@fatec.sp.gov.br\n<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf#page=102' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "dsm-dispensa-aproveitamento-estudos",
    parentKey: "dsm-dispensa",
    title: "Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior",
    content: "É possível solicitar a dispensa de disciplinas cujas cargas horárias e conteúdos já tenham sido cursados em outras instituições de ensino superior.\nA solicitação deve ser realizada pelo SIGA, anexando:\n• Histórico escolar\n• Ementas das disciplinas cursadas\nRequisitos:\n• Disciplinas cursadas nos últimos 10 anos\n• Similaridade ≥ 70% → aprovação direta\n• Similaridade entre 50% e 70% → exame de proficiência\n• Similaridade < 50% → indeferimento\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO I - APROVEITAMENTO DE ESTUDOS\nArtigo 75 - O aproveitamento de estudos é decorrente da equivalência entre componentes curriculares, cumpridos com aprovação em Instituição de Ensino Superior credenciada e com curso superior de graduação autorizado ou reconhecido na forma da Lei.\nParágrafo único - Para fins de aproveitamento de estudos, o aluno deve apresentar o histórico escolar, ementas e o programa ou plano de ensino do componentecurricular concluído nos últimos 10 (dez) anos.\nPara obter a descrição completa acessa o restante do texto na página 25 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=25' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "dsm-dispensa-reconhecimento-etec",
    parentKey: "dsm-dispensa",
    title: "Reconhecimento de competências – disciplinas cursadas na Etec",
    content: "É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO II - RECONHECIMENTO DE COMPETÊNCIAS\nArtigo 79 - É possível realizar reconhecimento de competências adquiridas em cursos técnicos e profissionalizantes de unidades de ensino do CEETEPS, desde que estejam previamente mapeadas e previstas no sistema acadêmico, com especificação dos componentes curriculares passíveis de reconhecimento, valorizando, assim, saberes e conhecimentos adquiridos em outros níveis de ensino, nos termos da legislação vigente.\nParágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nPara obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=27' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "dsm-dispensa-aproveitamento-experiencias",
    parentKey: "dsm-dispensa",
    title: "Aproveitamento de conhecimentos e experiências anteriores",
    content: "Para solicitar, é necessário:\n• Diploma(s) ou certificado(s);\n• Realizar exame de proficiência.\nComprovantes aceitos:\n• Declaração da empresa (experiência profissional);\n• Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;\n• Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);\n• Cursos de inglês para habilitação às provas de Inglês II, III e IV.\nA solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO III - APROVEITAMENTO DE CONHECIMENTO E EXPERIÊNCIAS ANTERIORES\nArtigo 83 - O aproveitamento de conhecimento e experiências anteriores pode ser utilizado para o aluno obter dispensa de disciplinas, exceto àquelas na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nParágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nPara obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=27' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "dsm-dispensa-proficiencia-ingles",
    parentKey: "dsm-dispensa",
    title: "Proficiência em Inglês",
    content: "No início do 3º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.\n• Plataforma: NEPLE\n• Uso obrigatório de fones de ouvido\n• Aplicação exclusiva no início do 3º semestre\nNão é possível realizar a prova em outro período do curso.\nA solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO XII - EXAMES DE NIVELAMENTO E RENDIMENTO DE LÍNGUAS ESTRANGEIRAS\nArtigo 86 - Os exames de nivelamento e rendimento de línguas estrangeiras consistem em avaliação que visa mensurar o conhecimento do aluno em línguas estrangeiras, contemplando leitura, gramática, compreensão auditiva e oralidade.\nPara obter a descrição completa acessa o restante do texto na página 28 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=28' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "dsm-estagio-duracao",
    parentKey: "dsm-estagio",
    title: "Duração do estágio supervisionado",
    content: "Carga horária obrigatória: 240 horas.\nPode iniciar: a partir do 1º semestre.\nPara obter mais orientações acesse a seção \"7.1 Estágio Curricular Supervisionado\" do PPC do curso de DSM, na página 93.\n<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf#page=93' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "dsm-estagio-inicio",
    parentKey: "dsm-estagio",
    title: "Início do estágio",
    content: "O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.\nApós obter a vaga, entre em contato com a Secretaria Administrativa (f258adm@cps.sp.gov.br) para solicitar orientações sobre o trâmite necessário para a assinatura do contrato de estágio.",
  },
  {
    key: "dsm-estagio-comprovacao",
    parentKey: "dsm-estagio",
    title: "Comprovação",
    content: "Após concluir as 240 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio, que deverá ser assinado pelo supervisor e encaminhado ao Professor Orientador.\nAs orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. O modelo do Relatório Final de Estágio está no Anexo F, e o formulário de Avaliação de Estágio está no Anexo G.\n<a href='/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf#page=48' target='_blank' rel='noopener noreferrer'>Abrir Manual de Orientações de Estágio Supervisionado</a>.",
  },
  {
    key: "dsm-estagio-equiparacao",
    parentKey: "dsm-estagio",
    title: "Equiparação de estágio",
    content: "O estágio pode ser comprovado por meio das seguintes modalidades:\n• Iniciação Científica;\n• Monitoria;\n• Atividade profissional na área.\nAs orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. Os modelos de Relatório Final de Estágio compatíveis com cada modalidade estão disponíveis nos anexos do referido manual.\n<a href='/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf#page=56' target='_blank' rel='noopener noreferrer'>Abrir Manual de Orientações de Estágio Supervisionado</a>.",
  },
  {
    key: "geo-aacc",
    parentKey: "geo",
    title: "Atividades Complementares (AACC)",
    content: "É necessário cumprir 60 horas de Atividades Acadêmico Científico Culturais (AACC).\nO aluno poderá utilizar cursos extracurriculares, cursos de inglês, leitura de livros, participação em feiras como a FEITEC, visitas a museus e exposições, teatro e cinema, trabalho voluntário, visitas técnicas etc.\nPara mais detalhes, acesse o PPC do curso de Geoprocessamento, na página 11.\n<a href='/assets/knowledge-base/pdf/Geo-PPC.pdf#page=11' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "geo-datas-importantes",
    parentKey: "geo",
    title: "Datas importantes do semestre",
    content: "• Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026\n• Rematrícula de alunos veteranos: 12 a 18/01/2026\n• Início das aulas: 09/02/2026\n• Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026\n• Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026\n• Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026\n• Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026\n• Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026\n• Exame de nivelamento sem ajuste de horário: 27/02/2026\n• Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026\n• Prazo final para desistência de disciplina (Art. 30): 25/03/2026\n• Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026\n• Término das aulas: 27/06/2026\n• Período de exames finais (Art. 34): 06 a 08/07/2026\nAcesse o calendário com todas as datas importantes para consultar prazos, eventos acadêmicos e períodos letivos completos.\n<a href='/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf#page=1' target='_blank' rel='noopener noreferrer'>Abrir Calendário Acadêmico 2026</a>.",
  },
  {
    key: "geo-disciplinas-remotas",
    parentKey: "geo",
    title: "Disciplinas remotas",
    content: "O curso não possui disciplinas remotas.",
  },
  {
    key: "geo-dispensa",
    parentKey: "geo",
    title: "Dispensa de disciplinas",
    content: "Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular.\nEscolha a modalidade desejada:",
  },
  {
    key: "geo-estagio",
    parentKey: "geo",
    title: "Estágio",
    content: "Escolha a opção:",
  },
  {
    key: "geo-horario-aulas",
    parentKey: "geo",
    title: "Horário das aulas",
    content: "Qual semestre você deseja consultar?",
  },
  {
    key: "geo-horario-aulas-1-semestre",
    parentKey: "geo-horario-aulas",
    title: "1º semestre",
    content: "Horário de aulas do 1º semestre de Geoprocessamento.\n<a href='/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf#page=1' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "geo-horario-aulas-2-semestre",
    parentKey: "geo-horario-aulas",
    title: "2º semestre",
    content: "Horário de aulas do 2º semestre de Geoprocessamento.\n<a href='/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf#page=2' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "geo-horario-aulas-3-semestre",
    parentKey: "geo-horario-aulas",
    title: "3º semestre",
    content: "Horário de aulas do 3º semestre de Geoprocessamento.\n<a href='/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf#page=3' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "geo-horario-aulas-4-semestre",
    parentKey: "geo-horario-aulas",
    title: "4º semestre",
    content: "O 4º semestre não está sendo oferecido",
  },
  {
    key: "geo-horario-aulas-5-semestre",
    parentKey: "geo-horario-aulas",
    title: "5º semestre",
    content: "Horário de aulas do 5º semestre de Geoprocessamento.\n<a href='/assets/knowledge-base/pdf/Geo-Horario-2026-1.pdf#page=4' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "geo-horario-aulas-6-semestre",
    parentKey: "geo-horario-aulas",
    title: "6º semestre",
    content: "O 6º semestre não está sendo oferecido",
  },
  {
    key: "geo-portfolio",
    parentKey: "geo",
    title: "Portfólio",
    content: "O curso de Geoprocessamento não possui Portfólio, mas possui o Trabalho de Graduação (TG) que deverá ser iniciado no 5º semestre.\n<a href='/assets/knowledge-base/pdf/Geo-PPC.pdf#page=11' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "geo-portfolio-2",
    parentKey: "geo",
    title: "Trabalho de Graduação (TG/TCC)",
    content: "O Trabalho de Graduação (TG) deve ser iniciado no 5º semestre, na disciplina Projetos em Geoprocessamento I, e concluído no 6º semestre, na disciplina Projetos em Geoprocessamento II.\nPara iniciar o TG, o aluno deve contar com um professor orientador. Cabe ao aluno procurar um dos professores que possam atuar como orientador e discutir o tema a ser desenvolvido. O aluno pode ter um coorientador externo (fora da Fatec Jacareí).\nO TG deve ser elaborado no formato de artigo científico e apresentado perante uma banca examinadora composta por, no mínimo, três professores.\nO aluno poderá ser dispensado da redação do TG caso apresente artigo científico já publicado em revista ou simpósio, desde que figure como primeiro autor. Nessa situação, deverá apenas realizar a defesa do trabalho perante a banca de professores da Fatec.\n<a href='/assets/knowledge-base/pdf/Geo-PPC.pdf#page=11' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "geo-dispensa-aproveitamento-estudos",
    parentKey: "geo-dispensa",
    title: "Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior",
    content: "É possível solicitar a dispensa de disciplinas cujas cargas horárias e conteúdos já tenham sido cursados em outras instituições de ensino superior.\nA solicitação deve ser realizada pelo SIGA, anexando:\n• Histórico escolar\n• Ementas das disciplinas cursadas\nRequisitos:\n• Disciplinas cursadas nos últimos 10 anos\n• Similaridade ≥ 70% → aprovação direta\n• Similaridade entre 50% e 70% → exame de proficiência\n• Similaridade < 50% → indeferimento\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO I - APROVEITAMENTO DE ESTUDOS\nArtigo 75 - O aproveitamento de estudos é decorrente da equivalência entre componentes curriculares, cumpridos com aprovação em Instituição de Ensino Superior credenciada e com curso superior de graduação autorizado ou reconhecido na forma da Lei.\nParágrafo único - Para fins de aproveitamento de estudos, o aluno deve apresentar o histórico escolar, ementas e o programa ou plano de ensino do componentecurricular concluído nos últimos 10 (dez) anos.\nPara obter a descrição completa acessa o restante do texto na página 25 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=25' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "geo-dispensa-reconhecimento-etec",
    parentKey: "geo-dispensa",
    title: "Reconhecimento de competências – disciplinas cursadas na Etec",
    content: "É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO II - RECONHECIMENTO DE COMPETÊNCIAS\nArtigo 79 - É possível realizar reconhecimento de competências adquiridas em cursos técnicos e profissionalizantes de unidades de ensino do CEETEPS, desde que estejam previamente mapeadas e previstas no sistema acadêmico, com especificação dos componentes curriculares passíveis de reconhecimento, valorizando, assim, saberes e conhecimentos adquiridos em outros níveis de ensino, nos termos da legislação vigente.\nParágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nPara obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=27' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "geo-dispensa-aproveitamento-experiencias",
    parentKey: "geo-dispensa",
    title: "Aproveitamento de conhecimentos e experiências anteriores",
    content: "Para solicitar, é necessário:\n• Diploma(s) ou certificado(s);\n• Realizar exame de proficiência.\nComprovantes aceitos:\n• Declaração da empresa (experiência profissional);\n• Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;\n• Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);\n• Cursos de inglês para habilitação às provas de Inglês II, III, IV, V e VI.\nA solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO III - APROVEITAMENTO DE CONHECIMENTO E EXPERIÊNCIAS ANTERIORES\nArtigo 83 - O aproveitamento de conhecimento e experiências anteriores pode ser utilizado para o aluno obter dispensa de disciplinas, exceto àquelas na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nParágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nPara obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=27' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "geo-dispensa-proficiencia-ingles",
    parentKey: "geo-dispensa",
    title: "Proficiência em Inglês",
    content: "No início do 1º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.\n• Plataforma: NEPLE\n• Uso obrigatório de fones de ouvido\n• Aplicação exclusiva no início do 1º semestre\nNão é possível realizar a prova em outro período do curso.\nA solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO XII - EXAMES DE NIVELAMENTO E RENDIMENTO DE LÍNGUAS ESTRANGEIRAS\nArtigo 86 - Os exames de nivelamento e rendimento de línguas estrangeiras consistem em avaliação que visa mensurar o conhecimento do aluno em línguas estrangeiras, contemplando leitura, gramática, compreensão auditiva e oralidade.\nPara obter a descrição completa acessa o restante do texto na página 28 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=28' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "geo-estagio-duracao",
    parentKey: "geo-estagio",
    title: "Duração do estágio supervisionado",
    content: "Carga horária obrigatória: 180 horas.\nPode iniciar: a partir do 4º semestre.\nPara obter mais orientações acesse a seção \"Estágio Curricular Supervisionado\" do PPC do curso de Geoprocessamento, na página 41.\n<a href='/assets/knowledge-base/pdf/Geo-PPC.pdf#page=41' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "geo-estagio-inicio",
    parentKey: "geo-estagio",
    title: "Início do estágio",
    content: "O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.\nApós obter a vaga, entre em contato com a Secretaria Administrativa (f258adm@cps.sp.gov.br) para solicitar orientações sobre o trâmite necessário para a assinatura do contrato de estágio.",
  },
  {
    key: "geo-estagio-comprovacao",
    parentKey: "geo-estagio",
    title: "Comprovação",
    content: "Após concluir as 180 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio, que deverá ser assinado pelo supervisor e encaminhado ao Professor Orientador.\nAs orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. O modelo do Relatório Final de Estágio está no Anexo F, e o formulário de Avaliação de Estágio está no Anexo G.\n<a href='/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf#page=48' target='_blank' rel='noopener noreferrer'>Abrir Manual de Orientações de Estágio Supervisionado</a>.",
  },
  {
    key: "geo-estagio-equiparacao",
    parentKey: "geo-estagio",
    title: "Equiparação de estágio",
    content: "O estágio pode ser comprovado por meio das seguintes modalidades:\n• Iniciação Científica;\n• Monitoria;\n• Atividade profissional na área.\nAs orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. Os modelos de Relatório Final de Estágio compatíveis com cada modalidade estão disponíveis nos anexos do referido manual.\n<a href='/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf#page=56' target='_blank' rel='noopener noreferrer'>Abrir Manual de Orientações de Estágio Supervisionado</a>.",
  },
  {
    key: "marh-aacc",
    parentKey: "marh",
    title: "Atividades Complementares (AACC)",
    content: "É necessário cumprir 60 horas de Atividades Acadêmico Científico Culturais (AACC).\nO aluno poderá utilizar cursos extracurriculares, cursos de inglês, leitura de livros, participação em feiras como a FEITEC, visitas a museus e exposições, teatro e cinema, trabalho voluntário, visitas técnicas etc.\nPara mais detalhes, acesse a seção de AACC do PPC do curso de MARH, na página 90.\n<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf#page=90' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "marh-datas-importantes",
    parentKey: "marh",
    title: "Datas importantes do semestre",
    content: "• Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026\n• Rematrícula de alunos veteranos: 12 a 18/01/2026\n• Início das aulas: 09/02/2026\n• Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026\n• Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026\n• Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026\n• Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026\n• Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026\n• Exame de nivelamento sem ajuste de horário: 27/02/2026\n• Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026\n• Prazo final para desistência de disciplina (Art. 30): 25/03/2026\n• Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026\n• Término das aulas: 27/06/2026\n• Período de exames finais (Art. 34): 06 a 08/07/2026\nAcesse o calendário com todas as datas importantes para consultar prazos, eventos acadêmicos e períodos letivos completos.\n<a href='/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf#page=1' target='_blank' rel='noopener noreferrer'>Abrir Calendário Acadêmico 2026</a>.",
  },
  {
    key: "marh-disciplinas-remotas",
    parentKey: "marh",
    title: "Disciplinas remotas",
    content: "No 5º semestre:\n• 20% da carga horária de cada disciplina é remota\nNo 6º semestre:\n• Todas as disciplinas são remotas.\nAs aulas são remotas e síncronas, ou seja, o aluno precisa estar presente no momento em que a aula é ministrada. Não confundir com aulas na modalidade EaD, que são remotas e assíncronas.\nPara obter mais orientações sobre a grade de disciplinas, consulte o PPC do curso de MARH, na página 24.\n<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf#page=24' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "marh-dispensa",
    parentKey: "marh",
    title: "Dispensa de disciplinas",
    content: "Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular.\nEscolha a modalidade desejada:",
  },
  {
    key: "marh-estagio",
    parentKey: "marh",
    title: "Estágio",
    content: "Escolha a opção:",
  },
  {
    key: "marh-horario-aulas",
    parentKey: "marh",
    title: "Horário das aulas",
    content: "Qual semestre você deseja consultar?",
  },
  {
    key: "marh-horario-aulas-1-semestre",
    parentKey: "marh-horario-aulas",
    title: "1º semestre",
    content: "Horário de aulas do 1º semestre de Meio Ambiente e Recursos Hídricos.\n<a href='/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf#page=1' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "marh-horario-aulas-2-semestre",
    parentKey: "marh-horario-aulas",
    title: "2º semestre",
    content: "Horário de aulas do 2º semestre de Meio Ambiente e Recursos Hídricos.\n<a href='/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf#page=2' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "marh-horario-aulas-3-semestre",
    parentKey: "marh-horario-aulas",
    title: "3º semestre",
    content: "Horário de aulas do 3º semestre de Meio Ambiente e Recursos Hídricos.\n<a href='/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf#page=3' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "marh-horario-aulas-4-semestre",
    parentKey: "marh-horario-aulas",
    title: "4º semestre",
    content: "Horário de aulas do 4º semestre de Meio Ambiente e Recursos Hídricos.\n<a href='/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf#page=4' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "marh-horario-aulas-5-semestre",
    parentKey: "marh-horario-aulas",
    title: "5º semestre",
    content: "Horário de aulas do 5º semestre de Meio Ambiente e Recursos Hídricos.\n<a href='/assets/knowledge-base/pdf/MARH-Horario-2026-1.pdf#page=5' target='_blank' rel='noopener noreferrer'>Abrir horário do semestre</a>.",
  },
  {
    key: "marh-horario-aulas-6-semestre",
    parentKey: "marh-horario-aulas",
    title: "6º semestre",
    content: "O 6º semestre não está sendo oferecido",
  },
  {
    key: "marh-portfolio",
    parentKey: "marh",
    title: "Portfólio",
    content: "O curso de Meio Ambiente e Recursos Hídricos não possui Portfólio, mas possui o Trabalho de Graduação (TG) que deverá ser iniciado no 5º semestre.\n<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf#page=88' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "marh-portfolio-2",
    parentKey: "marh",
    title: "Trabalho de Graduação (TG/TCC)",
    content: "O Trabalho de Graduação (TG) deve ser iniciado no 5º semestre, na disciplina Projetos Ambientais I, e concluído no 6º semestre, na disciplina Projetos Ambientais II.\nPara iniciar o TG, o aluno deve contar com um professor orientador. Cabe ao aluno procurar um dos professores que possam atuar como orientador e discutir o tema a ser desenvolvido. O aluno pode ter um coorientador externo (fora da Fatec Jacareí).\nO TG deve ser elaborado no formato de artigo científico e apresentado perante uma banca examinadora composta por, no mínimo, três professores.\nO aluno poderá ser dispensado da redação do TG caso apresente artigo científico já publicado em revista ou simpósio, desde que figure como primeiro autor. Nessa situação, deverá apenas realizar a defesa do trabalho perante a banca de professores da Fatec.\n<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf#page=88' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "marh-dispensa-aproveitamento-estudos",
    parentKey: "marh-dispensa",
    title: "Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior",
    content: "É possível solicitar a dispensa de disciplinas cujas cargas horárias e conteúdos já tenham sido cursados em outras instituições de ensino superior.\nA solicitação deve ser realizada pelo SIGA, anexando:\n• Histórico escolar\n• Ementas das disciplinas cursadas\nRequisitos:\n• Disciplinas cursadas nos últimos 10 anos\n• Similaridade ≥ 70% → aprovação direta\n• Similaridade entre 50% e 70% → exame de proficiência\n• Similaridade < 50% → indeferimento\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO I - APROVEITAMENTO DE ESTUDOS\nArtigo 75 - O aproveitamento de estudos é decorrente da equivalência entre componentes curriculares, cumpridos com aprovação em Instituição de Ensino Superior credenciada e com curso superior de graduação autorizado ou reconhecido na forma da Lei.\nParágrafo único - Para fins de aproveitamento de estudos, o aluno deve apresentar o histórico escolar, ementas e o programa ou plano de ensino do componentecurricular concluído nos últimos 10 (dez) anos.\nPara obter a descrição completa acessa o restante do texto na página 25 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=25' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "marh-dispensa-reconhecimento-etec",
    parentKey: "marh-dispensa",
    title: "Reconhecimento de competências – disciplinas cursadas na Etec",
    content: "É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO II - RECONHECIMENTO DE COMPETÊNCIAS\nArtigo 79 - É possível realizar reconhecimento de competências adquiridas em cursos técnicos e profissionalizantes de unidades de ensino do CEETEPS, desde que estejam previamente mapeadas e previstas no sistema acadêmico, com especificação dos componentes curriculares passíveis de reconhecimento, valorizando, assim, saberes e conhecimentos adquiridos em outros níveis de ensino, nos termos da legislação vigente.\nParágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nPara obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=27' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "marh-dispensa-aproveitamento-experiencias",
    parentKey: "marh-dispensa",
    title: "Aproveitamento de conhecimentos e experiências anteriores",
    content: "Para solicitar, é necessário:\n• Diploma(s) ou certificado(s);\n• Realizar exame de proficiência.\nComprovantes aceitos:\n• Declaração da empresa (experiência profissional);\n• Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;\n• Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);\n• Cursos de inglês para habilitação às provas de Inglês II, III e IV.\nA solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO III - APROVEITAMENTO DE CONHECIMENTO E EXPERIÊNCIAS ANTERIORES\nArtigo 83 - O aproveitamento de conhecimento e experiências anteriores pode ser utilizado para o aluno obter dispensa de disciplinas, exceto àquelas na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nParágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.\nPara obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=27' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "marh-dispensa-proficiencia-ingles",
    parentKey: "marh-dispensa",
    title: "Proficiência em Inglês",
    content: "No início do 1º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.\n• Plataforma: NEPLE\n• Uso obrigatório de fones de ouvido\n• Aplicação exclusiva no início do 1º semestre\nNão é possível realizar a prova em outro período do curso.\nA solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.\nRegulamento Geral dos Cursos Superiores das Fatecs\nSEÇÃO XII - EXAMES DE NIVELAMENTO E RENDIMENTO DE LÍNGUAS ESTRANGEIRAS\nArtigo 86 - Os exames de nivelamento e rendimento de línguas estrangeiras consistem em avaliação que visa mensurar o conhecimento do aluno em línguas estrangeiras, contemplando leitura, gramática, compreensão auditiva e oralidade.\nPara obter a descrição completa acessa o restante do texto na página 28 do Regulamento Geral dos Cursos Superiores das Fatecs. \n<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf#page=28' target='_blank' rel='noopener noreferrer'>Abrir Regulamento Geral</a>.",
  },
  {
    key: "marh-estagio-duracao",
    parentKey: "marh-estagio",
    title: "Duração do estágio supervisionado",
    content: "Carga horária obrigatória: 180 horas.\nPode iniciar: a partir do 4º semestre.\nPara obter mais orientações acesse a seção \"7.2 Estágio Curricular Supervisionado\" do PPC do curso de MARH, na página 89.\n<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf#page=89' target='_blank' rel='noopener noreferrer'>Abrir PPC do curso</a>.",
  },
  {
    key: "marh-estagio-inicio",
    parentKey: "marh-estagio",
    title: "Início do estágio",
    content: "O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.\nApós obter a vaga, entre em contato com a Secretaria Administrativa (f258adm@cps.sp.gov.br) para solicitar orientações sobre o trâmite necessário para a assinatura do contrato de estágio.",
  },
  {
    key: "marh-estagio-comprovacao",
    parentKey: "marh-estagio",
    title: "Comprovação",
    content: "Após concluir as 180 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio, que deverá ser assinado pelo supervisor e encaminhado ao Professor Orientador.\nAs orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. O modelo do Relatório Final de Estágio está no Anexo F, e o formulário de Avaliação de Estágio está no Anexo G.\n<a href='/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf#page=48' target='_blank' rel='noopener noreferrer'>Abrir Manual de Orientações de Estágio Supervisionado</a>.",
  },
  {
    key: "marh-estagio-equiparacao",
    parentKey: "marh-estagio",
    title: "Equiparação de estágio",
    content: "O estágio pode ser comprovado por meio das seguintes modalidades:\n• Iniciação Científica;\n• Monitoria;\n• Atividade profissional na área.\nAs orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. Os modelos de Relatório Final de Estágio compatíveis com cada modalidade estão disponíveis nos anexos do referido manual.\n<a href='/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf#page=56' target='_blank' rel='noopener noreferrer'>Abrir Manual de Orientações de Estágio Supervisionado</a>.",
  },
  {
    key: "nao-aluno-cursos-tecnicos",
    parentKey: "nao-sou-aluno",
    title: "A Fatec possui cursos técnicos?",
    content: "A Fatec oferece exclusivamente cursos de graduação tecnológica (ensino superior). Caso você esteja interessado em cursos técnicos de nível médio, recomendamos acessar o site da Etec Jacareí:\n<a href='https://vestibulinho.etec.sp.gov.br/unidades-cursos/escola.asp?c=77' target='_blank' rel='noopener noreferrer'>Acessar site da Etec Jacareí</a>",
  },
  {
    key: "nao-aluno-ingresso",
    parentKey: "nao-sou-aluno",
    title: "Como ingressar na Fatec?",
    content: "O ingresso na Fatec ocorre por meio de vestibular. O processo seletivo é realizado duas vezes ao ano, com ingressos previstos para os meses de fevereiro e agosto.\nPara obter informações detalhadas sobre inscrições e datas, acesse o portal oficial do vestibular:\n<a href='https://vestibular.fatec.sp.gov.br/home' target='_blank' rel='noopener noreferrer'>Acessar portal do vestibular</a>.",
  },
  {
    key: "nao-aluno-matricula",
    parentKey: "nao-sou-aluno",
    title: "Como realizar a matrícula?",
    content: "A matrícula dos candidatos aprovados no vestibular é realizada de forma totalmente online, por meio do portal oficial do vestibular, dentro do prazo estabelecido no calendário do processo seletivo.\nPara obter mais informações acesse o portal oficial do vestibular:\n<a href='https://vestibular.fatec.sp.gov.br/duvidas-frequentes' target='_blank' rel='noopener noreferrer'>Acessar dúvidas frequentes do vestibular</a>.",
  },
  {
    key: "nao-aluno-cursos-oferecidos",
    parentKey: "nao-sou-aluno",
    title: "Cursos oferecidos na Fatec Jacareí",
    content: "A Fatec Jacareí oferece os seguintes cursos de graduação tecnológica:\n• Desenvolvimento de Software Multiplataforma\n• Geoprocessamento\n• Meio Ambiente e Recursos Hídricos\nTodos os cursos são oferecidos no período noturno, das 18h45 às 23h05, e possuem 3 anos de duração (6 semestres).\nPara mais informações acesse a página da Fatec Jacareí:\n<a href='https://fatecjacarei.cps.sp.gov.br' target='_blank' rel='noopener noreferrer'>Acessar site da Fatec Jacareí</a>.",
  },
  {
    key: "nao-aluno-horarios-aulas",
    parentKey: "nao-sou-aluno",
    title: "Horários das aulas",
    content: "As aulas de todos os cursos da Fatec Jacareí ocorrem no período noturno, das 18h45 às 23h05.",
  },
];


async function createAdminUser() {
  const adminEmail = 'admin@fatec.edu';
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    await User.create({
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    } as any);

    console.log('✅ Usuário admin criado: admin@fatec.edu / admin123');
  }
}

async function createChatTree() {
  const count = await ChatNode.count();

  if (count > 0) {
    console.log('ℹ️ Árvore do chatbot já existe. Seed de perguntas ignorado.');
    return;
  }

  const createdNodes = new Map<string, any>();

  const root = await ChatNode.create({
    title: 'Início',
    content: 'Olá! Sou o assistente virtual da Fatec Jacareí. Escolha uma das opções abaixo para começar:',
  } as any);

  createdNodes.set('root', root);

  for (const node of seedNodes) {
    const parent = node.parentKey ? createdNodes.get(node.parentKey) : root;

    if (!parent) {
      console.warn(`⚠️ Nó ignorado porque o pai não foi encontrado: ${node.title} (${node.parentKey})`);
      continue;
    }

    const created = await ChatNode.create({
      title: node.title,
      content: node.content || null,
      parentId: parent.id,
    } as any);

    createdNodes.set(node.key, created);
  }

  console.log(`✅ Árvore do chatbot criada com ${createdNodes.size} nós.`);
}

export async function seedDatabase() {
  console.log('🌱 Iniciando seed simplificado do banco de dados...');

  try {
    await createAdminUser();
    await createChatTree();
    console.log('✨ Seed finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}
