# Release Android (Google Play)

Processo de build e submissão do NatareApp para a Google Play via EAS.
Para a App Store, veja [release-ios.md](./release-ios.md).
Os textos e o questionário de Data Safety estão em
[play-store-listing.md](./play-store-listing.md).

O `android.package` do app é **`com.guiweige.natareapp`** (`app.json`), o mesmo do
`google-services.json`. Esse valor não pode mudar depois da primeira publicação.

## Passo a passo da primeira publicação

Os passos 1 a 5 são feitos uma única vez. Do 6 em diante é o fluxo de todo
release.

### 1. Conta no Google Play Console

1. Acessar https://play.google.com/console e criar a conta de desenvolvedor
   (25 USD, pagamento único) com a mesma conta Google usada no Firebase.
2. Escolher o tipo de conta:
   - **Pessoal**: exige 12 testadores em teste fechado por 14 dias contínuos
     antes de conseguir liberar a produção (detalhes na seção
     "Teste fechado obrigatório").
   - **Organização**: não passa por essa exigência, mas pede um número D-U-N-S.
3. Concluir a verificação de identidade (documento e endereço). Pode levar alguns
   dias e **bloqueia a publicação** até terminar, então é o primeiro passo.

### 2. Criar o app no console

*All apps > Create app*:

- Nome: `NatareApp`
- Idioma padrão: Português (Brasil)
- Tipo: Aplicativo
- Gratuito
- Aceitar as declarações de diretrizes e leis de exportação dos EUA

Depois, em *Test and release > Setup > Advanced settings*, conferir que o package
name ficou `com.guiweige.natareapp` (ele é definido no primeiro upload do `.aab`).

### 3. Gerar a chave de upload no EAS

Rodar no terminal (precisa ser interativo, o EAS faz uma pergunta):

```bash
npx eas build --platform android --profile production
```

Responder **Yes** em "Generate a new Android Keystore?". O EAS cria e guarda a
keystore de upload no servidor dele; não existe arquivo para versionar.

Esse mesmo comando já produz o primeiro `.aab`. Baixar o artefato pelo link que o
build imprime no final.

### 4. Primeiro upload (manual, obrigatório)

A API da Google Play **não** aceita criar a primeira release de um app, então o
`eas submit` só funciona a partir da segunda. O primeiro envio é à mão:

1. *Test and release > Testing > Internal testing > Create new release*
2. Manter **Play App Signing** ativado (é o padrão e não dá para desativar em apps
   novos)
3. Subir o `.aab` baixado no passo 3
4. Preencher as notas da versão e salvar

### 5. Credenciais e service account

Depois do primeiro upload:

1. **Anotar os dois SHA-1** (necessários para o Firebase e para qualquer login
   social futuro):
   - certificado de **upload**: `npx eas credentials --platform android`
   - certificado de **app signing**: Play Console > *Test and release > Setup >
     App signing*
   - cadastrar os dois no projeto do Firebase (*Project settings > Your apps >
     Android*) e baixar o `google-services.json` atualizado se ele mudar
2. **Criar a service account** para o `eas submit`:
   - Google Cloud Console > *IAM & Admin > Service Accounts > Create service
     account* (projeto do Firebase serve)
   - Sem papel no Google Cloud; a permissão vem do Play Console
   - *Keys > Add key > Create new key > JSON* e baixar o arquivo
3. **Dar acesso a ela no Play Console**: *Users and permissions > Invite new
   users*, colar o e-mail da service account e conceder **Release manager** no app
   (ou, no mínimo, "Release apps to testing tracks" + "Manage store presence")
4. Salvar o JSON como `google-play-service-account.json` na raiz do repositório.
   Ele está no `.gitignore` e **nunca** deve ser commitado (o repositório é
   público).

### 6. Ficha da loja e questionários

Tudo em *Grow > Store presence > Main store listing* e *Policy > App content*.
Conteúdo pronto para colar em [play-store-listing.md](./play-store-listing.md):
ficha, Data Safety, classificação IARC, público-alvo, anúncios, acesso à revisão e
URL de exclusão de conta.

### 7. Testar e promover

1. *Internal testing > Testers*: criar a lista de e-mails Google e mandar o link
   de opt-in
2. Instalar em um dispositivo real e validar
3. Se a conta for **pessoal**, rodar o teste fechado obrigatório antes de pedir
   acesso à produção (seção abaixo)
4. *Promote release > Production* e enviar para revisão

A primeira revisão costuma levar de alguns dias até ~7 dias, bem mais que as
seguintes.

## Teste fechado obrigatório (conta pessoal)

Contas de desenvolvedor **pessoais** criadas depois de novembro de 2023 precisam
rodar um teste fechado antes de conseguir publicar em produção. Contas de
**organização** (as que exigem D-U-N-S) não passam por essa etapa.

A regra: no mínimo **12 testadores com opt-in aceito**, mantidos
**continuamente por 14 dias**, em um track de **teste fechado**.

O que costuma dar errado:

- **Teste interno não conta.** Só o track *Closed testing* alimenta o prazo; o
  interno serve para validar o `.aab`.
- **São 12 contas Google distintas e reais**, e cada uma precisa entrar pelo link
  de opt-in. Convidado que não aceitou não entra na contagem.
- **Se alguém sair do teste, a contagem quebra** e os 14 dias reiniciam. Convidar
  uma folga (15 a 20 pessoas) evita refazer o prazo por causa de uma desistência.
- **Os 14 dias só começam** quando o teste fechado está publicado e os 12 já estão
  dentro, não na data do convite.
- **A conta verificada é pré-requisito**: não dá para publicar em nenhum track
  antes da verificação de identidade terminar, então ela está no caminho crítico
  da data de lançamento.

Depois dos 14 dias aparece o formulário **Apply for production access**, que
pergunta como o teste foi conduzido e o que mudou com o feedback dos testadores.
O Google revisa esse pedido, o que leva mais alguns dias, e só então a promoção
para produção fica disponível e o app entra na revisão normal.

Somando verificação de identidade, 14 dias de teste, análise do pedido de produção
e revisão do app, o intervalo realista entre criar a conta e ter o app na loja é
de 3 a 4 semanas.

Para o NatareApp os testadores saem dos próprios atletas e treinadores, mas
precisam usar conta Google e aceitar o convite.

> O Google já mexeu nessa política mais de uma vez desde 2023. Conferir o número
> de testadores e o prazo na própria tela de *Closed testing* antes de montar a
> lista.

## Fluxo dos próximos releases

```bash
npx eas build --platform android --profile production    # gera o .aab assinado
npx eas submit --platform android --profile production   # envia para o track interno
```

O perfil `production` do `eas.json` já usa `buildType: "app-bundle"` (o `.aab` é
obrigatório na Play desde 2021) e o `submit.production.android` aponta para o
track `internal`, de onde a release é promovida pelo console.

## Versionamento

Igual ao iOS:

- `expo.version` no `app.json` é a versão exibida na loja. Subir manualmente a
  cada release, seguindo semver.
- O `versionCode` é gerenciado pelo EAS (`cli.appVersionSource: "remote"` +
  `build.production.autoIncrement: true`), então **não** deve existir
  `android.versionCode` no `app.json`.
- O app não usa `expo-updates`, portanto não há canal de OTA update: toda correção
  exige novo build e nova submissão.

## Checklist antes de enviar para revisão

- [ ] Ficha da loja em pt-BR (nome, descrição curta, descrição completa)
- [ ] Ícone 512x512 PNG e feature graphic 1024x500
- [ ] Screenshots de celular (mínimo 2, 16:9 ou 9:16, lado maior entre 1080 e 7680px)
- [ ] URL pública da política de privacidade
- [ ] URL pública de solicitação de exclusão de conta
- [ ] Formulário de Data Safety preenchido
- [ ] Questionário de classificação de conteúdo (IARC)
- [ ] Público-alvo e conteúdo infantil (o app permite cadastro de menores feito
      pelo treinador)
- [ ] Declaração de anúncios: o app **não** exibe anúncios
- [ ] Conta de teste (atleta) nas instruções de acesso da revisão, já que o app é
      fechado por convite
- [ ] Categoria, e-mail de contato e site

## Permissões declaradas (Android)

| Permissão | Onde é usada | Origem |
| --- | --- | --- |
| `READ_MEDIA_IMAGES` | `components/Profile/Avatar.tsx`, `app/workout/share/[id].tsx` | plugin `expo-image-picker` |
| `POST_NOTIFICATIONS` | `expo-notifications` | plugin `expo-notifications` |
| `INTERNET` | chamadas à API | padrão do Expo |
