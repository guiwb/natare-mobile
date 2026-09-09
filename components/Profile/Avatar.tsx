import { UIMenu } from '@/components/UI/Menu';
import { UIProfilePicture } from '@/components/UI/ProfilePicture';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
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

  const pickImage = async () => {
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

  return (
    <UIMenu
      disabled={loading}
      items={[
        {
          key: 'pick',
          title: uri ? 'Editar foto' : 'Adicionar foto',
          icon: 'image-edit',
          onPress: pickImage,
        },
        ...(uri
          ? [
              {
                key: 'remove',
                title: 'Remover foto',
                icon: 'trash-can-outline',
                destructive: true,
                onPress: onRemove,
              },
            ]
          : []),
      ]}
    >
      <Anchor>
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
    </UIMenu>
  );
}

const Anchor = styled.View`
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
