import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-paper';
import styled from 'styled-components/native';

type Props = {
  uri?: string | null;
  onImageChange: (uri: string) => void;
};

export function ProfileAvatar({ uri, onImageChange }: Props) {
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
    <Container>
      <AvatarImage source={{ uri: uri ?? undefined }} />
      <EditButton onPress={pickImage}>
        <Icon source="camera" size={16} color="#fff" />
      </EditButton>
    </Container>
  );
}

const Container = styled.View`
  position: relative;
  align-self: center;
`;

const AvatarImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const EditButton = styled.Pressable`
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
