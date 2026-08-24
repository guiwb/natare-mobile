# Release iOS (App Store)

Processo de build e submissão do NatareApp para a App Store via EAS.

## Pré-requisitos (feitos uma única vez)

1. **Apple Developer Program** ativo (99 USD/ano) e acesso ao [App Store Connect](https://appstoreconnect.apple.com).
2. **App criado no App Store Connect** com o bundle identifier `com.guiweige.natareapp` (mesmo valor de `ios.bundleIdentifier` no `app.json`).
3. **Credenciais preenchidas no `eas.json`**, no bloco `submit.production.ios`:
   - `appleId`: e-mail da conta Apple Developer
   - `ascAppId`: "Apple ID" numérico do app (App Store Connect > App > General > App Information)
   - `appleTeamId`: Team ID (Apple Developer > Membership)
4. **Credenciais de assinatura**: geradas e guardadas automaticamente pelo EAS no primeiro `eas build --platform ios` (certificado de distribuição + provisioning profile). Não é preciso criar nada manualmente no portal da Apple.

## Versionamento

- `expo.version` no `app.json` é a versão exibida na loja (ex.: `1.0.0`). Subir manualmente a cada release, seguindo semver.
- O build number é gerenciado pelo EAS (`cli.appVersionSource: "remote"` + `build.production.autoIncrement: true`), então **não** deve existir `ios.buildNumber` no `app.json`.
- O app não usa `expo-updates`, portanto não há canal de OTA update: toda correção exige novo build e nova submissão.

## Fluxo de release

```bash
npx eas build --platform ios --profile production   # build assinado na nuvem
npx eas submit --platform ios --profile production  # envia o .ipa para o App Store Connect
```

Depois da submissão:

1. Aguardar o processamento no App Store Connect (alguns minutos até ~1h).
2. Distribuir a build no **TestFlight** e testar em dispositivo real.
3. Preencher a ficha da loja e enviar para revisão ("Add for Review").

## Checklist da ficha da loja

- Nome, subtítulo, descrição, palavras-chave e categoria em pt-BR
- Ícone 1024x1024 sem transparência e sem cantos arredondados
- Screenshots nos tamanhos exigidos (iPhone 6.9" e 6.5")
- URL pública da política de privacidade
- Questionário **App Privacy**: o app coleta e-mail, dados de perfil (nome, foto) e push token
- Classificação etária considerando cadastro de menores de idade
- **Conta de teste (atleta)** nas notas para a revisão: o app é fechado por convite e o revisor não consegue se cadastrar sozinho
- Deleção de conta acessível dentro do app: já implementada em `app/delete-account.tsx`, alcançável pelo Perfil > Danger Zone
- Sign in with Apple: **não é exigido hoje**, pois o app não oferece login social de terceiros. Passa a ser obrigatório se/quando o login com Google ou Facebook for adicionado.

## Permissões declaradas (iOS)

| Permissão | Onde é usada | Texto |
| --- | --- | --- |
| Fotos | `components/Profile/Avatar.tsx`, `app/workout/share/[id].tsx` | configurado no plugin `expo-image-picker` no `app.json` |
| Notificações | `expo-notifications` | texto padrão do sistema |
