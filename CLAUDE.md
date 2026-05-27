# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # start Expo dev server (also auto-updates .env with local IP)
npm run android    # start on Android emulator/device
npm run ios        # start on iOS simulator/device
npm run lint       # run ESLint via expo lint
```

There are no tests configured in this project.

## Architecture

### Routing
Expo Router with file-based routing. The entry point is `app/_layout.tsx`, which wraps the whole app in providers. `app/(tabs)/` contains the three tab screens (Home, Workouts, Profile). Auth screens (`login`, `forgot-password`) live at the root stack level.

### Provider stack (outermost → innermost)
`SnackbarProvider` → `AuthProvider` → `StyledProvider` (styled-components) → `PaperProvider` (react-native-paper) → `ConfirmDialogProvider`

### Theme
A single custom MD3 theme is defined in `app/_layout.tsx` and passed to both `react-native-paper` (`PaperProvider`) and `styled-components` (`StyledProvider`). `styled.d.ts` extends `DefaultTheme` from styled-components to match `MD3Theme`, so `theme.colors.*` from react-native-paper is available inside all styled components.

### HTTP & Auth
`lib/http/axios.ts` exports a pre-configured Axios instance (`http`) that reads the JWT from `expo-secure-store` on every request and emits a `DeviceEventEmitter` event `on401` on 401 responses. `AuthProvider` listens for `on401` to clear the session. Services in `services/` use `http` directly via static class methods.

### IP auto-update
`scripts/update-env-ip.js` runs before every `expo start` command and rewrites `EXPO_PUBLIC_API_URL` in `.env` with the machine's current local IP. This keeps physical devices working without manual `.env` edits.

### Component conventions
- UI primitives live in `components/UI/` and are prefixed with `UI` (e.g. `UICard`, `UIButton`).
- Feature components are grouped by screen in `components/<ScreenName>/`.
- All styling is done with `styled-components/native`. Inline `StyleSheet` is avoided.
- `UICard` wraps a `Pressable` and accepts `style` as `PressableProps['style']`, so `({ pressed }) => ...` callbacks work.
- `UISquareIcon` accepts a `color` prop (`'default' | 'red' | 'green' | 'orange'`) that controls both icon and background tint.

### Idioma
Todos os textos visíveis ao usuário (labels, mensagens, títulos, placeholders) devem estar em português brasileiro.

### Forms
`react-hook-form` + `zod` for validation. `UIFormInput` wraps the controlled input pattern.
