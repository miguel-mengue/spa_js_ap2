import React, { useState } from 'react';
import { Heart, Volume2, Sparkles, ChevronRight } from 'lucide-react';
import { TYPE_CONFIG } from '../services/api';

/**
 * Componente ItemCard
 * Representa um card individual de Pokémon no catálogo
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
  const typeConfig = TYPE_CONFIG[pokemon.primaryType] || TYPE_CONFIG.normal;

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
      className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-sm"
    >
      {/* Luz ambiente de fundo combinando com o tipo */}
      <div
        className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${typeConfig.gradient} opacity-20 blur-2xl group-hover:opacity-35 transition-opacity`}
      ></div>

      {/* Cabeçalho do Card: Número do Pokédex e Botões de Ação */}
      <div className="flex justify-between items-center z-10">
        <span className="font-mono text-xs font-bold tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
          {pokemon.formattedId}
        </span>

        <div className="flex items-center gap-1.5">
          {pokemon.cryUrl && (
            <button
              type="button"
              onClick={handlePlayCry}
              title={`Ouvir o grito de ${pokemon.displayName}`}
              className={`p-1.5 rounded-full transition-colors ${
                isPlayingCry
                  ? 'bg-amber-500 text-slate-950 scale-110 animate-bounce'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 scale-105'
                : 'bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Imagem do Pokémon com transição */}
      <div className="relative py-4 flex items-center justify-center min-h-[170px]">
        <img
          src={pokemon.image || pokemon.animatedSprite}
          alt={pokemon.displayName}
          loading="lazy"
          className="w-36 h-36 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Informações: Nome e Tipos */}
      <div className="z-10 mt-2">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-rose-400 transition-colors tracking-tight flex items-center gap-1.5">
          {pokemon.displayName}
        </h3>

        {/* Badges de Tipo */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {pokemon.types.map((type) => {
            const config = TYPE_CONFIG[type] || TYPE_CONFIG.normal;
            return (
              <span
                key={type}
                className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${config.bg}`}
              >
                {config.label}
              </span>
            );
          })}
        </div>

        {/* Resumo de Atributos Base */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/50">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">HP</span>
            <span className="text-xs font-bold text-slate-200">
              {pokemon.stats.find((s) => s.rawName === 'hp')?.value || '-'}
            </span>
          </div>
          <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/50">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">ATK</span>
            <span className="text-xs font-bold text-slate-200">
              {pokemon.stats.find((s) => s.rawName === 'attack')?.value || '-'}
            </span>
          </div>
          <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/50">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">DEF</span>
            <span className="text-xs font-bold text-slate-200">
              {pokemon.stats.find((s) => s.rawName === 'defense')?.value || '-'}
            </span>
          </div>
        </div>

        {/* Botão de Rodapé para abrir detalhes */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
            <Sparkles className="w-3 h-3" /> Total: {pokemon.totalStats}
          </span>
          <span className="inline-flex items-center font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">
            Detalhes <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
