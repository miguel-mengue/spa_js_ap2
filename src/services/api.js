/**
 * Serviço de Integração com a PokéAPI REST
 * Avaliação Prática AP2 - Análise e Desenvolvimento de Sistemas
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache em memória para evitar requisições redundantes durante a navegação
const cache = new Map();

/**
 * Tradução e paleta de cores moderna por tipo de Pokémon
 */
export const TYPE_CONFIG = {
  normal: { label: 'Normal', bg: 'bg-stone-500/15 text-stone-300 border-stone-500/30', badge: 'bg-stone-500/20 text-stone-300 border-stone-500/40', gradient: 'from-stone-600/25 to-stone-900/40', accentBorder: 'hover:border-stone-500/60', bar: 'bg-stone-400', hex: '#A8A77A' },
  fire: { label: 'Fogo', bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40', gradient: 'from-orange-600/25 to-red-950/40', accentBorder: 'hover:border-orange-500/60', bar: 'bg-orange-500', hex: '#EE8130' },
  water: { label: 'Água', bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', gradient: 'from-sky-600/25 to-blue-950/50', accentBorder: 'hover:border-sky-500/60', bar: 'bg-sky-500', hex: '#6390F0' },
  grass: { label: 'Planta', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', gradient: 'from-emerald-600/25 to-teal-950/50', accentBorder: 'hover:border-emerald-500/60', bar: 'bg-emerald-500', hex: '#7AC74C' },
  electric: { label: 'Elétrico', bg: 'bg-amber-400/15 text-amber-300 border-amber-400/30', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40', gradient: 'from-amber-500/25 to-yellow-950/50', accentBorder: 'hover:border-amber-400/60', bar: 'bg-amber-400', hex: '#F7D02C' },
  ice: { label: 'Gelo', bg: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30', badge: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/40', gradient: 'from-cyan-500/25 to-blue-950/50', accentBorder: 'hover:border-cyan-400/60', bar: 'bg-cyan-400', hex: '#96D9D6' },
  fighting: { label: 'Lutador', bg: 'bg-rose-700/15 text-rose-300 border-rose-700/30', badge: 'bg-rose-700/20 text-rose-200 border-rose-700/40', gradient: 'from-rose-700/25 to-red-950/50', accentBorder: 'hover:border-rose-600/60', bar: 'bg-rose-600', hex: '#C22E28' },
  poison: { label: 'Veneno', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30', badge: 'bg-purple-500/20 text-purple-200 border-purple-500/40', gradient: 'from-purple-600/25 to-fuchsia-950/50', accentBorder: 'hover:border-purple-500/60', bar: 'bg-purple-500', hex: '#A33EA1' },
  ground: { label: 'Terra', bg: 'bg-amber-700/15 text-amber-300 border-amber-700/30', badge: 'bg-amber-700/20 text-amber-200 border-amber-700/40', gradient: 'from-amber-700/25 to-stone-950/50', accentBorder: 'hover:border-amber-600/60', bar: 'bg-amber-600', hex: '#E2BF65' },
  flying: { label: 'Voador', bg: 'bg-indigo-400/15 text-indigo-300 border-indigo-400/30', badge: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/40', gradient: 'from-indigo-500/25 to-sky-950/50', accentBorder: 'hover:border-indigo-400/60', bar: 'bg-indigo-400', hex: '#A98FF3' },
  psychic: { label: 'Psíquico', bg: 'bg-pink-500/15 text-pink-300 border-pink-500/30', badge: 'bg-pink-500/20 text-pink-200 border-pink-500/40', gradient: 'from-pink-600/25 to-rose-950/50', accentBorder: 'hover:border-pink-500/60', bar: 'bg-pink-500', hex: '#F95587' },
  bug: { label: 'Inseto', bg: 'bg-lime-500/15 text-lime-300 border-lime-500/30', badge: 'bg-lime-500/20 text-lime-200 border-lime-500/40', gradient: 'from-lime-600/25 to-emerald-950/50', accentBorder: 'hover:border-lime-500/60', bar: 'bg-lime-500', hex: '#A6B91A' },
  rock: { label: 'Pedra', bg: 'bg-stone-500/15 text-stone-300 border-stone-500/30', badge: 'bg-stone-500/20 text-stone-200 border-stone-500/40', gradient: 'from-stone-600/25 to-stone-950/50', accentBorder: 'hover:border-stone-500/60', bar: 'bg-stone-500', hex: '#B6A136' },
  ghost: { label: 'Fantasma', bg: 'bg-violet-600/15 text-violet-300 border-violet-600/30', badge: 'bg-violet-600/20 text-violet-200 border-violet-600/40', gradient: 'from-violet-800/25 to-indigo-950/60', accentBorder: 'hover:border-violet-500/60', bar: 'bg-violet-500', hex: '#735797' },
  dragon: { label: 'Dragão', bg: 'bg-indigo-600/15 text-indigo-300 border-indigo-600/30', badge: 'bg-indigo-600/20 text-indigo-200 border-indigo-600/40', gradient: 'from-indigo-700/25 to-blue-950/60', accentBorder: 'hover:border-indigo-500/60', bar: 'bg-indigo-500', hex: '#6F35FC' },
  steel: { label: 'Aço', bg: 'bg-slate-400/15 text-slate-300 border-slate-400/30', badge: 'bg-slate-400/20 text-slate-200 border-slate-400/40', gradient: 'from-slate-600/25 to-zinc-950/50', accentBorder: 'hover:border-slate-400/60', bar: 'bg-slate-400', hex: '#B7B7CE' },
  fairy: { label: 'Fada', bg: 'bg-pink-400/15 text-pink-300 border-pink-400/30', badge: 'bg-pink-400/20 text-pink-200 border-pink-400/40', gradient: 'from-pink-500/25 to-rose-950/50', accentBorder: 'hover:border-pink-400/60', bar: 'bg-pink-400', hex: '#D685AD' },
  dark: { label: 'Sombrio', bg: 'bg-zinc-700/20 text-zinc-300 border-zinc-600/30', badge: 'bg-zinc-700/30 text-zinc-200 border-zinc-600/40', gradient: 'from-zinc-800/30 to-stone-950/80', accentBorder: 'hover:border-zinc-500/60', bar: 'bg-zinc-500', hex: '#705746' },
};

/**
 * Normaliza os dados crus do Pokémon retornados pela API
 */
export function formatPokemonData(data) {
  if (!data) return null;

  const artwork =
    data.sprites?.other?.['official-artwork']?.front_default ||
    data.sprites?.other?.home?.front_default ||
    data.sprites?.front_default ||
    '';

  const types = (data.types || []).map((t) => t.type.name);
  const primaryType = types[0] || 'normal';

  const statsMap = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Velocidade',
  };

  const stats = (data.stats || []).map((s) => ({
    name: statsMap[s.stat.name] || s.stat.name,
    rawName: s.stat.name,
    value: s.base_stat,
    max: 255,
  }));

  const totalStats = stats.reduce((acc, curr) => acc + curr.value, 0);

  return {
    id: data.id,
    formattedId: `#${String(data.id).padStart(4, '0')}`,
    name: data.name,
    displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1).replace('-', ' '),
    image: artwork,
    animatedSprite: data.sprites?.other?.showdown?.front_default || data.sprites?.front_default,
    types,
    primaryType,
    height: (data.height / 10).toFixed(1), // decímetros -> metros
    weight: (data.weight / 10).toFixed(1), // hectogramas -> kg
    baseExperience: data.base_experience,
    stats,
    totalStats,
    abilities: (data.abilities || []).map((a) => ({
      name: a.ability.name.replace('-', ' '),
      isHidden: a.is_hidden,
    })),
    cryUrl: data.cries?.latest || data.cries?.legacy || null,
  };
}

/**
 * Busca lista paginada de Pokémon e resolve os detalhes de cada um
 * @param {number} limit Quantidade de itens
 * @param {number} offset Deslocamento da paginação
 * @param {AbortSignal} [signal] Sinal de cancelamento para requisição limpa
 */
export async function fetchPokemonList(limit = 24, offset = 0, signal) {
  const cacheKey = `list_${limit}_${offset}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  if (!response.ok) {
    throw new Error(`Erro ao buscar catálogo de Pokémon (Status: ${response.status})`);
  }

  const listData = await response.json();

  // Busca detalhes de todos os Pokémon da página em paralelo
  const detailsPromises = listData.results.map(async (item) => {
    try {
      const detailRes = await fetch(item.url, { signal });
      if (!detailRes.ok) return null;
      const detailJson = await detailRes.json();
      return formatPokemonData(detailJson);
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      return null;
    }
  });

  const pokemonList = (await Promise.all(detailsPromises)).filter(Boolean);

  const result = {
    count: listData.count,
    next: listData.next,
    previous: listData.previous,
    results: pokemonList,
  };

  cache.set(cacheKey, result);
  return result;
}

/**
 * Busca um Pokémon específico por Nome ou ID numérico
 * @param {string|number} identifier Nome ou ID
 * @param {AbortSignal} [signal]
 */
export async function fetchPokemonByNameOrId(identifier, signal) {
  const cleanId = String(identifier).trim().toLowerCase();
  if (!cleanId) return null;

  const cacheKey = `poke_${cleanId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await fetch(`${BASE_URL}/pokemon/${cleanId}`, { signal });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pokémon "${identifier}" não encontrado.`);
    }
    throw new Error(`Erro ao buscar Pokémon (Status: ${response.status})`);
  }

  const data = await response.json();
  const formatted = formatPokemonData(data);
  cache.set(cacheKey, formatted);
  return formatted;
}

/**
 * Busca a descrição da espécie (Flavor Text) e geração do Pokémon
 * @param {number} id ID do Pokémon
 * @param {AbortSignal} [signal]
 */
export async function fetchPokemonSpecies(id, signal) {
  const cacheKey = `species_${id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`, { signal });
    if (!response.ok) return null;

    const data = await response.json();

    // Procura descrição em Português ou fallback para Inglês
    const entryPt = data.flavor_text_entries?.find((e) => e.language?.name === 'pt' || e.language?.name === 'pt-BR');
    const entryEn = data.flavor_text_entries?.find((e) => e.language?.name === 'en');
    const rawText = (entryPt || entryEn)?.flavor_text || 'Sem descrição cadastrada.';
    const cleanText = rawText.replace(/[\f\n\r\t]/g, ' ');

    const speciesData = {
      description: cleanText,
      genus: data.genera?.find((g) => g.language?.name === 'en')?.genus || '',
      generation: data.generation?.name?.toUpperCase()?.replace('-', ' ') || 'GEN I',
      habitat: data.habitat?.name || 'Desconhecido',
      captureRate: data.capture_rate,
      happiness: data.base_happiness,
      growthRate: data.growth_rate?.name?.replace('-', ' ') || 'Normal',
    };

    cache.set(cacheKey, speciesData);
    return speciesData;
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return null;
  }
}
