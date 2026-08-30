import { UIButton } from '@/components/UI/Button';
import { ShareCard } from '@/components/Workouts/ShareCard';
import {
  SHARE_BACKGROUNDS,
  ShareBackground,
} from '@/constants/shareBackgrounds';
import { useSnackbar } from '@/contexts/SnackbarProvider';
import {
  isInstagramStoryAvailable,
  shareToInstagramStory,
} from '@/modules/instagram-story-share';
import WorkoutService, { IWorkout } from '@/services/workout.service';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { ActivityIndicator, Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import styled from 'styled-components/native';

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;
const CARD_RATIO = 9 / 16;

// Instagram paints this gradient behind the sticker, so the rounded corners
// stay transparent instead of being flattened over black by the share sheet
const STORY_TOP_COLOR = '#0B2A4A';
const STORY_BOTTOM_COLOR = '#050B14';
const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? '';

export default function ShareWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { snack } = useSnackbar();
  const insets = useSafeAreaInsets();
  const cardRef = useRef<View>(null);
  const [workout, setWorkout] = useState<IWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [sharingStory, setSharingStory] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [flatCorners, setFlatCorners] = useState(false);
  const [storiesAvailable] = useState(
    () => !!FACEBOOK_APP_ID && isInstagramStoryAvailable(),
  );
  const [background, setBackground] = useState<ShareBackground>(
    SHARE_BACKGROUNDS[0],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);

    WorkoutService.get(id)
      .then((data) => {
        if (active) setWorkout(data);
      })
      .catch((error) => {
        if (!active) return;
        const status = error?.response?.status;

        snack(
          status === 403
            ? 'Você não tem mais acesso a este treino'
            : status === 404
              ? 'Treino não encontrado'
              : 'Erro ao carregar o treino',
        );
        router.back();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // the card is the tallest element, so it takes whatever the other rows leave
  const onPreviewLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCardWidth(Math.min(width, height * CARD_RATIO));
  };

  const pickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        snack('Permita o acesso à galeria para usar sua própria imagem');
        return;
      }

      // no allowsEditing: the iOS crop UI is square-only, so the framing is
      // done on the card itself (drag and pinch), the same way on both platforms
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled) {
        setBackground({ type: 'photo', uri: result.assets[0].uri });
      }
    } catch {
      snack('Erro ao abrir a galeria');
    }
  };

  const capture = () =>
    captureRef(cardRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
    });

  /**
   * The share sheet and most apps flatten the PNG alpha over black, so the
   * rounded corners would come out as black wedges. Only the Instagram story
   * composer paints its own background behind them, so it keeps the radius.
   */
  const captureSquared = async () => {
    setFlatCorners(true);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

    try {
      return await capture();
    } finally {
      setFlatCorners(false);
    }
  };

  const share = async () => {
    if (!cardRef.current) return;

    try {
      setSharing(true);

      if (!(await Sharing.isAvailableAsync())) {
        snack('Compartilhamento indisponível neste dispositivo');
        return;
      }

      await Sharing.shareAsync(await captureSquared(), {
        mimeType: 'image/png',
        UTI: 'public.png',
        dialogTitle: 'Compartilhar treino',
      });
    } catch {
      snack('Erro ao gerar a imagem do treino');
    } finally {
      setSharing(false);
    }
  };

  const shareToStories = async () => {
    if (!cardRef.current) return;

    try {
      setSharingStory(true);

      await shareToInstagramStory(await capture(), {
        appId: FACEBOOK_APP_ID,
        backgroundTopColor: STORY_TOP_COLOR,
        backgroundBottomColor: STORY_BOTTOM_COLOR,
      });
    } catch {
      snack('Erro ao abrir o Instagram Stories');
    } finally {
      setSharingStory(false);
    }
  };

  const date = workout
    ? new Date(workout.completed_at ?? workout.scheduled_at)
    : new Date();

  return (
    <Screen
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <HeaderRow>
        <BackButton onPress={() => router.back()}>
          <Icon source="arrow-left" size={22} color={theme.colors.onSurface} />
        </BackButton>
        <ScreenTitle numberOfLines={1}>Compartilhar treino</ScreenTitle>
      </HeaderRow>

      <Preview onLayout={onPreviewLayout}>
        {loading || !workout ? (
          <ActivityIndicator />
        ) : (
          cardWidth > 0 && (
            <View style={{ width: cardWidth }}>
              <ShareCard
                ref={cardRef}
                width={cardWidth}
                rounded={!flatCorners}
                date={date}
                distance={workout.total_distance ?? 0}
                duration={workout.total_duration ?? 0}
                background={background}
              />
            </View>
          )
        )}
      </Preview>

      {!loading && !!workout && (
        <>
          <Hint>
            {background.type === 'photo'
              ? 'Arraste e use dois dedos para enquadrar a foto'
              : 'Escolha um fundo ou use uma foto sua'}
          </Hint>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            style={{ flexGrow: 0 }}
          >
            <PhotoOption
              onPress={pickPhoto}
              $selected={background.type === 'photo'}
            >
              {background.type === 'photo' ? (
                <Thumbnail source={{ uri: background.uri }} contentFit="cover" />
              ) : (
                <Icon source="image-plus" size={22} color={theme.colors.primary} />
              )}
            </PhotoOption>

            {SHARE_BACKGROUNDS.map((option) => (
              <Option
                key={option.id}
                onPress={() => setBackground(option)}
                $selected={
                  background.type === 'preset' && background.id === option.id
                }
              >
                <Thumbnail source={option.source} contentFit="cover" />
              </Option>
            ))}
          </ScrollView>

          {storiesAvailable && (
            <UIButton
              text="Instagram Stories"
              iconLeft="instagram"
              loading={sharingStory}
              disabled={sharing}
              onPress={shareToStories}
              fullWidth
              style={{ backgroundColor: '#C13584' }}
            />
          )}

          <UIButton
            text="Compartilhar"
            iconLeft="share-variant"
            loading={sharing}
            disabled={sharingStory}
            onPress={share}
            fullWidth
          />
        </>
      )}
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  gap: 16px;
  padding-horizontal: 24px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.Pressable`
  padding: 4px;
`;

const ScreenTitle = styled.Text`
  flex: 1;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Preview = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Hint = styled.Text`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const Option = styled.Pressable<{ $selected: boolean }>`
  width: 48px;
  height: 64px;
  border-radius: 12px;
  padding: 2px;
  border-width: 2px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : 'transparent'};
`;

const PhotoOption = styled(Option)`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`;

const Thumbnail = styled(Image)`
  flex: 1;
  border-radius: 10px;
`;
