import React, { useState, useEffect } from 'react';
import { X, Heart, Volume2, Shield, Zap, Sparkles, Scale, Ruler, Award, Info } from 'lucide-react';
import { TYPE_CONFIG, fetchPokemonSpecies } from '../services/api';

/**
 * Componente ItemDetails
 * Modal detalhado exibindo informações aprofundadas, atributos base e áudio do Pokémon selecionado
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

  const typeConfig = TYPE_CONFIG[pokemon.primaryType] || TYPE_CONFIG.normal;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 flex flex-col text-slate-100"
      >
        {/* Banner Superior com Cor de Destaque */}
        <div className={`relative p-6 bg-gradient-to-r ${typeConfig.gradient} overflow-hidden rounded-t-3xl`}>
          {/* Círculo decorativo */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

          {/* Botões de Ação do Topo */}
          <div className="flex items-center justify-between relative z-10">
            <span className="font-mono text-xs font-bold tracking-wider text-white/90 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
              {pokemon.formattedId}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(pokemon)}
                className={`p-2 rounded-full transition-all backdrop-blur-md border ${
                  isFavorite
                    ? 'bg-white text-rose-500 border-white'
                    : 'bg-black/30 text-white/80 hover:text-white border-white/20'
                }`}
                title={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-colors backdrop-blur-md border border-white/20"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Imagem Principal do Pokémon */}
          <div className="relative flex flex-col items-center justify-center pt-2 pb-4">
            <img
              src={pokemon.image || pokemon.animatedSprite}
              alt={pokemon.displayName}
              className="w-48 h-48 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-300"
            />
            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-2 drop-shadow-md">
              {pokemon.displayName}
            </h2>
            {speciesInfo?.genus && (
              <p className="text-xs text-white/80 font-medium tracking-wide mt-0.5">{speciesInfo.genus}</p>
            )}

            {/* Badges de Tipo */}
            <div className="flex gap-2 mt-3">
              {pokemon.types.map((type) => {
                const config = TYPE_CONFIG[type] || TYPE_CONFIG.normal;
                return (
                  <span
                    key={type}
                    className="text-xs px-3 py-1 rounded-full font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-sm"
                  >
                    {config.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Corpo do Modal com Informações e Atributos */}
        <div className="p-6 space-y-6">
          {/* Player de Grito e Descrição */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Sobre na Pokédex
              </span>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                {loadingSpecies ? (
                  <span className="animate-pulse">Consultando registro biológico na base de dados...</span>
                ) : (
                  speciesInfo?.description || 'Um Pokémon extraordinário registrado na região.'
                )}
              </p>
            </div>

            {pokemon.cryUrl && (
              <button
                type="button"
                onClick={handlePlayCry}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all border ${
                  isPlayingCry
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingCry ? 'Reproduzindo...' : 'Ouvir Grito'}</span>
              </button>
            )}
          </div>

          {/* Características Físicas (Altura, Peso, Experiência, Geração) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Ruler className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-400 block">Altura</span>
              <span className="text-sm font-bold text-slate-200">{pokemon.height} m</span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-400 block">Peso</span>
              <span className="text-sm font-bold text-slate-200">{pokemon.weight} kg</span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-400 block">Exp. Base</span>
              <span className="text-sm font-bold text-slate-200">{pokemon.baseExperience || 'N/A'}</span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-400 block">Geração</span>
              <span className="text-sm font-bold text-slate-200">
                {speciesInfo?.generation || 'GEN I'}
              </span>
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-400" /> Habilidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.name}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 ${
                    ability.isHidden
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800/80 text-slate-200 border-slate-700/80'
                  }`}
                >
                  <span className="capitalize">{ability.name}</span>
                  {ability.isHidden && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded uppercase font-bold">
                      Oculta
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Atributos Base com Barras de Progresso */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" /> Atributos Base (Stats)
              </h4>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                Total (BST): {pokemon.totalStats}
              </span>
            </div>

            <div className="space-y-2.5">
              {pokemon.stats.map((stat) => {
                const percentage = Math.min(100, Math.round((stat.value / 180) * 100));
                return (
                  <div key={stat.name} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-slate-400 font-medium text-right shrink-0">
                      {stat.name}
                    </span>
                    <span className="w-8 font-mono font-bold text-slate-200 text-right shrink-0">
                      {stat.value}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${typeConfig.bar}`}
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
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 rounded-b-3xl flex items-center justify-between">
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Pressione ESC ou clique fora para fechar
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
