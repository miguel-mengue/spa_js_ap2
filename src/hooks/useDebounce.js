import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Atrasa a atualização de um valor até que um período de tempo tenha transcorrido sem novas alterações.
 *
 * @param {any} value Valor a ser atrasado
 * @param {number} delay Tempo de espera em milissegundos
 * @returns {any} Valor com debounce aplicado
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
