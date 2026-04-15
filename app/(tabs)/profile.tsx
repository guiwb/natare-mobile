import { FormInput } from '@/components/UI/FormInput';
import { useAuth } from '@/contexts/AuthProvider';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import { IUser } from '@/services/auth.service';
import UserService from '@/services/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const { snack } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
  });

  const { control, setValue, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
    }
  }, [user, setValue]);

  const update = async (data: { name: string }) => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const updatedUser = { ...user, name: data.name } as IUser;
      await UserService.updateProfile(updatedUser);

      setUser(updatedUser);
      snack('Perfil atualizado com sucesso');
    } catch {
      snack('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text variant="titleLarge">Perfil</Text>

        <View style={styles.form}>
          <FormInput
            mode="outlined"
            label="Nome"
            name="name"
            control={control}
          />
          <TextInput
            mode="outlined"
            label="Email"
            editable={false}
            disabled
            value={user?.email}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(update)}
          loading={loading}
        >
          Atualizar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 20,
    marginVertical: 30,
  },
});
