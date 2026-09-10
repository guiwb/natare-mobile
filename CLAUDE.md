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
Expo Router with file-based routing. The entry point is `app/_layout.tsx`, which wraps the whole app in providers. `app/(tabs)/` contains the four tab screens (Home, Workouts, Notifications, Profile). Auth screens (`login`, `forgot-password`) live at the root stack level.

Access control is declarative: `app/_layout.tsx` reads `useAuth` and wraps the stack screens in `Stack.Protected`, so the tabs and the other authenticated screens only exist while there is a `user`. Providers must not navigate on login/logout, the guard does it. `app/index.tsx` is only the `/` entry point and redirects to `/(tabs)` or `/login`.

### Navigation
Since SDK 56 `expo-router` refuses any `@react-navigation/*` import (the bundle fails with an explicit error). The equivalents ship with the router itself: `expo-router/js-top-tabs` (the top tabs used in `app/(tabs)/_layout.tsx` through `withLayoutContext`) and `expo-router/react-navigation` (theme and types such as `ParamListBase`). `js-top-tabs` needs `react-native-tab-view` and `react-native-pager-view`, so both stay as direct dependencies.

### Notifications
`expo-notifications` is never imported statically: Expo Go dropped remote notifications in SDK 53 and since SDK 57 the import itself throws there, which used to break every module downstream (`lib/notifications.ts` → `NotificationsProvider` → `UI/TabBar` → `app/(tabs)/_layout.tsx`) and crash the router. `lib/notifications.ts` requires the module lazily behind `pushAvailable` and exports `registerForPushNotifications` and `addNotificationListeners`; in Expo Go push is simply off. Testing notifications for real still needs a development build.

### Provider stack (outermost → innermost)
`SnackbarProvider` → `AuthProvider` → `BrandedTheme` (`StyledProvider` + `PaperProvider`) → `NotificationsProvider` → `ConfirmDialogProvider`

### Theme
The app is dark only (`userInterfaceStyle: "dark"` in `app.json`, no `useColorScheme` anywhere). The custom MD3 dark theme is built by `buildAppTheme` in `app/_layout.tsx` from the company `brand_color` (`useAuth().company`, falling back to `#4285F4`) and passed by `BrandedTheme` to both `react-native-paper` (`PaperProvider`) and `styled-components` (`StyledProvider`). `lib/brand.ts` clamps the brand color so white text on it and the color on dark surfaces stay readable. Logged-in screens must take the brand color from `theme.colors.primary` (with `withAlpha` for tints) instead of hardcoding the default blue; logged-out screens keep the default. `styled.d.ts` extends `DefaultTheme` from styled-components to match `MD3Theme`, so `theme.colors.*` from react-native-paper is available inside all styled components.

### HTTP & Auth
`lib/http/axios.ts` exports a pre-configured Axios instance (`http`) that reads the JWT from `expo-secure-store` on every request and emits a `DeviceEventEmitter` event `on401` on 401 responses. `AuthProvider` listens for `on401` to clear the session. Services in `services/` use `http` directly via static class methods.

### External services
Third-party HTTP integrations (Cloudinary, etc.) follow the same pattern: a static class in `services/` that encapsulates all calls to that API. Use `fetch` for APIs outside the backend (no JWT needed). Example: `CloudinaryService` in `services/cloudinary.service.ts`.

### Native modules
Local Expo modules live in `modules/`. `instagram-story-share` sends the workout card to the
Instagram Stories composer as a sticker (transparency survives, unlike the share sheet); see
`docs/instagram-stories.md`. Any change there needs a new dev build.

### IP auto-update
`scripts/update-env-ip.js` runs before every `expo start` command and rewrites `EXPO_PUBLIC_API_URL` in `.env` with the machine's current local IP. This keeps physical devices working without manual `.env` edits.

### Component conventions
- UI primitives live in `components/UI/` and are prefixed with `UI` (e.g. `UICard`, `UIButton`).
- Feature components are grouped by screen in `components/<ScreenName>/`.
- All styling is done with `styled-components/native`. Inline `StyleSheet` is avoided.
- `UICard` wraps a `Pressable` and accepts `style` as `PressableProps['style']`, so `({ pressed }) => ...` callbacks work.
- `UIMenu` takes an `items` array and the trigger as `children`, and opens `UISheet`, the app's own bottom sheet (also used by the iOS wheel pickers). Paper's `Menu` is not used: its backdrop stopped dismissing on outside taps with RN 0.86.
- `UISquareIcon` accepts a `color` prop (`'default' | 'red' | 'green' | 'orange'`) that controls both icon and background tint.

### Forms
`react-hook-form` + `zod` for validation. `UIFormInput` wraps the controlled input pattern.
