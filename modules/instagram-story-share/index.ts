import { requireOptionalNativeModule } from 'expo-modules-core';

export type InstagramStoryOptions = {
  /** Facebook App ID registered for this app; Instagram rejects the share without it. */
  appId: string;
  /** Gradient painted behind the sticker inside the story. */
  backgroundTopColor?: string;
  backgroundBottomColor?: string;
};

type InstagramStoryShareModule = {
  isAvailable(): boolean;
  shareAsync(fileUri: string, options: InstagramStoryOptions): Promise<void>;
};

// optional: dev builds made before this module existed simply don't have it
const InstagramStoryShare =
  requireOptionalNativeModule<InstagramStoryShareModule>('InstagramStoryShare');

/** Whether Instagram is installed and can receive a story sticker. */
export function isInstagramStoryAvailable(): boolean {
  return InstagramStoryShare?.isAvailable() ?? false;
}

/**
 * Sends a PNG to the Instagram Stories composer as a sticker, which keeps the
 * transparency around the card (the share sheet flattens it over black).
 */
export function shareToInstagramStory(
  fileUri: string,
  options: InstagramStoryOptions,
): Promise<void> {
  if (!InstagramStoryShare) {
    return Promise.reject(
      new Error('InstagramStoryShare is missing from this build'),
    );
  }

  return InstagramStoryShare.shareAsync(fileUri, options);
}
