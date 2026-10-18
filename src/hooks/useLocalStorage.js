import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Sincroniza estado do React com o localStorage do navegador.
 *
 * @param {string} key Chave no localStorage
 * @param {any} initialValue Valor padrão caso a chave não exista
 * @returns {[any, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler chave "${key}" do localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Erro ao gravar chave "${key}" no localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
