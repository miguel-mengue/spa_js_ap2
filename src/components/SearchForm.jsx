import React from 'react';
import { Search, X, RotateCcw, Heart } from 'lucide-react';
import { TYPE_CONFIG } from '../services/api';

/**
 * Componente SearchForm (Formulário Controlado)
 * Gerencia a entrada de dados do usuário para busca, filtros por tipo, ordenação e favoritos.
 *
 * @param {{
 *   searchTerm: string,
 *   onSearchChange: (value: string) => void,
 *   selectedType: string,
 *   onTypeChange: (type: string) => void,
 *   sortBy: string,
 *   onSortChange: (sort: string) => void,
 *   onlyFavorites: boolean,
 *   onToggleOnlyFavorites: () => void,
 *   favoritesCount: number,
 *   totalResults: number,
 *   onReset: () => void,
 * }} props
 */
export function SearchForm({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
  totalResults,
  onReset,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'all' || sortBy !== 'id_asc' || onlyFavorites;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Input de Busca Textual */}
        <div className="relative lg:col-span-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="pokemon-search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome ou número..."
            className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtro por Tipo */}
        <div className="lg:col-span-3">
          <select
            id="pokemon-type-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-sm text-slate-200 outline-none cursor-pointer transition-colors"
          >
            <option value="all">Todos os Tipos</option>
            {Object.entries(TYPE_CONFIG).map(([typeKey, typeInfo]) => (
              <option key={typeKey} value={typeKey} className="bg-slate-900 text-slate-100">
                {typeInfo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div className="lg:col-span-2">
          <select
            id="pokemon-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-sm text-slate-200 outline-none cursor-pointer transition-colors"
          >
            <option value="id_asc" className="bg-slate-900 text-slate-100">Nº Crescente</option>
            <option value="id_desc" className="bg-slate-900 text-slate-100">Nº Decrescente</option>
            <option value="name_asc" className="bg-slate-900 text-slate-100">Nome (A - Z)</option>
            <option value="name_desc" className="bg-slate-900 text-slate-100">Nome (Z - A)</option>
            <option value="stats_desc" className="bg-slate-900 text-slate-100">Maior Poder</option>
          </select>
        </div>

        {/* Botão de Favoritos */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={onToggleOnlyFavorites}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer ${
              onlyFavorites
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'text-rose-400'}`} />
            <span>Favoritos</span>
            <span className="px-1.5 py-0.2 rounded text-[11px] bg-slate-800 text-slate-300">
              {favoritesCount}
            </span>
          </button>
        </div>
      </div>

      {/* Barra de Resumo e Reset */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>
          Mostrando <strong className="text-white font-medium">{totalResults}</strong> Pokémon
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchForm;
