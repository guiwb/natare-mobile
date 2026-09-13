# Feedback do teste fechado

Consolidado do feedback dos testadores do teste fechado da Google Play (iniciado
em 02/09/2026, com atletas e treinadores reais, entrando na versão 1.0.1). Cada
item aponta a issue que o registrou e o commit que o resolveu.

Serve de base para o formulário **Apply for production access** da Play Console,
que pergunta como o teste foi conduzido e o que mudou com o feedback (ver
[release-android.md](release-android.md)).

Os relatos vieram por WhatsApp, de atletas usando o app no dia a dia e de um
testador Android com experiência em QA. Para preservar a privacidade, aqui só
aparece o papel de quem relatou.

## Como o feedback vira issue

Relato que depende de backend vira card no `natare-api` e o front (web e/ou
mobile) entra como sub-issue. Feedback restrito a uma interface vira card direto
no repo dela. Todo card leva Size e Priority e vai para o Project 4.

## Bugs corrigidos

| # | Relato | Issue | Resolução |
|---|---|---|---|
| 1 | No Android o teclado cobre o botão "Entrar na minha conta" e o snackbar de senha errada aparece atrás do teclado, sem feedback nenhum | [mobile#20](https://github.com/guiwb/natare-mobile/issues/20) | `KeyboardAvoidingView` nas telas de auth e snackbar reposicionado para o topo (`fix(android): keep the keyboard from covering the auth screens`, 02/09) |
| 2 | O seletor de gênero no Android abre um select dentro de outro select, com aparência quebrada | [mobile#21](https://github.com/guiwb/natare-mobile/issues/21) | `Picker` nativo trocado por uma lista de opções no próprio bottom sheet, igual nas duas plataformas (`fix(profile): replace the gender picker with an option sheet`, 02/09) |
| 3 | "O campo de senha atual parece não ser necessário para o backend" | [api#47](https://github.com/guiwb/natare-api/issues/47) + [mobile#22](https://github.com/guiwb/natare-mobile/issues/22) | O sintoma era uma tela falsa: o submit não chamava API e sempre dizia "Senha alterada com sucesso". Criado o endpoint autenticado de troca de senha e a tela ligada a ele, com erro por campo (`feat(auth): add the authenticated password update endpoint` + `feat(profile): wire the change password screen to the api`, 02/09) |
| 4 | O convite mostra "Sua equipe" / "Seu treinador" com as iniciais "SE", ou seja, informação inventada na primeira tela do produto | [web#44](https://github.com/guiwb/natare-web/issues/44) | Painel removido enquanto o link do convite não carregar os dados reais (`fix(auth): correct the invite screen feedback and the public layout width`, 02/09) |
| 5 | No aceite do convite dá para enviar nome em branco, e a tela pode terminar em mensagem de sucesso mesmo quando o passo seguinte falha | [web#45](https://github.com/guiwb/natare-web/issues/45) | `trim` e validação no campo, toast de sucesso só após `accept` + `login`, 422 exibindo os erros do Laravel sem redirecionar (mesmo commit do item 4) |
| 6 | A tag "Combinam" / "Não confere" estoura a largura da página no celular e cria scroll horizontal | [web#46](https://github.com/guiwb/natare-web/issues/46) | `min-width: 0` no wrapper do input e sufixo que não cresce (mesmo commit do item 4) |
| 7 | A animação de transição entre telas está feia no Android (09/09) | sem issue | Ajustado na sequência, junto do bump de versão; falta o testador validar na build seguinte |
| 8 | Perfil pede peso, altura, gênero e data de nascimento, diz "Perfil atualizado com sucesso" e não salva nada (achado na auditoria interna de 04/09, não relatado por testador) | [api#38](https://github.com/guiwb/natare-api/issues/38) + [mobile#2](https://github.com/guiwb/natare-mobile/issues/2) | Campos criados na API (com anonimização na deleção de conta) e passados a ser enviados pelo app (`feat(users): add birth date, measurements, phone and gender to the profile` + `feat(profile): persist birth date, measurements, phone and gender`, 12/09) |

## Sugestões de funcionalidade atendidas

| # | Relato | Issue | Resolução |
|---|---|---|---|
| 9 | Digitar a senha às cegas no celular causa erro de digitação, principalmente no login | [mobile#18](https://github.com/guiwb/natare-mobile/issues/18) | Botão de visualizar/ocultar senha no `UIFormInput`, aplicado a login, alterar senha e redefinição (`feat(auth): toggle password visibility in the form input`, 02/09) |
| 10 | Depois de avançar várias semanas na listagem de treinos, é preciso clicar a mesma quantidade de vezes para voltar | [mobile#19](https://github.com/guiwb/natare-mobile/issues/19) | Atalho "Hoje" no `WeekNavigator`, visível só fora da semana atual (`feat(workouts): add a shortcut back to the current week`, 02/09) |
| 11 | Atleta que aceita o convite entra sem equipe e fica sem treinos até alguém lembrar de vinculá-lo (aconteceu no teste fechado) | [api#46](https://github.com/guiwb/natare-api/issues/46) + [web#41](https://github.com/guiwb/natare-web/issues/41) | `team_id` no convite, vínculo criado no aceite e seletor de time no modal (`feat(invites): bind an invite to a team` + `feat(invites): select a team when sending the invite`, 11/09) |
| 12 | Série nova começa com 0 repetições e tempo zerado, e toda seção exige preencher o intervalo | [web#42](https://github.com/guiwb/natare-web/issues/42), [web#43](https://github.com/guiwb/natare-web/issues/43) | Padrões sugeridos (1 repetição, 2min a cada 100m, intervalo de 1min na seção), todos editáveis (`feat(workouts): seed serie and section defaults`, 10/09) |

Os testadores entraram com a 1.0.1 (30/08). Todas as correções acima saíram na
1.1.0 (tag `v1.1.0`, 12/09).

## Em desenvolvimento

| Relato | Issue |
|---|---|
| Mensagens de erro genéricas ("Ocorreu um erro inesperado") em vez do erro do campo, e limites de tamanho que só a API conhece | [api#48](https://github.com/guiwb/natare-api/issues/48), [web#47](https://github.com/guiwb/natare-web/issues/47), [mobile#23](https://github.com/guiwb/natare-mobile/issues/23) |

## Trabalho futuro

Cards abertos com prioridade mínima (P2, Backlog no Project 4), fora do escopo
da entrega atual.

| Relato | Issue |
|---|---|
| "Dei 1500, tô machucada, não queria marcar como treino concluído porque não fiz os 2 e 600, mas fiz 1500, e para a recompensa a pessoa sentir que fez alguma coisa." A atleta sugere botão de parcialmente concluído e campo para informar a metragem, e aponta que o volume dos treinos costuma ser alto demais para parte da equipe, o que torna reduzir a meta o caso comum, não a exceção. Inclui também a ideia de marcar treino perdido | [api#51](https://github.com/guiwb/natare-api/issues/51), [mobile#26](https://github.com/guiwb/natare-mobile/issues/26), [web#51](https://github.com/guiwb/natare-web/issues/51) |
| "A gente não pode incluir um treino?": registrar treino feito por conta, fora do que o treinador programou | [api#52](https://github.com/guiwb/natare-api/issues/52), [mobile#27](https://github.com/guiwb/natare-mobile/issues/27) |
| Horários de treino, streak e lembretes calculados no fuso do servidor | [api#12](https://github.com/guiwb/natare-api/issues/12), [web#19](https://github.com/guiwb/natare-web/issues/19), [mobile#17](https://github.com/guiwb/natare-mobile/issues/17) |
