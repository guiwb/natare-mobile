# Integração da home do mobile

Substituir o mock dos 4 cards da home (`NextWorkoutCard`, `DayStreakCard`, `LastWorkoutCard`, `ActivityHeatmapCard`) por dados reais, via dois endpoints novos no `natare-api` (`GET /api/home-summary` e `GET /api/activity-heatmap`). Sem impacto no `natare-web`.

## Contexto atual

### Mobile (`natare-mobile`)

`app/(tabs)/index.tsx` renderiza 4 componentes de `components/Home/`, **todos com dado hardcoded** e nenhum fetch:

- `NextWorkoutCard/index.tsx`: badge "Hoje às 17:30", título "Regenerativo", `DataCard` de 8.0 km e 45 min, botão "Marcar como feito" sem `onPress`.
- `DayStreakCard.tsx`: "14 dias".
- `LastWorkoutCard.tsx`: "Ontem" / "8km de natação".
- `ActivityHeatmapCard.tsx`: `generateMockData()` gera níveis 0-4 aleatórios por dia; `buildGrid()` monta a matriz semana x dia (Seg=0); seletor de mês via `UIMenu` (só meses do ano corrente).

Já existem helpers reaproveitáveis em `components/Workouts/types.ts`: `formatDatetime` (Hoje/Amanhã/Ontem), `formatMeters`, `formatTotalDuration`, `iconForVolume`.

Convenções em vigor: fetch manual com `useState` + `try/catch` na tela (ver `app/(tabs)/workouts.tsx`), erro via `useSnackbar().snack(...)`, refetch escutando `DeviceEventEmitter` no evento `workoutCompletionChanged` (emitido por `app/workout/[id].tsx` ao concluir/desmarcar).

### Backend (`natare-api`)

`GET /api/workouts` (`WorkoutController@index`) devolve `{ items, meta }` ordenado por `scheduled_at desc`, com escopo por papel (atleta vê treinos das suas equipes, coach os seus, admin todos) e filtros opcionais `scheduled_from`, `scheduled_to`, `status`.

`WorkoutResource` expõe `id, name, description, scheduled_at, status, completed_at, completions_count, total_distance, total_duration, created_at, updated_at`, mais `unique_athletes_count`, `teams` e `sections` condicionais.

Scopes existentes no `Workout`:
- `withSeriesTotals()`: subqueries de `total_distance` e `total_duration` (soma de `distance|duration * repetitions`).
- `withCompletionAggregates($userId)`: `user_completed_at` (conclusão do usuário autenticado) e `completions_count`.

`WorkoutEntry` guarda `workout_id`, `user_id`, `completed_at` (a fonte de verdade da conclusão). `WorkoutStatusEnum::resolve()` deriva o status.

`POST /api/workouts/{workout}/completion` recusa treino futuro com **422 `WORKOUT_NOT_STARTED`**.

`config('app.timezone')` é `UTC`, mas já existe fuso por empresa: `companies.timezone` (migration `2026_06_26_000003`, default `America/Sao_Paulo`), lido como `$company->timezone ?: config('notifications.timezone_default')` em `DispatchScheduledNotifications`, `WorkoutReminderNotification` e `WorkoutSoonNotification`. Não há fuso por usuário.

### Gaps

| Card | Precisa | Existe hoje |
|---|---|---|
| Próximo treino | treino agendado **mais próximo** não concluído | lista ordena `desc`, então `limit=1` traz o mais distante; não há sinal de "posso concluir" |
| Última atividade | último treino concluído pelo usuário | dá pra aproximar com `?status=completed&limit=1`, mas ordena por `scheduled_at` e não por `completed_at` |
| Day streak | dias em sequência | **não existe** |
| Mapa de atividades | volume agregado por dia do mês | **não existe** agregação diária |

## Decisões

1. **Dois endpoints, separados pela dependência de mês**, sem mexer na lista de treinos:
   - `GET /api/home-summary`: `next_workout`, `last_workout` e `streak`. Não recebe `month`, porque nenhum dos três depende do mês exibido no heatmap.
   - `GET /api/activity-heatmap?month=YYYY-MM`: só a grade do mês.

   Assim trocar de mês busca **apenas** o heatmap, e os outros três cards nunca piscam nem refazem query.
2. **Day streak**: conta dias de treino distintos concluídos, chaveado por `scheduled_at` (o dia em que se treinou) e **não** por `completed_at` (o dia em que o botão foi apertado). Dia sem treino agendado é ignorado (descanso não zera). O streak quebra no primeiro dia passado que tinha treino agendado e não teve conclusão. O dia de hoje nunca quebra (ainda não terminou).

   A chave importa: quem acerta as contas marcando vários treinos antigos de uma vez teria todas as conclusões caindo no mesmo dia, zerando a sequência.
3. **Heatmap**: pinta apenas treinos concluídos, no dia do `scheduled_at` (mesma regra do streak), com **escala relativa ao mês** (nível = quartil sobre a maior distância diária do próprio mês). O backend devolve a distância bruta por dia, o mobile calcula o nível. Cor de nível 0 = dia sem conclusão.
4. **Próximo treino**: primeiro treino não concluído com `scheduled_at >= now()`; se não houver, o mais recente não concluído das últimas 24h (ainda dá pra marcar como feito). O backend devolve `can_complete`, e o botão "Marcar como feito" fica **desabilitado** quando falso, evitando o 422 `WORKOUT_NOT_STARTED`.
5. **Fuso**: o agrupamento por dia (streak e heatmap) usa o fuso **da empresa**, não do device. `companies.timezone` já existe (migration `2026_06_26_000003`, default `America/Sao_Paulo`) e o padrão de leitura já está consolidado em `DispatchScheduledNotifications`, `WorkoutReminderNotification` e `WorkoutSoonNotification`:

   ```php
   $tz = $user->company?->timezone ?: config('notifications.timezone_default');
   ```

   Nenhum endpoint recebe `timezone` por query, e o mobile não envia nada. Fuso por usuário fica como evolução futura (issue aberta no board), e quando existir entra como fallback encadeado sem mudar o contrato.
6. **Coach/admin**: os payloads mantêm a mesma forma. Como coach não tem `WorkoutEntry`, `last_workout` vem `null`, `streak.days` = 0 e `days` do heatmap vazio; `next_workout` usa o escopo de papel já existente (os treinos que ele criou). O mobile esconde os cards vazios em vez de mostrar zeros.
7. **Estados vazios**: há três combinações, tratadas de formas diferentes.

   | Caso | `next_workout` | `last_workout` | Quando | Tratamento |
   |---|---|---|---|---|
   | 1 | `null` | `null` | atleta novo, sem equipe ou sem treinos | **card único de boas-vindas** substitui os três cards do summary; heatmap continua abaixo, vazio |
   | 2 | `null` | preenchido | concluiu tudo que estava agendado | `AllCaughtUpCard`, estado verde e alto de "Tudo em dia!"; streak e última atividade normais |
   | 3 | preenchido | `null` | tem treino marcado, nunca concluiu | card de próximo normal; última atividade com "Nenhuma atividade ainda"; streak em 0 |

   No caso 1 o heatmap **continua visível** (vazio), para o usuário descobrir que ele existe.
8. **Pós-conclusão pela home**: overlay de sucesso em tela cheia, fundo verde, no espírito da confirmação de pagamento do Mercado Livre.
   - Dispara **imediatamente** no sucesso do `POST /completion`, com o que já está em mãos (check + "Treino concluído!"). Não espera request nenhuma para começar.
   - O refetch do summary roda **por baixo**, e o bloco de streak (`🔥 15 dias em sequência`) entra na tela quando a resposta chega.
   - Duração: auto-dismiss em **10s**, e o usuário pode fechar antes a qualquer momento (toque em qualquer lugar, botão "Fechar" ou back do Android). Com 10s o refetch sempre chega antes, então o streak praticamente nunca fica de fora; se falhar, o overlay sai sem ele e a home atualiza sozinha depois.
   - O overlay é dono do próprio ciclo de vida (timer e dismiss); a tela só o abre e dispara o refetch.
   - Só na home nesta fase. `app/workout/[id].tsx` continua com snackbar (ver Pendências).

### Contrato

```
GET /api/home-summary

{
  "next_workout": {
    "id": "uuid",
    "name": "Regenerativo",
    "scheduled_at": "2026-08-05T17:30:00.000000Z",
    "total_distance": 8000,
    "total_duration": 2700,
    "can_complete": false
  } | null,
  "last_workout": {
    "id": "uuid",
    "name": "Série longa",
    "scheduled_at": "2026-08-04T07:00:00.000000Z",
    "completed_at": "2026-08-04T19:12:00.000000Z",
    "total_distance": 8000,
    "total_duration": 2700
  } | null,
  "streak": {
    "days": 14,
    "last_activity_date": "2026-08-04"
  }
}
```

```
GET /api/activity-heatmap?month=2026-08

{
  "month": "2026-08",
  "days": [
    { "date": "2026-08-01", "distance": 3200, "duration": 1800, "count": 1 }
  ]
}
```

`days` traz **somente dias com conclusão** (dias sem atividade são omitidos, o mobile preenche com nível 0). `distance` e `duration` em metros e segundos, mesma convenção da lista de treinos. `month` é opcional e cai no mês corrente.

## Compatibilidade / impacto

- **`natare-web`**: consome `WorkoutsService.list(offset, limit)` e `get/create/update/delete` por id, lendo só `id, name, scheduled_at, created_at`. O endpoint é **novo e aditivo**, e nenhum contrato existente muda. Impacto zero.
- **Não alterar** a ordenação default de `GET /api/workouts` (`scheduled_at desc`): o web depende dela na listagem. O "próximo treino" resolve a ordenação dentro do novo endpoint, não na lista.
- Se o escopo por papel for extraído de `WorkoutController@index` para um scope reutilizável (`scopeVisibleTo`), o comportamento da lista precisa ficar **idêntico** (mesmas queries, mesmos resultados por papel), coberto pelo `WorkoutIndexFilterTest`.
- Nenhuma chave existente do `WorkoutResource` é renomeada, removida ou re-tipada.

## Fase 1 — Backend (natare-api)

- [x] Extrair o escopo por papel de `WorkoutController@index` para `Workout::scopeVisibleTo(Builder $query, User $user)` (atleta por `team_id`, coach por `coach_id`, admin sem filtro) e usar o scope tanto no `index` quanto no novo serviço. Comportamento da lista inalterado.
- [x] `app/Http/Requests/ActivityHeatmapRequest.php`: `month` `nullable|date_format:Y-m` (default: mês corrente). `home-summary` não tem params, então dispensa FormRequest.
- [x] Resolver o fuso a partir da empresa do usuário autenticado (`$user->company?->timezone ?: config('notifications.timezone_default')`), no mesmo padrão de `DispatchScheduledNotifications`. Se o trecho se repetir, extrair para um helper único e reaproveitar nos notifications.
- [x] `app/Services/HomeSummaryService.php`, com um método por bloco:
  - `nextWorkout(User $user)`: `visibleTo` + `withSeriesTotals` + `withCompletionAggregates`, `whereDoesntHave('entries', completedBy($user))`, `where('scheduled_at', '>=', now())`, `orderBy('scheduled_at', 'asc')`, `first()`. Fallback: mesmo filtro com `scheduled_at` entre `now()->subDay()` e `now()`, ordenado `desc`. `can_complete` = existe treino **e** `scheduled_at <= now()` **e** o usuário passa na policy `complete`.
  - `lastWorkout(User $user)`: `WorkoutEntry` do usuário com `completed_at` não nulo, `orderBy('completed_at', 'desc')`, `first()`; carregar o `Workout` com `withSeriesTotals()`.
  - `streak(User $user, string $tz)`: datas distintas de conclusão (convertidas para `$tz`) em ordem decrescente + datas com treino agendado visível ao usuário. Caminhar de hoje para trás: dia com conclusão soma 1; dia sem conclusão e sem treino agendado é pulado; dia passado com treino agendado e sem conclusão encerra o streak. Hoje nunca encerra. Limitar a janela de varredura (ex.: 366 dias).
- [x] `app/Services/ActivityHeatmapService.php`, com `forMonth(User $user, CarbonImmutable $month, string $tz)`: treinos concluídos pelo usuário dentro do mês (`completed_at` entre início e fim do mês no `$tz`), com `withSeriesTotals()`; agrupar em PHP por data local somando `distance`, `duration` e `count`. Volume mensal é pequeno, não precisa de `GROUP BY` em SQL.
- [x] `app/Http/Resources/HomeSummaryResource.php` e `app/Http/Resources/ActivityHeatmapResource.php`: montam os JSONs acima. Datas ISO, `days[].date` como `YYYY-MM-DD`.
- [x] `app/Http/Controllers/Api/HomeSummaryController.php` e `app/Http/Controllers/Api/ActivityHeatmapController.php`: invokáveis e finos, só validam, chamam o serviço e devolvem o resource.
- [x] `routes/api.php`, dentro do grupo `auth:sanctum`:
  - `Route::get('home-summary', HomeSummaryController::class)`
  - `Route::get('activity-heatmap', ActivityHeatmapController::class)`
- [x] `docs/NatareApp/Home/folder.bru`, `docs/NatareApp/Home/Summary.bru` e `docs/NatareApp/Home/Activity heatmap.bru`: documentar `month`, a forma de cada resposta, a regra do streak, o significado de `can_complete` e que o agrupamento por dia usa o fuso da empresa.
- [x] `tests/Feature/HomeSummaryTest.php` e `tests/Feature/ActivityHeatmapTest.php`.

**Critérios de aceite (Fase 1)**

- `GET /api/home-summary` sem params responde 200 com os 3 blocos e **não** aceita nem reage a `month`.
- `GET /api/activity-heatmap` sem params responde 200 com o mês corrente; com `month=2026-07` responde só julho.
- `next_workout` é o agendado mais próximo no futuro; quando só existe treino atrasado nas últimas 24h, é ele; quando nada se aplica, `null`.
- `can_complete` é `false` para treino futuro e `true` para treino já iniciado e não concluído. Marcar via `POST /workouts/{id}/completion` com `can_complete: true` nunca retorna 422.
- Streak: atleta que treina seg/qua/sex e concluiu as 3 últimas sessões tem `days: 3`. Um treino agendado e não concluído no passado zera a contagem a partir dali. Um dia sem treino agendado não quebra.
- Heatmap: só dias com conclusão, distância batendo com a soma de `distance * repetitions` das séries.
- Fuso da empresa aplicado: com `companies.timezone = America/Sao_Paulo`, uma conclusão em 2026-08-01T02:00Z cai no dia **2026-07-31**. Empresa com fuso diferente (ex.: `UTC`) muda o agrupamento de streak e heatmap de acordo, e empresa com `timezone` nulo cai em `config('notifications.timezone_default')`.
- Isolamento por empresa e escopo por papel respeitados (atleta não vê treino de outra equipe).
- `WorkoutIndexFilterTest` continua verde após a extração do `scopeVisibleTo`.
- Sem N+1: a rota executa um número constante de queries.

## Fase 2 — Mobile (natare-mobile)

- [x] `services/home.service.ts`: classe estática `HomeService` no padrão de `workout.service.ts`, usando o `http` compartilhado.
  - Tipos `IHomeSummary`, `INextWorkout`, `ILastWorkout`, `IStreak`, `IActivityHeatmap`, `IHeatmapDay`.
  - `static async summary(): Promise<IHomeSummary>`.
  - `static async heatmap(params: { month: string }): Promise<IActivityHeatmap>`.
  - Sem lógica de fuso no cliente: o backend agrupa pelo fuso da empresa e devolve `date` já como `YYYY-MM-DD` local. O mobile trata essas strings como data pura, sem `new Date()` (que reinterpretaria em UTC e deslocaria a célula do heatmap).
- [x] `app/(tabs)/index.tsx`: buscar **só o summary** com `useState` + `try/catch`, no padrão de `workouts.tsx`.
  - Não guarda estado de mês: o mês pertence à `ActivityHeatmapCard`.
  - Refetch ao receber `DeviceEventEmitter` `workoutCompletionChanged`, expondo uma versão que devolve `Promise` (o overlay precisa saber quando o streak novo chegou).
  - Erro via `useSnackbar().snack('Erro ao carregar a home')`, sem catch silencioso.
  - Quando `next_workout` e `last_workout` são `null` e `streak.days` é 0, renderizar `HomeEmptyState` no lugar dos três cards; heatmap segue sendo renderizado.
  - Hospedar o `WorkoutCompletedOverlay` (precisa cobrir a tab bar).
  - Passar dados e `loading` por props para os três cards do summary (componentes seguem burros).
- [x] `components/Home/HomeEmptyState.tsx` (novo): card único de boas-vindas para o caso 1. Ícone de natação, "Nenhum treino por aqui ainda", texto explicando que os treinos aparecem quando o técnico agendar, e `UIButton` "Ver meus treinos" navegando para `/(tabs)/workouts`.
- [x] `components/Home/WorkoutCompletedOverlay.tsx` (novo): overlay de sucesso em tela cheia.
  - `Modal` transparente (cobre a tab bar) + `Animated.View` de fundo verde com fade-in; check em `react-native-paper` `Icon` entrando com spring de escala (`react-native-reanimated`, já instalado, sem dependência nova).
  - `expo-haptics` (`notificationAsync(Success)`) no início, também já instalado.
  - Props: `visible`, `workout` (nome/volume, opcional na tela) e `streakDays: number | null`. O bloco de streak entra com fade quando `streakDays` deixa de ser `null`.
  - Timing: piso de 1,6s, teto de 3s. Sai quando `max(pisoDecorrido, refetchResolvido)`, com fade-out; estourou o teto, sai sem o streak.
  - Bloquear o botão voltar do Android enquanto visível.
- [x] `components/Home/NextWorkoutCard/index.tsx`:
  - Props `workout: INextWorkout | null`, `loading` e `onCompleted`.
  - Badge com `formatDatetime`, título com `name`, ícone com `iconForVolume(total_distance)`.
  - `DataCard`s com `formatMeters(total_distance)` e `formatTotalDuration(total_duration)`.
  - Botão chama `WorkoutService.complete(id)`; no **sucesso** chama `onCompleted(workout)` (a tela abre o overlay e dispara o refetch) e emite `workoutCompletionChanged`. Sem snackbar de sucesso: o overlay já é a confirmação. Snackbar continua no **erro**.
  - `disabled` quando `can_complete` é falso, e durante a request em voo (evita conclusão dupla).
  - Card navega para `/workout/[id]` ao tocar.
  - Estado vazio (caso 2): "Nenhum treino agendado" no lugar do conteúdo.
- [x] `components/Home/DayStreakCard.tsx`: prop `streak: IStreak`, plural correto ("1 dia" / "N dias"), `0` sem quebrar layout.
- [x] `components/Home/LastWorkoutCard.tsx`: prop `workout: ILastWorkout | null`; título com `formatDatetime(new Date(completed_at))` e subtítulo com `formatMeters(total_distance)` (ex.: "8,0 km de natação"). Estado vazio (caso 3): "Nenhuma atividade ainda".
- [x] `components/Home/ActivityHeatmapCard.tsx`: **único card que busca o próprio dado**, porque é o único que depende do mês.
  - Remover `generateMockData`.
  - Manter o `selectedMonth` local (como já é hoje) e buscar via `HomeService.heatmap` num `useEffect` disparado por ele; loading próprio, só na grade, sem afetar os outros cards.
  - Escutar `workoutCompletionChanged` também, para refletir uma conclusão do dia.
  - Erro via `useSnackbar().snack('Erro ao carregar o mapa de atividades')`.
  - Nova função `levelsFromDays(days)`: `max = maior distance do mês`; dia sem registro tem nível 0; caso contrário `nível = clamp(ceil((distance / max) * 4), 1, 4)`.
  - `buildGrid` passa a consumir esse mapa (a assinatura atual `Record<string, number>` já serve, muda só a origem do dado).
- [x] Textos de UI em pt-BR, sem comentários supérfluos, styled-components (nada de `StyleSheet` inline).

**Critérios de aceite (Fase 2)**

- Home faz **duas** requests ao montar (summary + heatmap do mês corrente); nenhum dado hardcoded sobra em `components/Home/`.
- Concluir o treino pelo `NextWorkoutCard` abre o overlay verde na hora (sem esperar o refetch), o streak novo aparece dentro dele, e ao sair a home já mostra o próximo treino, a última atividade atualizada e a célula de hoje pintada no heatmap. A aba Treinos também reflete a mudança (evento compartilhado).
- Overlay respeita o piso de 1,6s e o teto de 3s: com rede lenta ou refetch falhando, ele sai sozinho sem travar a tela e sem exibir streak errado.
- Toque duplo no botão não gera duas conclusões.
- Conta nova (sem próximo, sem último, streak 0) mostra o card de boas-vindas com CTA funcional para a aba Treinos, e o heatmap vazio logo abaixo.
- Casos 2 e 3 mostram o card vazio correspondente sem quebrar o layout lado a lado de streak e última atividade.
- Concluir/desmarcar em `app/workout/[id].tsx` atualiza a home ao voltar (lá continua com snackbar, sem overlay).
- Botão "Marcar como feito" aparece desabilitado para treino que ainda não começou.
- Trocar de mês no heatmap dispara **só** `GET /api/activity-heatmap`: os cards de próximo treino, streak e última atividade não refazem request, não entram em loading e não remontam.
- Com backend fora do ar, a home mostra snackbar de erro e estados vazios, sem crash e sem tela em branco.
- `npm run lint` limpo.

## Pendências / futuro

- Seletor de mês do heatmap está preso ao ano corrente. Navegação entre anos fica para depois.
- **Overlay só na home**: concluir por `app/workout/[id].tsx` ou pela aba Treinos continua dando só snackbar. Se o feedback verde pegar bem, promover `WorkoutCompletedOverlay` para `components/UI/` e usar nos dois lugares.
- Overlay não oferece "Desfazer". Desmarcar segue só pelo detalhe do treino.
- Sem tratamento de "reduzir movimento" do sistema. Se virar problema de acessibilidade, respeitar `AccessibilityInfo.isReduceMotionEnabled()` e cair num fade simples.
- Streak não tem "congelamento" nem tolerância configurável; a regra de descanso é implícita (dia sem treino agendado).
- `last_workout` não mostra o tipo de nado. O texto "de natação" fica fixo até existir um campo de modalidade no treino.
- Heatmap não distingue treino perdido de dia sem treino. Uma cor para `missed` exige mudar paleta e legenda do card.
- Pull-to-refresh vive no `UIScreen` (props opcionais `refreshing`/`onRefresh`), então qualquer tela pode adotar. Só a home usa por ora.
- Sem cache local: toda entrada na aba refaz a request. Avaliar `react-query` ou cache em memória se a home ficar pesada.
- **Fuso por usuário**: hoje só existe `companies.timezone`, então um atleta viajando ou de outro estado vê streak e heatmap agrupados pelo fuso da equipe. Issue no board para permitir configuração por usuário, com fallback `user.timezone ?: company.timezone ?: config(...)`.
- `natare-web` não consome o `home-summary`. Se a dashboard web precisar dos mesmos números depois, o endpoint já serve sem mudanças.
