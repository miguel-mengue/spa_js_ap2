import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Componente Navbar
 * Barra de navegação superior simples e objetiva
 *
 * @param {{
 *   favoritesCount: number,
 *   totalLoaded: number,
 *   onlyFavorites: boolean,
 *   onToggleOnlyFavorites: () => void,
 * }} props
 */
export function Navbar({ favoritesCount, onlyFavorites, onToggleOnlyFavorites }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Identificação */}
        <div className="flex items-center gap-3">
          {/* Ícone clássico de Pokébola */}
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 bg-gradient-to-b from-rose-600 via-rose-600 to-white flex items-center justify-center relative overflow-hidden shadow-sm shrink-0">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-slate-800 -translate-y-1/2"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-800 relative z-10"></div>
          </div>

          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
              Pokédex
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Catálogo de Pokémon
            </p>
          </div>
        </div>

        {/* Botão de Favoritos */}
        <button
          type="button"
          onClick={onToggleOnlyFavorites}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
            onlyFavorites
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
          }`}
          title={onlyFavorites ? 'Mostrar todos' : 'Filtrar favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'text-rose-400'}`} />
          <span>Favoritos</span>
          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-black/30 text-white">
            {favoritesCount}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
