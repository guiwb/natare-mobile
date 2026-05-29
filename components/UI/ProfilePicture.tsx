import styled from 'styled-components/native';

export function UIProfilePicture({ uri }: { uri?: string }) {
  return (
    <StyledImage
      source={{ uri: uri ?? 'https://via.placeholder.com/150' }}
      alt="Profile Picture"
    />
  );
}

const StyledImage = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border-width: 3px;
  border-color: rgba(66, 133, 244, 0.4);
  object-fit: cover;
`;
