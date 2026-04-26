# TODO - Correções para Sistema 100% Funcional

## Passos Aprovados

- [x] 1. Corrigir `backend/src/config/seed.ts` — remover campo `name` inexistente no modelo User
- [x] 2. Corrigir `backend/src/models/index.ts` — adicionar `.js` nos imports (ESM Node16)
- [x] 3. Corrigir `backend/src/models/User.ts` — simplificar tipagem do modelo
- [x] 4. Corrigir `backend/src/models/Node.ts` — FK `model: 'Node'` (consistência com modelName)
- [x] 5. Corrigir `backend/package.json` — script `db:sync` com extensão `.ts`
- [x] 6. Corrigir `backend/src/config/database.ts` — consistência ESM no import dotenv
- [x] 7. Remover `backend/temp_check_user.ts`
- [x] 8. Corrigir `frontend/vite.config.ts` — adicionar proxy para `/api`
- [x] 9. Corrigir `frontend/src/components/Chat.tsx` — remover `parentTitle` não utilizada
- [x] 10. Corrigir `frontend/src/pages/AdminInquiries.tsx` — remover `MessageCircle` não usado
- [x] 11. Corrigir `frontend/src/pages/AdminNodes.tsx` — remover `ChevronRight` não usado
- [x] 12. Corrigir `frontend/package.json` — fixar versões reais de dependências
- [x] 13. Atualizar `.env.example` — adicionar campos faltantes
- [x] 14. Testar build do backend (`npm run build`) — SUCESSO
- [x] 15. Testar build do frontend (`npm run build`) — SUCESSO
- [ ] 16. Testar Docker Compose (`docker compose up --build`)

