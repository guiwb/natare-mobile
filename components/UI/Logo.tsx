import { Image } from 'expo-image';
import { useState } from 'react';

export function UILogo({
  size = 32,
  uri,
}: {
  size?: number;
  uri?: string | null;
}) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const showRemote = !!uri && uri !== failedUri;

  return (
    <Image
      source={showRemote ? { uri } : require('@/assets/images/logo.svg')}
      style={{ width: size, height: size }}
      contentFit="contain"
      cachePolicy="memory-disk"
      onError={() => setFailedUri(uri ?? null)}
    />
  );
}
