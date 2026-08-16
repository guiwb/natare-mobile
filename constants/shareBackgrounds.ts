import { ImageSourcePropType } from 'react-native';

export type ShareBackground =
  | { type: 'preset'; id: string; label: string; source: ImageSourcePropType }
  | { type: 'photo'; uri: string };

export const SHARE_BACKGROUNDS: Extract<
  ShareBackground,
  { type: 'preset' }
>[] = [
  {
    type: 'preset',
    id: 'pool-olympic',
    label: 'Piscina olímpica',
    source: require('@/assets/images/share/pool-olympic.jpg'),
  },
  {
    type: 'preset',
    id: 'pool-aerial',
    label: 'Piscina turquesa',
    source: require('@/assets/images/share/pool-aerial.jpg'),
  },
  {
    type: 'preset',
    id: 'open-water',
    label: 'Águas abertas',
    source: require('@/assets/images/share/open-water.jpg'),
  },
  {
    type: 'preset',
    id: 'ripples',
    label: 'Ondulações',
    source: require('@/assets/images/share/ripples.jpg'),
  },
  {
    type: 'preset',
    id: 'deep-blue',
    label: 'Azul profundo',
    source: require('@/assets/images/share/deep-blue.jpg'),
  },
];
