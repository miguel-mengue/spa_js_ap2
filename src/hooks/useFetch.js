import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook: useFetch
 * Gerencia requisições assíncronas HTTP, estados de loading, erros e cancelamento limpo.
 *
 * @param {Function} fetchFunction Função assíncrona que recebe um AbortSignal e retorna dados
 * @param {Array} dependencies Lista de dependências que acionam uma nova requisição
 * @returns {{ data: any, loading: boolean, error: string | null, refetch: Function }}
 */
export function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mantém referência da função para evitar re-execuções desnecessárias
  const fetchFnRef = useRef(fetchFunction);
  useEffect(() => {
    fetchFnRef.current = fetchFunction;
  }, [fetchFunction]);

  const executeFetch = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current(signal);
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Ocorreu um erro ao carregar os dados.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    executeFetch(controller.signal);

    // Função de limpeza: aborta requisições em andamento ao desmontar
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    executeFetch(controller.signal);
  }, [executeFetch]);

  return { data, loading, error, refetch };
}

export default useFetch;
