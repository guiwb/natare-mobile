# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Builds e notificações push (EAS)

As notificações push usam o Expo Push Service e exigem um projeto EAS. O `projectId` já está configurado em `app.json` (`expo.extra.eas.projectId`); `lib/notifications.ts` lê esse valor para gerar o token do device.

> Push real **não funciona no Expo Go**. É necessário um development build (ou build de produção) rodando em um device físico.

### Pré-requisitos (uma vez)

```bash
npm install -g eas-cli   # ou use npx eas
npx eas login            # conta Expo
npx eas init             # vincula o projeto e grava o projectId no app.json
```

### Gerar um development build

Na primeira execução o EAS cria o `eas.json` com os profiles padrão (aceite as sugestões).

```bash
npx eas build --profile development --platform android
# ou
npx eas build --profile development --platform ios
```

Instale o artefato no device físico e rode o servidor de dev apontando para ele:

```bash
npm start            # use a opção de development build no menu
```

### Build de produção

```bash
npx eas build --profile production --platform android
npx eas build --profile production --platform ios
```

### Credenciais de push

#### Android (FCM V1)

Sem FCM o `getExpoPushTokenAsync` falha e nenhum token é registrado (o feed in-app ainda funciona, mas não chega push no SO).

1. No [Firebase Console](https://console.firebase.google.com), abra (ou crie) o projeto e adicione um **app Android** em Configurações do projeto → Geral → "Seus apps" → Adicionar app → Android.
   - **Nome do pacote:** deve bater com `android.package` do `app.json` (`com.guiweige.nataremobile`).
   - **SHA-1:** opcional, não é necessário para push.
2. Baixe o **`google-services.json`** e coloque na raiz de `natare-mobile/`.
3. Referencie no `app.json` (já configurado):
   ```json
   "android": { "googleServicesFile": "./google-services.json" }
   ```
4. **Chave da conta de serviço FCM V1:** Firebase → Configurações do projeto → aba **Contas de serviço** → "Gerar nova chave privada" (JSON). Suba no Expo:
   ```bash
   npx eas credentials
   # Android → Push Notifications → FCM V1 service account key → aponte o JSON
   ```
5. **Rebuild do dev client** (o `google-services.json` é config nativa, exige novo build) e reinstale no device.

> **Versionamento:** faça commit do `google-services.json` (não é segredo, vai embutido no app, e o `eas build` usa o git, então arquivos não commitados não entram no build). **Nunca** faça commit da chave da conta de serviço FCM V1 (a privada do passo 4); ela vive só no EAS.

#### iOS (APNs)

O EAS gera e gerencia a chave APNs automaticamente durante o build (requer Apple Developer account paga).

### Testar um push manualmente

Com o token do device em mãos (logado, o app registra via `POST /api/push-tokens`), envie pelo [Expo Push Tool](https://expo.dev/notifications) ou:

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H 'Content-Type: application/json' \
  -d '{"to":"ExponentPushToken[...]","title":"Teste","body":"Olá"}'
```

> Sem EAS/dev build, o feed in-app (tab Notificações) continua funcionando normalmente, pois as notificações são criadas no backend independentemente do push do SO.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
