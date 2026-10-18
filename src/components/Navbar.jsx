import React from 'react';
import { Heart, Sparkles, BookOpen, Layers } from 'lucide-react';

/**
 * Componente Navbar
 * Cabeçalho principal da aplicação com estatísticas rápidas e identidade visual moderna
 *
 * @param {{
 *   favoritesCount: number,
 *   totalLoaded: number,
 *   onlyFavorites: boolean,
 *   onToggleOnlyFavorites: () => void,
 * }} props
 */
export function Navbar({ favoritesCount, totalLoaded, onlyFavorites, onToggleOnlyFavorites }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Identidade Visual / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/25 flex items-center justify-center group cursor-pointer">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
              <div className="relative w-6 h-6 rounded-full border-2 border-rose-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white m-0 leading-none">
                Poké<span className="text-rose-500">Catalog</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                AP2 • ADS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5 hidden sm:block">
              Catálogo Interativo com Consumo de API REST & Tailwind CSS
            </p>
          </div>
        </div>

        {/* Estatísticas e Ações Rápidas */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Disponíveis:</span>
            <strong className="text-slate-200 font-bold">{totalLoaded}</strong>
          </div>

          <button
            type="button"
            onClick={onToggleOnlyFavorites}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              onlyFavorites
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/25'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">Meus Favoritos</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                onlyFavorites ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {favoritesCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
