import React, { useState } from 'react';
import { Heart, Volume2, ChevronRight } from 'lucide-react';
import { TYPE_CONFIG } from '../services/api';

/**
 * Componente ItemCard
 * Card individual de apresentação do Pokémon
 *
 * @param {{
 *   pokemon: Object,
 *   isFavorite: boolean,
 *   onToggleFavorite: (pokemon: Object) => void,
 *   onSelect: (pokemon: Object) => void
 * }} props
 */
export function ItemCard({ pokemon, isFavorite, onToggleFavorite, onSelect }) {
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  const handlePlayCry = (e) => {
    e.stopPropagation();
    if (!pokemon.cryUrl) return;

    try {
      const audio = new Audio(pokemon.cryUrl);
      audio.volume = 0.4;
      setIsPlayingCry(true);
      audio.play().catch((err) => console.warn('Erro ao tocar som:', err));
      audio.onended = () => setIsPlayingCry(false);
    } catch {
      setIsPlayingCry(false);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(pokemon);
  };

  return (
    <div
      onClick={() => onSelect(pokemon)}
      className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40 cursor-pointer flex flex-col justify-between"
    >
      {/* Topo do Card: Número do Pokédex e Ações */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs font-semibold text-slate-400">
          {pokemon.formattedId}
        </span>

        <div className="flex items-center gap-1">
          {pokemon.cryUrl && (
            <button
              type="button"
              onClick={handlePlayCry}
              title={`Ouvir som de ${pokemon.displayName}`}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isPlayingCry
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Imagem do Pokémon */}
      <div className="py-4 flex items-center justify-center min-h-[140px]">
        <img
          src={pokemon.image || pokemon.animatedSprite}
          alt={pokemon.displayName}
          loading="lazy"
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Informações: Nome, Tipos e Detalhes */}
      <div>
        <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
          {pokemon.displayName}
        </h3>

        {/* Tipos */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {pokemon.types.map((type) => {
            const config = TYPE_CONFIG[type] || TYPE_CONFIG.normal;
            return (
              <span
                key={type}
                className={`text-[11px] px-2 py-0.5 rounded font-medium border ${config.badge}`}
              >
                {config.label}
              </span>
            );
          })}
        </div>

        {/* Rodapé do Card */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Poder: <strong className="text-slate-200 font-semibold">{pokemon.totalStats}</strong></span>
          <span className="text-rose-400 group-hover:text-rose-300 font-medium inline-flex items-center">
            Detalhes <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
