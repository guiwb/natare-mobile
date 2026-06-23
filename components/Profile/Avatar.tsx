import { UIMenu } from '@/components/UI/Menu';
import { UIProfilePicture } from '@/components/UI/ProfilePicture';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Icon, Menu, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';

type Props = {
  uri?: string | null;
  name?: string;
  loading?: boolean;
  onImageChange: (uri: string) => void;
  onRemove: () => void;
};

export function ProfileAvatar({
  uri,
  name,
  loading,
  onImageChange,
  onRemove,
}: Props) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const pickImage = async () => {
    setMenuVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageChange(result.assets[0].uri);
    }
  };

  const remove = () => {
    setMenuVisible(false);
    onRemove();
  };

  return (
    <UIMenu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Anchor disabled={loading} onPress={() => setMenuVisible(true)}>
          <UIProfilePicture
            uri={uri}
            name={name}
            size={90}
            borderColor={theme.colors.primary}
          />
          {loading && (
            <LoadingOverlay>
              <ActivityIndicator color="#fff" />
            </LoadingOverlay>
          )}
          <EditButton>
            <Icon source="camera" size={16} color="#fff" />
          </EditButton>
        </Anchor>
      }
    >
      <Menu.Item
        dense
        leadingIcon={() => (
          <Icon source="image-edit" size={20} color={theme.colors.onSurface} />
        )}
        title={uri ? 'Editar foto' : 'Adicionar foto'}
        onPress={pickImage}
      />
      {uri && (
        <Menu.Item
          dense
          leadingIcon={() => (
            <Icon
              source="trash-can-outline"
              size={20}
              color={theme.colors.error}
            />
          )}
          title="Remover foto"
          titleStyle={{ color: theme.colors.error }}
          onPress={remove}
        />
      )}
    </UIMenu>
  );
}

const Anchor = styled.Pressable`
  position: relative;
  align-self: center;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 45px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

const EditButton = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
