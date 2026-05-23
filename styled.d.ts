import { MD3Theme } from 'react-native-paper';
import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme extends MD3Theme {}
}
