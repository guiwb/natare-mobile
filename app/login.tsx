import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  return (
    <SafeAreaView>
      <TextInput label="E-mail" mode="outlined" />
      <TextInput label="Senha" mode="outlined" />
      <Button mode="contained" onPress={() => {}}>
        Entrar
      </Button>
    </SafeAreaView>
  );
}
