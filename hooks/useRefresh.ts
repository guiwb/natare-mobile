import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tempo minimo com o spinner na tela. Sem isso, uma request rapida liga e
 * desliga o `refreshing` no mesmo piscar e o usuario nao ve feedback nenhum,
 * ficando com a impressao de que o pull-to-refresh nao fez nada.
 */
const MIN_SPINNER_MS = 600;

/**
 * Estado de pull-to-refresh para passar ao `UIScreen`. Ignora toques enquanto
 * ja esta atualizando e garante o tempo minimo de spinner.
 */
export function useRefresh(task: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const running = useRef(false);
  const mounted = useRef(true);

  // mantido em ref para o `onRefresh` nao mudar de identidade a cada render
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
