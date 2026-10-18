import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemCardSkeleton } from './LoadingSpinner';
import { SearchX, Sparkles, PlusCircle } from 'lucide-react';

/**
 * Componente ItemList
 * Container responsável por renderizar a grade de cards ou estados vazios/loading
 *
 * @param {{
 *   items: Array<Object>,
 *   loading: boolean,
 *   favorites: Array<number>,
 *   onToggleFavorite: (pokemon: Object) => void,
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
  onSelectItem,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  totalLoaded = 0,
  onResetFilters,
}) {
  // Estado de Carregamento Inicial (renderiza skeletons responsivos)
  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ItemCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  // Estado Vazio (Nenhum item encontrado nos filtros)
  if (items.length === 0 && !loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center my-8 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/5">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">Nenhum Pokémon encontrado</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Não localizamos nenhum resultado para os termos e filtros selecionados. Tente buscar por outro nome, alterar o tipo ou resetar os filtros.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>
    );
  }

  // Lista Principal Renderizada
  return (
    <div className="space-y-8">
      {/* Grade Responsiva de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((pokemon) => (
          <ItemCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {/* Botão Carregar Mais / Paginação */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-6 pb-12 gap-3">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="group px-8 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-rose-500 text-slate-200 hover:text-white font-semibold text-sm shadow-xl shadow-black/40 hover:shadow-rose-500/10 transition-all duration-200 flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Carregando novos Pokémon...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-300" />
                <span>Carregar Mais Pokémon</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 font-medium">
            Exibindo <span className="text-slate-300 font-semibold">{totalLoaded}</span> Pokémon disponíveis nesta sessão
          </p>
        </div>
      )}
    </div>
  );
}

export default ItemList;
