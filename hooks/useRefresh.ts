import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimum time the spinner stays on screen. Without it, a fast request turns
 * `refreshing` on and off in the same blink and the user sees no feedback at
 * all, left with the impression that the pull-to-refresh did nothing.
 */
const MIN_SPINNER_MS = 600;

/**
 * Pull-to-refresh state to hand to `UIScreen`. Ignores taps while already
 * refreshing and enforces the minimum spinner time.
 */
export function useRefresh(task: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const running = useRef(false);
  const mounted = useRef(true);

  // kept in a ref so `onRefresh` does not change identity on every render
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setRefreshing(true);

    const startedAt = Date.now();
    try {
      await taskRef.current();
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SPINNER_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_SPINNER_MS - elapsed),
        );
      }
      if (mounted.current) setRefreshing(false);
      running.current = false;
    }
  }, []);

  return { refreshing, onRefresh };
}
