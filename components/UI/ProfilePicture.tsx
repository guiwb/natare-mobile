import styled from 'styled-components/native';

export default function ProfilePicture({ uri }: { uri: string }) {
  return <StyledImage source={{ uri }} alt="Profile Picture" />;
}

const StyledImage = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border-width: 3px;
  border-color: rgba(66, 133, 244, 0.6);
  object-fit: cover;
`;
