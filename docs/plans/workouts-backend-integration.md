# Integração de treinos com o backend

Substituir o mock de treinos (`components/Workouts/mockData.ts`) pela API real (`natare-api`), com estado de loading e filtros funcionais (semana + status), sem quebrar o `natare-web`.

## Contexto atual

- Mobile mocka treinos em `components/Workouts/mockData.ts` e filtra tudo client-side em `app/(tabs)/workouts.tsx` (semana via `weekOffset`, status via `FilterTabs`).
- Backend `GET /api/workouts` retorna `{ items, meta }` paginado (`limit`/`offset`, ordenado por `scheduled_at desc`), escopado por papel (atleta vê treinos das suas equipes, coach os seus, admin todos).
- `WorkoutResource` expõe: `id, name, description, scheduled_at, created_at, updated_at, unique_athletes_count?, teams?, sections?` (relações só `whenLoaded`; o `index` não as carrega).
- Backend **não** tem: `status`, `icon`, `distance`/`duration` no workout (distância/duração só existem por série em `sections.series`), nem filtros de data/status.

## Decisões

1. **Status** (MVP): `passado = concluído`. Derivado de `scheduled_at`: futuro → `scheduled`, passado → `completed`. `missed` fica como placeholder (tab mantida na UI, sem fonte de presença ainda; ativa quando houver attendance).
2. **Filtros**: server-side. `index` aceita `scheduled_from`, `scheduled_to`, `status`.
3. **Volume no card**: `total_distance` e `total_duration` computados no backend via agregação (não eager load de `sections`).
4. **Ícone por volume** (derivado de `total_distance`, mapeado no front):

   | Faixa | Volume | Ícone (MaterialCommunityIcons) |
   |---|---|---|
   | Leve | < 1.5 km | `pool` |
   | Moderado | 1.5–3 km | `swim` |
   | Intenso | > 3 km | `waves` |

   Fallback (sem distância): `swim`.

## Compatibilidade / impacto no natare-web

O web consome os mesmos endpoints (`WorkoutsService.list(offset, limit)`), lê `items`/`meta` e por item só `id, name, scheduled_at, created_at`. Regras para não quebrá-lo:

- **Params novos sempre opcionais**, com default sem filtro. Web não os envia → resposta idêntica.
- **Só adicionar chaves escalares** novas (`total_distance`, `total_duration`, `status`). Nunca renomear/remover chaves existentes.
- **Totais via agregação** (`withSum`/subquery/scope), **sem** carregar `sections` na lista, para não injetar array pesado no payload do web nem gerar N+1.
- Ordenação e formato `meta` inalterados.

## Fase 1 — Backend (natare-api)

- [x] `WorkoutController@index`: aceitar `scheduled_from`, `scheduled_to`, `status` via query, validados (novo FormRequest ou validação inline). `status ∈ {scheduled, completed, missed}`.
  - `scheduled_from`/`scheduled_to`: `whereBetween('scheduled_at', ...)` quando presentes.
  - `status=scheduled`: `where('scheduled_at', '>=', now())`; `status=completed`: `where('scheduled_at', '<', now())`; `status=missed`: retorna vazio por ora (documentar como pendência).
  - Manter o escopo por papel existente e a paginação `{ items, meta }`.
- [x] Agregar volume sem eager load de `sections`:
  - Adicionar relação `series()` `HasManyThrough` em `Workout` (via `WorkoutSections`), ou scope de agregação.
  - `withSum`/subquery para `total_distance` e `total_duration` (definir fórmula: soma de `series.distance`/`series.duration`, considerar `repetitions` se aplicável ao volume total).
- [x] `WorkoutResource`: expor `total_distance`, `total_duration` e `status` derivado (`scheduled_at >= now ? 'scheduled' : 'completed'`). Aditivo, não altera chaves existentes.
- [x] Atualizar docs Bruno (`docs/NatareApp/Workouts/List workouts.bru`) com os novos query params.

**Critérios de aceite (Fase 1)**
- `GET /api/workouts` sem params → mesma resposta de hoje + 3 campos escalares novos por item.
- `GET /api/workouts?scheduled_from=..&scheduled_to=..&status=scheduled` filtra corretamente.
- Web (`natare-web`) continua listando/paginando sem alteração visível.
- Sem N+1 na listagem (verificar query count).

## Fase 2 — Mobile (natare-mobile)

- [x] `services/workout.service.ts`: classe estática `WorkoutService.list({ from, to, status, offset, limit })`. Tipos `IWorkout` (`id, name, scheduled_at, total_distance, total_duration, status`) e `IWorkoutList` (`{ items, meta }`), seguindo o padrão de `user.service.ts`.
- [x] Tipos/derivações do card em `components/Workouts/types.ts` (ou no service): `status` do backend, `iconForVolume(total_distance)`, formatação de distância/duração.
- [x] `app/(tabs)/workouts.tsx`:
  - Remover `MOCK_WORKOUTS`; buscar via `useEffect` disparado por `weekOffset` e `filter`.
  - Enviar `from`/`to` (bounds da semana via `getWeekBounds`) e `status` (do `FilterTabs`, `all` → sem param).
  - `loading` state; erro tratado com `useSnackbar().snack('Erro ao carregar treinos')` (sem catch silencioso).
  - Split Agendados/Passados por data dentro da semana (mantém lógica atual, agora sobre dados reais).
- [x] Loading: skeleton ou `ActivityIndicator` na `SwipeArea` durante a busca (preservar animação de troca de semana).
- [x] `WorkoutCard`: usar `iconForVolume`, `total_distance`/`total_duration`, `status` derivado.
- [x] `FilterTabs`: `filter` passa a alimentar o param server-side (tab "Perdidos" mantida; retornará vazio até attendance existir).
- [x] Remover `components/Workouts/mockData.ts` e ajustar imports (`WorkoutSection`, `WorkoutCard`).

**Critérios de aceite (Fase 2)**
- Trocar de semana busca no backend com o range correto e mostra loading.
- Filtros (Todos/Agendados/Concluídos/Perdidos) refletem no request e no resultado.
- Erro de rede exibe snackbar visível, sem tela quebrada.
- Card mostra ícone por volume + distância/duração reais.
- Estado vazio preservado quando a semana não tem treinos.

## Pendências / futuro

- **Attendance/presença**: fonte real de `completed`/`missed` por atleta (hoje `missed` é placeholder e `completed` = passado).
- **Modalidade/tipo de treino** no backend (hoje ícone é derivado só de volume).
- Avaliar cache/React Query se o volume de telas com fetch crescer (projeto hoje usa fetch manual).
