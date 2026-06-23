import { Image } from 'expo-image';

export function UILogo({ size = 32 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/images/logo.svg')}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
