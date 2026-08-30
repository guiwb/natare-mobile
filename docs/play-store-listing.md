# Ficha da Google Play (rascunho)

Textos para colar no Play Console. Tudo em pt-BR, com o idioma principal do app
definido como Português (Brasil). A versão da App Store está em
[app-store-listing.md](./app-store-listing.md); os textos são propositalmente os
mesmos, só os limites de caractere mudam.

## Nome do app (30 caracteres)

```
NatareApp
```

## Descrição curta (80 caracteres)

```
Os treinos da sua equipe de natação no bolso, prescritos pelo seu treinador.
```

Alternativas:

- `Treinos de natação em equipe, sem planilha e sem grupo de mensagens.` (67)
- `O treinador prescreve, você nada e acompanha sua evolução na temporada.` (70)

A descrição curta é o texto que aparece no card da busca e **é indexada**, então
ela concentra os termos principais: "treino", "natação", "equipe", "treinador".

## Descrição completa (4000 caracteres)

```
O NatareApp conecta treinadores e atletas de natação em um só lugar. O treinador monta os treinos e acompanha a equipe; o atleta recebe tudo pronto no celular, sem planilha nem grupo de mensagens.

O que você encontra no app:

• Treino do dia na tela inicial, com blocos, séries, distâncias, intervalos e o volume total em metros.
• Sua semana em uma tela: navegue entre as semanas, filtre por pendentes ou concluídos e marque cada treino como feito.
• Sequência de dias treinados e mapa de atividade mês a mês, para enxergar a constância no gráfico.
• Histórico completo de tudo o que você nadou, com volume, tempo total e tempo de descanso de cada sessão.
• Notificações no celular quando o treinador publica um treino novo ou envia um convite.
• Resumo do treino pronto para postar nos stories, com os números do dia.
• Perfil do atleta com os dados que o treinador usa para prescrever o treino certo para você.

Para quem é: nadadores de equipes de natação, masters e triatletas, e os treinadores que prescrevem os treinos.

O acesso ao NatareApp é feito por convite do treinador ou da equipe. Se a sua equipe ainda não usa o NatareApp, fale com o seu treinador.

O app é gratuito, não tem assinaturas, compras dentro do app nem anúncios.
```

O parágrafo "Para quem é" e o último parágrafo não existem na ficha da Apple: a
Play indexa a descrição completa inteira, então vale gastar as palavras-chave de
nicho (`masters`, `triatletas`, `treinador`) aqui. A Play não tem um campo de
palavras-chave separado.

## Categoria e contato

- Categoria: Saúde e fitness (alternativa: Esportes)
- Tags: Treino, Fitness, Esportes
- E-mail de contato: `contato@natare.app`
- Site: `https://natare.app`
- Política de privacidade: `https://natare.app/privacy`

## Recursos gráficos

| Recurso | Formato | Obrigatório |
| --- | --- | --- |
| Ícone | 512x512 PNG de 32 bits, sem transparência | sim |
| Feature graphic | 1024x500 PNG ou JPEG | sim |
| Screenshots de celular | mínimo 2, máximo 8; 16:9 ou 9:16; lado maior entre 1080 e 7680px | sim |
| Screenshots de tablet | 7" e 10" | não (`supportsTablet: false`) |

Sugestão de sequência (5 telas, a mesma da App Store): Home com o treino do dia,
detalhe do treino, lista de treinos, perfil do atleta, card de compartilhamento.

O `assets/images/icon.png` já é 1024x1024, então o ícone 512x512 sai de um resize
dele. O feature graphic (1024x500) ainda precisa ser montado.

## Data Safety (formulário de segurança dos dados)

Todos os dados abaixo são **coletados**, **enviados por criptografia**, estão
**vinculados à identidade do usuário**, **não** são usados para rastreamento e
**não** são compartilhados com terceiros para fins próprios deles.

| Categoria | Tipo de dado | Finalidade | Obrigatório |
| --- | --- | --- | --- |
| Informações pessoais | Nome | Funcionalidade do app | sim |
| Informações pessoais | Endereço de e-mail | Funcionalidade do app, gerenciamento da conta | sim |
| Informações pessoais | Outras informações (data de nascimento, sexo) | Funcionalidade do app | não |
| Saúde e fitness | Informações de saúde (altura, peso) | Funcionalidade do app | não |
| Saúde e fitness | Informações de atividade física (treinos) | Funcionalidade do app | sim |
| Fotos e vídeos | Fotos (avatar) | Funcionalidade do app | não |
| IDs do app | ID do dispositivo (push token) | Funcionalidade do app | sim |

Respostas para as perguntas gerais do formulário:

- Os dados são criptografados em trânsito: **sim** (HTTPS em toda a API).
- O usuário pode pedir a exclusão dos dados: **sim**, dentro do app em
  *Perfil > Excluir conta* e pela URL pública de solicitação de exclusão.
- Nenhum dado é coletado por SDK de terceiros para publicidade ou analytics: o app
  não usa analytics, crash reporting, localização, contatos nem histórico.

Serviços de terceiros que processam dados como operadores: Expo Push Notification
Service (push token), Cloudinary (fotos de perfil), Resend (e-mails
transacionais).

## URL de exclusão de conta

O fluxo in-app (*Perfil > Excluir conta*, em `app/delete-account.tsx`) **não
resolve sozinho**. A política de dados do usuário da Play pede os dois caminhos:
dentro do app e por um recurso na web, e a URL é um campo obrigatório em
*Policy > App content > Data deletion*. O motivo é atender quem desinstalou o app
ou perdeu o acesso à conta, que não consegue chegar na tela do app.

A página `/contact` também não serve bem: a Play espera uma página **dedicada**,
que explique o processo de exclusão. Um formulário genérico de contato costuma
voltar como pendência na revisão.

O caminho mais curto é uma rota pública nova no `natare-web` (ex.:
`/delete-account`, no mesmo layout de `/privacy` e `/terms`), sem login, dizendo:

- que a exclusão pode ser feita dentro do app em *Perfil > Excluir conta*;
- como pedir a exclusão por e-mail (ou pelo `/contact`) para quem perdeu o acesso;
- quais dados são apagados (conta, perfil, histórico de treinos e foto) e o prazo.

É uma página estática, sem backend novo: o `/contact` continua sendo o canal de
recebimento, a página só precisa existir e explicar.

## Classificação de conteúdo (IARC)

Sem conteúdo sensível: responder "não" para violência, sexo, linguagem imprópria,
drogas, jogos de azar e conteúdo assustador. O app não tem compras, anúncios,
interação entre usuários, compartilhamento de localização nem conteúdo gerado por
usuário exibido publicamente.

## Público-alvo e conteúdo infantil

- Faixas etárias-alvo: 13 anos ou mais (o app não é direcionado a crianças).
- O app **permite** o cadastro de menores de idade, feito pelo treinador ou
  responsável, mas não é voltado ao público infantil e não deve ser marcado como
  "Designed for Families".
- Nenhum elemento visual ou de conteúdo apela a crianças.

## Anúncios

O app **não contém anúncios**.

## Acesso ao app (instruções para a revisão)

```
O NatareApp é um aplicativo fechado: o atleta só acessa por convite do treinador, portanto não é possível criar uma conta pela tela de login.

Use a conta de demonstração abaixo, que já possui treinos cadastrados:

E-mail: <preencher>
Senha: <preencher>

A exclusão de conta está disponível em Perfil > Excluir conta.
O app não utiliza login social de terceiros.
```

As credenciais são preenchidas na hora do envio e **não** ficam neste arquivo: o
repositório é público. Vale criar uma conta específica para o Android, separada da
usada na revisão da Apple.

## Notas da versão (primeira publicação)

```
Primeira versão do NatareApp.
```
