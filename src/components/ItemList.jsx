import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemCardSkeleton } from './LoadingSpinner';
import { SearchX } from 'lucide-react';

/**
 * Componente ItemList
 * Container da grade de Pokémon com tratamento de estados
 *
 * @param {{
 *   items: Array<Object>,
 *   loading: boolean,
 *   favorites: Array<number>,
 *   onToggleFavorite: (pokemon: Object) => void,
 *   onSelect: (pokemon: Object) => void,
 *   onSelectItem: (pokemon: Object) => void,
 *   onLoadMore?: () => void,
 *   hasMore?: boolean,
 *   loadingMore?: boolean,
 *   totalLoaded?: number,
 *   onResetFilters?: () => void,
 * }} props
 */
export function ItemList({
  items = [],
  loading = false,
  favorites = [],
  onToggleFavorite,
  onSelect,
  onSelectItem,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  totalLoaded = 0,
  onResetFilters,
}) {
  const handleSelect = onSelectItem || onSelect;

  // Estado de Carregamento Inicial
  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ItemCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  // Estado Vazio (Nenhum resultado nos filtros)
  if (items.length === 0 && !loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Nenhum Pokémon encontrado</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-4">
          Tente buscar por outro termo ou limpe os filtros para visualizar mais itens.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  // Lista de Cards
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((pokemon) => (
          <ItemCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Botão Carregar Mais */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-4 pb-8 gap-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loadingMore ? 'Carregando...' : 'Carregar mais Pokémon'}
          </button>
          <span className="text-[11px] text-slate-500 font-mono">
            {totalLoaded} carregados
          </span>
        </div>
      )}
    </div>
  );
}

export default ItemList;
