# Frontend

## Responsabilidade da pasta

A pasta `app/frontend` contém a interface web do sistema de autoatendimento da Secretaria Acadêmica da Fatec Jacareí. O módulo é responsável por apresentar o chatbot ao usuário, permitir a navegação guiada pela árvore de perguntas e respostas, controlar o login administrativo e disponibilizar telas de gestão para nós, dúvidas e logs.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

## Organização interna

```text
app/frontend/
├── public/              # Imagens e arquivos estáticos servidos pelo frontend
├── src/                 # Código-fonte da aplicação React
│   ├── components/      # Componentes reutilizáveis e componentes de tela
│   ├── contexts/        # Contextos globais, como autenticação
│   ├── hooks/           # Hooks customizados com regras de interface e consumo de dados
│   ├── pages/           # Páginas administrativas e telas principais
│   ├── services/        # Serviços de comunicação com a API backend
│   ├── types/           # Tipagens compartilhadas do frontend
│   └── utils/           # Funções utilitárias, configuração de API e sanitização
├── Dockerfile           # Build da aplicação para execução em container
├── nginx.conf           # Configuração do Nginx usado no container final
├── package.json         # Dependências e scripts do frontend
├── tsconfig.json        # Configuração TypeScript
└── vite.config.ts       # Configuração do Vite
```

## Principais fluxos

- O usuário acessa o chatbot e navega por opções estruturadas.
- O frontend consulta o backend para carregar nós da árvore de atendimento.
- Quando necessário, o usuário registra uma dúvida para análise da equipe administrativa.
- Usuários administrativos acessam telas protegidas para manutenção de conteúdos, dúvidas e logs.

## Scripts úteis

Executar em modo desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Visualizar build localmente:

```bash
npm run preview
```

## Execução com Docker Compose

No fluxo principal do projeto, o frontend é executado junto aos demais serviços a partir da pasta `app`:

```bash
cd app
docker compose up --build -d
```

Após a inicialização, a interface fica disponível em:

```text
http://localhost:3000
```
