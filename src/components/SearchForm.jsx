import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, Heart, ArrowUpDown, Filter } from 'lucide-react';
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
    // Previne recarregamento da página e submete a busca
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'all' || sortBy !== 'id_asc' || onlyFavorites;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl shadow-black/20 backdrop-blur-md"
    >
      {/* Linha Principal de Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Input de Busca Textual (Controlado via props.searchTerm) */}
        <div className="relative md:col-span-5">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="pokemon-search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome ou número (ex: Pikachu, 25)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-sm text-slate-100 placeholder-slate-400 transition-all outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Select de Tipo (Controlado via props.selectedType) */}
        <div className="relative md:col-span-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            id="pokemon-type-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-950/70 border border-slate-700/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-sm text-slate-200 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="all">Todos os Tipos</option>
            {Object.entries(TYPE_CONFIG).map(([typeKey, typeInfo]) => (
              <option key={typeKey} value={typeKey} className="bg-slate-900 text-slate-100">
                {typeInfo.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Select de Ordenação (Controlado via props.sortBy) */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            id="pokemon-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full pl-9 pr-7 py-2.5 bg-slate-950/70 border border-slate-700/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-sm text-slate-200 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="id_asc" className="bg-slate-900 text-slate-100">Nº Crescente</option>
            <option value="id_desc" className="bg-slate-900 text-slate-100">Nº Decrescente</option>
            <option value="name_asc" className="bg-slate-900 text-slate-100">Nome (A - Z)</option>
            <option value="name_desc" className="bg-slate-900 text-slate-100">Nome (Z - A)</option>
            <option value="stats_desc" className="bg-slate-900 text-slate-100">Maior Poder</option>
          </select>
        </div>

        {/* Botão de Alternar Favoritos */}
        <div className="md:col-span-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleOnlyFavorites}
            className={`w-full py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border ${
              onlyFavorites
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/25'
                : 'bg-slate-950/70 text-slate-300 border-slate-700/70 hover:border-slate-600 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : 'text-rose-400'}`} />
            <span>Favoritos</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                onlyFavorites ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {favoritesCount}
            </span>
          </button>
        </div>
      </div>

      {/* Pílulas de filtro rápido por tipo */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Filtrar:</span>
          <button
            type="button"
            onClick={() => onTypeChange('all')}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Todos
          </button>
          {['fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'ghost'].map((typeKey) => {
            const config = TYPE_CONFIG[typeKey];
            const isSelected = selectedType === typeKey;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => onTypeChange(isSelected ? 'all' : typeKey)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all border ${
                  isSelected
                    ? 'border-white bg-slate-100 text-slate-950 font-bold shadow-md'
                    : `${config.bg} hover:brightness-125`
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Indicador de Resultados e Botão de Limpar */}
        <div className="flex items-center gap-3 text-xs text-slate-400 ml-auto">
          <span>
            Mostrando <strong className="text-rose-400">{totalResults}</strong> itens
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default SearchForm;
