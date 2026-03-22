import { useState, useEffect, useCallback, useRef } from "react";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Ejecuta una función async al montar el componente y cada vez que cambien las deps.
 * Reemplaza el patrón useEffect + fetch + setState en los componentes.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: readonly unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Guardamos siempre la última versión de fn sin que cambie la identidad de execute
  const fnRef = useRef(fn);
  fnRef.current = fn;

  // execute solo se recrea cuando cambian las deps (no cuando cambia fn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: e instanceof Error ? e.message : "Error desconocido",
      }));
    }
  }, deps);

  useEffect(() => {
    void execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
