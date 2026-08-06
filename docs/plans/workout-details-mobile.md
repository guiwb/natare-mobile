# Detalhes do treino no mobile

Abrir uma tela de detalhes ao tocar num treino da listagem (`natare-mobile`), exibindo as seções e séries, com botão para marcar/desmarcar a conclusão. Backend (`natare-api`) já tem os endpoints; falta apenas expor os totais no `show`.

## Contexto atual

### natare-api (endpoints já existentes)

- `GET /api/workouts/{id}` (`WorkoutController@show`): autoriza via `WorkoutPolicy::view` (atleta precisa pertencer a uma equipe atrelada ao treino), aplica `withCompletionAggregates($user->id)` e carrega `teams` (com contagem de atletas ativos) + `sections.series`.
- `POST /api/workouts/{workout}/completion` e `DELETE /api/workouts/{workout}/completion` (`WorkoutCompletionController`): sem body, idempotentes, autorizados por `WorkoutPolicy::complete` (vínculo de equipe), retornam `WorkoutResource` já com os agregados de conclusão do usuário logado.
- `WorkoutResource` expõe `id`, `name`, `description`, `scheduled_at`, `status`, `completed_at`, `completions_count`, `total_distance?`, `total_duration?`, `created_at`, `updated_at`, `unique_athletes_count?`, `teams?`, `sections?`.
- `WorkoutStatusEnum::resolve` já dá status pessoal para quem não é coach (`completed` se tem `completed_at`, senão `missed`/`scheduled` pela data).
- Shape das séries: `distance`, `repetitions`, `duration`, `equipment` (array json), `intensity_zone`, `swim_stroke`, `notes`, `position`. Seção: `name`, `position`, `interval`.
- Os enums de `app/Enums/` (`SwimStrokeEnum`, `IntensityZoneEnum`, `WorkoutStatusEnum`, `UserRoleEnum`) são a fonte da verdade dos **valores**: validados nas FormRequests (`new Enum(...)`) e com CHECK constraint no Postgres (`workout_section_series_intensity_zone_check` / `_swim_stroke_check`). Nenhum rótulo pt-BR mora no backend, e assim permanece.
- `equipment` é campo livre: `nullable|array` + `equipment.* => string|max:100`, sem enum e sem CHECK.
- **Gap único**: o `addSelect` de `total_distance` / `total_duration` (subquery `seriesSum`) só existe no `index`. No `show` e nas respostas de completion esses campos vêm nulos e o `whenNotNull` do resource os omite do payload.

### natare-mobile

- `app/(tabs)/workouts.tsx` lista por semana (`weekOffset`) e filtro de status, com fetch manual (`useState` + `try/catch` + `snack`).
- `components/Workouts/WorkoutCard.tsx` usa `UICard` (que já é `Pressable` e aceita `onPress`), mas hoje não navega.
- `components/Workouts/types.ts` mapeia `IWorkout` para o tipo de card (`toWorkout`), sem `completed_at` nem seções.
- `services/workout.service.ts` só tem `list()`. Não existem tipos de seção/série nem nenhum rótulo pt-BR de enum.

### natare-web

- Consome `GET /api/workouts/{id}` em `src/services/workouts.service.ts`, tipa em `src/types/workout.ts` (`Workout`, `Section`, `Serie`). Não lê `status`, `completed_at` nem os totais.
- Traduz os enums em `src/constants/workout.js` (`SWIM_STROKE_MAP`, `INTENSITY_ZONE_MAP`, `EQUIPMENT_MAP`), consumido pelos selects de formulário e por `src/utils/shareWorkout.js`, que já usa o padrão `MAP[value]?.label ?? value`. Os valores desse arquivo batem exatamente com `SwimStrokeEnum` e `IntensityZoneEnum` do backend.
- **`src/types/workout.ts` está defasado** em relação aos constants e ao backend: declara `AT`, `VO2`, `LP`, `LT` em `IntensityZoneEnum` (não existem em lugar nenhum) e não declara `A3`, `A4`, `SOLTO`, `PROGRESSIVE`, `STYLE`, `LEG_STROKE`, `DRILL`. É só tipagem, não afeta runtime.
- Rótulos de status de treino aparecem hardcoded e espalhados (`src/pages/Authed/Home/UpcomingList.jsx`, `src/pages/Authed/Notifications/index.jsx`), sem um mapa canônico.

## Decisões

1. **Totais no backend**: reaproveitar o mesmo subquery `seriesSum` do `index` no `show`, para manter uma fonte de verdade só e não divergir do valor exibido no card da listagem. Mudança aditiva e única alteração de backend do plano.
2. **Rótulo é responsabilidade do front**: o backend persiste e devolve o valor cru (`FREESTYLE`, `A1`, `PADDLES`, `missed`) e nada mais. Nenhuma chave `*_label` nos resources, nenhum método `label()` nos enums, nenhum endpoint de metadados. Tradução é camada de apresentação e cada cliente resolve a sua, com o vocabulário e o tom que a interface dele pede.
3. **Mobile ganha `constants/workout.ts`** espelhando `natare-web/src/constants/workout.js`, com o mesmo padrão de consumo já usado lá (`MAP[value]?.label ?? value`). Fallback para o valor cru é obrigatório: valor novo no backend nunca pode quebrar a tela.
4. **`equipment` continua campo livre**, sem enum, sem validação nova e sem CHECK constraint. Quem restringe o vocabulário é o web, que é a interface do treinador e só escreve via toggle de chips (`natare-web/src/components/Workouts/SerieItem.jsx`, alimentado por `EQUIPMENT_OPTIONS`). O mobile só lê, então basta traduzir o que chegar.
5. **Só conclui treino que já começou**: marcar exige `scheduled_at <= now`. Backend rejeita treino futuro com `422 { "message": "WORKOUT_NOT_STARTED" }` e o mobile desabilita o botão antes do horário, explicando o motivo. Desmarcar não tem restrição de data (o treino já estava concluído, logo já tinha começado). Treino sem `scheduled_at` pode ser marcado a qualquer momento.
6. **Botão sempre visível**: o mobile é exclusivo de atletas, então não há tratamento de role na UI. O 403 da policy continua sendo o guarda-corpo do servidor e cai no `catch` genérico com snackbar.
7. **Refetch condicional da listagem**: só recarregar a semana se o usuário tiver alterado a conclusão. Voltar sem alterar nada não dispara request. Sinal via `DeviceEventEmitter` (padrão já usado no projeto para `on401`), evento `workoutCompletionChanged`.
8. **Rota stack** `app/workout/[id].tsx`, fora das tabs, registrada no `Stack` do `app/_layout.tsx`.
9. **Merge, não replace**: as respostas de `POST`/`DELETE /completion` não trazem `sections` (nem os totais). A tela de detalhes aplica só os campos escalares de conclusão (`status`, `completed_at`, `completions_count`) sobre o estado atual, preservando as seções já carregadas.
10. **Sem atualização otimista**: o botão entra em loading durante a request e o estado só muda com a resposta. Menos código e sem risco de divergir do servidor num toggle rápido.

## Vocabulário pt-BR

Valores definidos pelos enums do backend, rótulos definidos por cliente. Referência canônica para `constants/workout.ts` do mobile, portada de `natare-web/src/constants/workout.js`:

| `swim_stroke` | Rótulo | | `intensity_zone` | Rótulo | | `equipment` | Rótulo |
|---|---|---|---|---|---|---|---|
| `FREESTYLE` | Livre | | `A1` | A1 | | `FINS` | Pé de pato |
| `CRAWL` | Crawl | | `A2` | A2 | | `PADDLES` | Palmar |
| `STYLE` | Estilo | | `A3` | A3 | | `PULL_BUOY` | Flutuador |
| `LEG_STROKE` | Perna | | `A4` | A4 | | `KICKBOARD` | Prancha |
| `BACKSTROKE` | Costas | | `SOLTO` | Solto | | `SNORKEL` | Snorkel |
| `BREASTSTROKE` | Peito | | `PROGRESSIVE` | Progressivo | | `PARACHUTE` | Paraquedas |
| `BUTTERFLY` | Borboleta | | `SPEED` | Velocidade | | | |
| `INDIVIDUAL_MEDLEY` | Medley | | | | | | |
| `MEDLEY_RELAY` | Revezamento | | | | | | |
| `DRILL` | Educativo | | | | | | |

Enums que não tinham tradução em lugar nenhum, definidos agora:

| `WorkoutStatusEnum` | Rótulo | | `UserRoleEnum` | Rótulo |
|---|---|---|---|---|
| `scheduled` | Agendado | | `ATHLETE` | Atleta |
| `completed` | Concluído | | `COACH` | Treinador |
| `missed` | Perdido | | `ADMIN` | Administrador |
| | | | `SUPERADMIN` | Superadmin |

`UserRoleEnum` fica registrado aqui como referência, mas **não entra no código** desta feature: nenhuma tela do mobile exibe papel hoje. Quem precisar primeiro adiciona o mapa no seu cliente.

## Compatibilidade / impacto

- **natare-web**: a única mudança de backend é o acréscimo de `total_distance` e `total_duration` no payload do `show`. São chaves escalares novas, não declaradas em `src/types/workout.ts`, e o TypeScript ignora chaves extras em runtime. Nada quebra e `constants/workout.js` segue intocado.
- Nenhum query param novo, nenhuma rota nova, nenhuma validação mais restritiva, nenhuma migration.
- Ordenação e shape `{ items, meta }` do `index` intocados. Os totais continuam vindo de subquery (não eager load), sem N+1.
- Os endpoints de completion já existem; esta fase não muda o comportamento deles.
- **Custo aceito**: o vocabulário passa a existir em dois repositórios. A regra que segura isso é o fallback `?? value`, que degrada para o valor cru em vez de quebrar. Ver pendências.

## Fase 1 — Backend (natare-api)

- [ ] `app/Models/Workout.php`: novo `scopeWithSeriesTotals(Builder $query): void` com os dois `addSelect` hoje inline no `index` (`total_distance`, `total_duration`).
- [ ] `app/Http/Controllers/Api/WorkoutController.php`: `index` passa a usar o scope no lugar do closure `$seriesSum` local; `show` passa a aplicá-lo também.
- [ ] `docs/NatareApp/Workouts/Get workout by ID.bru`: documentar o payload de resposta (`status`, `completed_at`, `completions_count`, `total_distance`, `total_duration`, `sections[].series[]`).
- [ ] Teste: `GET /api/workouts/{id}` retorna `total_distance` e `total_duration` coerentes com a soma de `distance * repetitions` e `duration * repetitions` das séries.
- [ ] `./vendor/bin/pint`

### Critérios de aceite

- `GET /api/workouts/{id}` retorna `total_distance` e `total_duration` iguais aos do item correspondente em `GET /api/workouts`.
- Treino sem seções retorna `0` em ambos (o `COALESCE` já garante), não `null`.
- Atleta sem vínculo com nenhuma equipe do treino continua recebendo 403 no `show`.
- Nenhuma chave existente do payload mudou de nome ou tipo; o web continua funcionando sem alteração.

## Fase 2 — Mobile (natare-mobile)

### Serviço e tipos

- [ ] `services/workout.service.ts`
  - `IWorkoutSerie`: `id`, `position`, `workout_section_id`, `distance`, `repetitions`, `duration`, `equipment?: string[]`, `intensity_zone`, `swim_stroke`, `notes?`.
  - `IWorkoutSection`: `id`, `name`, `position`, `interval`, `workout_id`, `series: IWorkoutSerie[]`.
  - `IWorkout`: adicionar `completed_at?: string | null`, `completions_count?: number`, `sections?: IWorkoutSection[]`.
  - `static async get(id: string): Promise<IWorkout>` → `GET /api/workouts/${id}`.
  - `static async complete(id: string): Promise<IWorkout>` → `POST /api/workouts/${id}/completion`.
  - `static async uncomplete(id: string): Promise<IWorkout>` → `DELETE /api/workouts/${id}/completion`.

### Vocabulário

- [ ] `constants/workout.ts`: `SWIM_STROKE_LABELS`, `INTENSITY_ZONE_LABELS`, `EQUIPMENT_LABELS` e `WORKOUT_STATUS_LABELS` como `Record<string, string>`, com os rótulos da tabela acima.
- [ ] Helper de leitura com fallback (`labelFor(map, value)` → `map[value] ?? value`), usado em todo lugar. Nenhum acesso direto ao mapa nos componentes.

### Navegação

- [ ] `app/_layout.tsx`: registrar `<Stack.Screen name="workout/[id]" />`.
- [ ] `components/Workouts/WorkoutCard.tsx`: receber `onPress` (ou usar `useRouter` direto) e navegar para `/workout/${workout.id}`.
- [ ] `components/Workouts/WorkoutSection.tsx`: repassar a navegação para cada `WorkoutCard`.

### Tela de detalhes

- [ ] `app/workout/[id].tsx`
  - `useLocalSearchParams<{ id: string }>()`, fetch manual em `useEffect` com `loading` inicial e flag `active` no cleanup (mesmo padrão de `app/(tabs)/workouts.tsx`).
  - Erro no carregamento: `snack('Erro ao carregar o treino')` e volta para a listagem (ou estado de erro na tela, sem catch silencioso).
  - Header próprio com botão de voltar (`router.back()`), reaproveitando `UIScreen` via prop `header`.
  - Conteúdo: nome, `description`, data formatada (extrair `formatDatetime` de `WorkoutCard` para um util compartilhado, evitando duplicar), badge de status via `WORKOUT_STATUS_LABELS` e resumo de volume (`total_distance` em km, `total_duration` em min).
  - Seções ordenadas por `position`, cada uma com nome, `interval` e suas séries ordenadas por `position`.
- [ ] `components/Workouts/SectionCard.tsx` e `components/Workouts/SerieRow.tsx` com `styled-components/native` (sem `StyleSheet` inline).
- [ ] Formatação da série: `{repetitions}x{distance}m` quando há distância, senão `{repetitions}x{duration}s`; nado e zona traduzidos; `equipment` como chips ou texto separado por vírgula, também traduzido.

### Botão de conclusão

- [ ] `UIButton` fixo no rodapé da tela (ou ao final do conteúdo), com dois estados:
  - não concluído: `Marcar como concluído`, `iconLeft="check"`, chama `WorkoutService.complete(id)`.
  - concluído: `Desmarcar conclusão`, `iconLeft="close"`, chama `WorkoutService.uncomplete(id)`.
- [ ] `loading` local no botão durante a request (`UIButton` já suporta `loading` e bloqueia o press).
- [ ] Sucesso: merge dos campos escalares da resposta (`status`, `completed_at`, `completions_count`) no estado atual, preservando `sections`; e `DeviceEventEmitter.emit('workoutCompletionChanged')`.
- [ ] Erro: `snack('Erro ao atualizar a conclusão do treino')`, sem alterar o estado (nenhum catch silencioso).

### Sincronização da listagem

- [ ] `app/(tabs)/workouts.tsx`: extrair o fetch do `useEffect` para uma função reutilizável (`fetchWorkouts`) e adicionar um `useEffect` com `DeviceEventEmitter.addListener('workoutCompletionChanged', ...)` que a re-executa, removendo o listener no cleanup.
- [ ] Não usar `useFocusEffect`: voltar sem alterar nada não deve disparar request (decisão 7).

### Critérios de aceite

- Tocar num card da listagem abre `/workout/{id}` com as seções e séries do treino.
- A tela mostra distância total em km e duração total em min iguais às do card de origem.
- Nado, zona, equipamento e status aparecem em pt-BR com o mesmo texto que o coach vê no web.
- Valor desconhecido (enum novo no backend antes de o app ser atualizado) aparece cru, sem quebrar nem sumir da tela.
- Treino não concluído mostra `Marcar como concluído`; após o toque e resposta 200, o botão vira `Desmarcar conclusão` e o status na tela vira concluído, sem recarregar a tela nem perder as seções.
- `Desmarcar conclusão` volta o status para `scheduled` (treino futuro) ou `missed` (treino passado).
- Ao voltar para a listagem depois de marcar/desmarcar, o card correspondente reflete o novo status; ao voltar sem tocar no botão, nenhuma request é disparada.
- Falha de rede em qualquer uma das três chamadas exibe snackbar com mensagem descritiva; nenhum `catch` vazio.
- `npm run lint` sem erros.

## Fase 3 — Web (natare-web), adiável

Independente das fases 1 e 2; nada quebra se ficar para depois.

- [x] `src/types/workout.ts`: alinhar `IntensityZoneEnum` e `SwimStrokeEnum` com os enums do backend (remover `AT`, `VO2`, `LP`, `LT`; adicionar `A3`, `A4`, `SOLTO`, `PROGRESSIVE`, `STYLE`, `LEG_STROKE`, `DRILL`). Correção de tipagem, sem efeito em runtime.
- [x] Renomear `rest_time` para `interval` em todo o web (`src/types/workout.ts`, `src/store/workoutStore.ts`, `src/components/Workouts/SectionCard.jsx`, `WorkoutTotals.jsx`, `workoutHelpers.js`, `ShareImage/Poster.jsx`, `src/utils/shareWorkout.js`).
  - **Bug encontrado durante a Fase 3**: o web gravava `rest_time`, mas a API valida e persiste `interval` (`StoreWorkoutRequest:30`, `WorkoutSections::$fillable`). Como `validated()` descarta chave não validada, o descanso digitado pelo treinador nunca era salvo, e o `interval` devolvido pelo `show` nunca era lido de volta. Isso também deixava vazio o descanso na tela nova do mobile.
- [x] ~~Criar `WORKOUT_STATUS_MAP`~~ **cancelado**: a premissa do plano estava errada. `src/pages/Authed/Home/UpcomingList.jsx` renderiza o mock `UPCOMING` de `src/mocks/home.js`, com vocabulário próprio (`today` / `scheduled`) e sem integração com a API; o `STATUS_LABELS` de `src/pages/Authed/Notifications/index.jsx` é status de envio de comunicado (`pending`, `completed`, `partial`, `failed`), não de treino. Nenhuma tela do web consome `status` de treino da API, então o mapa nasceria como código morto.

### Critérios de aceite

- `src/types/workout.ts` e os enums do backend declaram exatamente o mesmo conjunto de valores.
- O descanso digitado numa seção sobrevive a salvar e reabrir o treino, e aparece na tela de detalhes do mobile.
- `npm run lint`, `npx prettier --check` e `npm run build` limpos.

## Pendências / futuro

- **Vocabulário duplicado entre web e mobile**: consequência aceita da decisão 2. Ao adicionar um caso novo em qualquer enum do backend, atualizar os dois mapas no mesmo ciclo. O fallback `?? value` garante que esquecer degrada para o valor cru em vez de quebrar a tela. Se a divergência incomodar no futuro, as saídas são um pacote compartilhado de constantes ou um endpoint de catálogo, ambos fora de escopo agora.
- **`notes` de seção não existe no backend**: o web tem campo de observação por seção (`section.notes`, usado em `SectionCard.jsx`, `Poster.jsx` e `shareWorkout.js`), mas `notes` só existe em série. Não há coluna em `workout_sections`, nem regra em `StoreWorkoutRequest`, nem `$fillable`. O texto digitado é descartado no save, mesmo sintoma do `rest_time`. Corrigir exige migration + `$fillable` + validação + `docs/database/schema.dbml`, então ficou fora da Fase 3.
- **Status de treino no web**: quando alguma tela do web passar a consumir `status` da API, criar o `WORKOUT_STATUS_MAP` com os rótulos da tabela de vocabulário. Hoje seria código morto (ver Fase 3).
- **`UpcomingList` ainda usa mock**: `src/mocks/home.js` alimenta a lista de próximos treinos da Home do web, com vocabulário de status próprio. Integrar com `GET /api/workouts` é trabalho separado.
- **Rótulos de papel**: definidos na tabela de vocabulário, sem consumidor. Entram no cliente que primeiro precisar exibir papel.
- **Equipamento como campo livre**: se um dia precisar virar contrato (relatório por equipamento, filtro), o caminho é `EquipmentEnum` + validação em `equipment.*`, precedido de `SELECT DISTINCT jsonb_array_elements_text(equipment::jsonb) FROM workout_section_series WHERE equipment IS NOT NULL` para ver o que já existe no banco.
- **Payload de coach no `show`**: `teams` (com `withActiveAthletesCount`) e `unique_athletes_count` são carregados para todo viewer, inclusive atleta, que não usa nada disso. Vale condicionar ao papel numa limpeza futura; mexer nisso hoje afeta o web.
- **Totais nas respostas de completion**: continuam sem `total_distance` / `total_duration` (o `withAggregates` do `WorkoutCompletionController` só aplica os agregados de conclusão). A decisão 9 contorna isso no cliente; se outra tela precisar do payload completo, aplicar o mesmo scope lá.
- **Registro de execução por série**: tempos, sensação/RPE e notas do atleta continuam previstos para `workout_entries` (ver `natare-api/docs/plans/workout-completion.md`), fora deste escopo.
- **Visão do coach**: `completions_count` e lista de quem concluiu são trabalho do web e dependem de um endpoint de listagem de entries por treino, ainda não definido.
- **Pull to refresh** na tela de detalhes: não incluído.
