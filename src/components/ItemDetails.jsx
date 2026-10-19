import React, { useState, useEffect } from 'react';
import { X, Heart, Volume2 } from 'lucide-react';
import { TYPE_CONFIG, fetchPokemonSpecies } from '../services/api';

/**
 * Componente ItemDetails
 * Modal com informações detalhadas, biologia e atributos do Pokémon selecionado
 *
 * @param {{
 *   pokemon: Object | null,
 *   onClose: () => void,
 *   isFavorite: boolean,
 *   onToggleFavorite: (pokemon: Object) => void,
 * }} props
 */
export function ItemDetails({ pokemon, onClose, isFavorite, onToggleFavorite }) {
  const [speciesInfo, setSpeciesInfo] = useState(null);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  // Fecha o modal ao pressionar a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Consome a espécie do Pokémon via useEffect para carregar descrição e biologia
  useEffect(() => {
    if (!pokemon?.id) return;

    let isMounted = true;
    const controller = new AbortController();

    async function loadSpecies() {
      setLoadingSpecies(true);
      try {
        const data = await fetchPokemonSpecies(pokemon.id, controller.signal);
        if (isMounted) setSpeciesInfo(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Erro ao carregar espécie:', err);
      } finally {
        if (isMounted) setLoadingSpecies(false);
      }
    }

    loadSpecies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pokemon?.id]);

  if (!pokemon) return null;

  const handlePlayCry = () => {
    if (!pokemon.cryUrl) return;
    try {
      const audio = new Audio(pokemon.cryUrl);
      audio.volume = 0.5;
      setIsPlayingCry(true);
      audio.play().catch((err) => console.warn('Erro ao reproduzir som:', err));
      audio.onended = () => setIsPlayingCry(false);
    } catch {
      setIsPlayingCry(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col text-slate-100"
      >
        {/* Topo do Modal */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={pokemon.image || pokemon.animatedSprite}
              alt={pokemon.displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0"
            />
            <div>
              <span className="text-xs font-mono text-slate-400">{pokemon.formattedId}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {pokemon.displayName}
              </h2>
              {speciesInfo?.genus && (
                <p className="text-xs text-slate-400 mt-0.5">{speciesInfo.genus}</p>
              )}

              {/* Tipos */}
              <div className="flex gap-1.5 mt-2">
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
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavorite(pokemon)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Descrição e Áudio */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              {loadingSpecies ? (
                <span className="text-slate-500 not-italic">Carregando informações da Pokédex...</span>
              ) : (
                `"${speciesInfo?.description || 'Um Pokémon registrado na Pokédex.'}"`
              )}
            </p>

            {pokemon.cryUrl && (
              <button
                type="button"
                onClick={handlePlayCry}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                  isPlayingCry
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingCry ? 'Tocando...' : 'Ouvir Som'}</span>
              </button>
            )}
          </div>

          {/* Dados Físicos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Altura</span>
              <span className="font-semibold text-slate-100">{pokemon.height} m</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Peso</span>
              <span className="font-semibold text-slate-100">{pokemon.weight} kg</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Experiência</span>
              <span className="font-semibold text-slate-100">{pokemon.baseExperience || 'N/A'}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Geração</span>
              <span className="font-semibold text-slate-100">{speciesInfo?.generation || 'GEN I'}</span>
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Habilidades:</h4>
            <div className="flex flex-wrap gap-1.5">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.name}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <span className="capitalize">{ability.name}</span>
                  {ability.isHidden && (
                    <span className="ml-1 text-[10px] text-amber-400 font-medium">(Oculta)</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Atributos Base */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs">
              <h4 className="font-semibold text-slate-400">Atributos Base (Stats):</h4>
              <span className="font-medium text-slate-300">Total: {pokemon.totalStats}</span>
            </div>

            <div className="space-y-2">
              {pokemon.stats.map((stat) => {
                const percentage = Math.min(100, Math.round((stat.value / 180) * 100));
                return (
                  <div key={stat.name} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-slate-400 text-right shrink-0">{stat.name}</span>
                    <span className="w-8 font-mono text-slate-200 text-right shrink-0 font-medium">
                      {stat.value}
                    </span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Pressione ESC para fechar</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
