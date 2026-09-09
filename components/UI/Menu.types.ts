import { ReactNode } from 'react';

export type UIMenuItem = {
  key: string;
  title: string;
  /** MaterialCommunityIcons name, the same set used by `Icon` from paper. */
  icon?: string;
  selected?: boolean;
  destructive?: boolean;
  onPress: () => void;
};

export type UIMenuProps = {
  items: UIMenuItem[];
  title?: string;
  disabled?: boolean;
  /** The always visible element that opens the menu. */
  children: ReactNode;
};
