# Compartilhamento no Instagram Stories

O card do treino é exportado em PNG com os cantos arredondados transparentes. O share sheet
do sistema entrega a imagem como foto e o Instagram achata a transparência sobre preto, então
o envio para os Stories usa a API de sticker, que preserva o alpha.

Implementado no módulo Expo local `modules/instagram-story-share`:

- **iOS**: coloca a imagem no `UIPasteboard` com a chave `com.instagram.sharedSticker.stickerImage`
  e abre `instagram-stories://share?source_application=<appId>`. Precisa de
  `LSApplicationQueriesSchemes: ["instagram-stories"]` (já em `app.json`).
- **Android**: intent `com.instagram.share.ADD_TO_STORY` com `interactive_asset_uri` apontando
  para um `content://` do FileProvider do próprio módulo, com `FLAG_GRANT_READ_URI_PERMISSION`.
  O `<queries>` para `com.instagram.android` está no manifesto do módulo.

Nos dois casos o Instagram pinta um gradiente atrás do sticker (`top_background_color` /
`bottom_background_color`), definido em `app/workout/share/[id].tsx`.

## Configuração

1. Registre o app no Facebook Developers e pegue o **App ID** (o Instagram rejeita o
   compartilhamento sem `source_application`).
2. Adicione ao `.env`:

   ```
   EXPO_PUBLIC_FACEBOOK_APP_ID=1234567890
   ```

3. Gere um novo dev build (`eas build --profile development`): o módulo tem código nativo e
   não funciona em cima do build anterior.

Sem o App ID configurado, o botão "Instagram Stories" não aparece e o fluxo continua apenas
com o share sheet.
