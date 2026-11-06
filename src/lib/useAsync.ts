import { useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | undefined;
  error: Error | null;
  loading: boolean;
}

/**
 * Calls `load` on mount and tracks its loading, data and error state.
 * `load` must be a stable reference (a module-level function), otherwise it re-runs on every render.
 */
export function useAsync<T>(load: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: null, loading: true });

  useEffect(() => {
    let active = true;
    load()
      .then((data) => {
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((error: Error) => {
        if (active) setState({ data: undefined, error, loading: false });
      });
    return () => {
      active = false;
    };
  }, [load]);

  return state;
}
