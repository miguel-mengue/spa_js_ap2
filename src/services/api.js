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
  normal: { label: 'Normal', bg: 'bg-stone-500/20 text-stone-300 border-stone-500/40', gradient: 'from-stone-600 to-stone-800', bar: 'bg-stone-500' },
  fire: { label: 'Fogo', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', gradient: 'from-red-500 to-amber-600', bar: 'bg-orange-500' },
  water: { label: 'Água', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', gradient: 'from-blue-600 to-cyan-500', bar: 'bg-blue-500' },
  grass: { label: 'Planta', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', gradient: 'from-emerald-600 to-green-500', bar: 'bg-emerald-500' },
  electric: { label: 'Elétrico', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', gradient: 'from-amber-400 to-yellow-600', bar: 'bg-yellow-400' },
  ice: { label: 'Gelo', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', gradient: 'from-cyan-400 to-blue-500', bar: 'bg-cyan-400' },
  fighting: { label: 'Lutador', bg: 'bg-red-700/20 text-red-300 border-red-700/40', gradient: 'from-red-700 to-rose-900', bar: 'bg-red-600' },
  poison: { label: 'Veneno', bg: 'bg-purple-600/20 text-purple-300 border-purple-600/40', gradient: 'from-purple-600 to-fuchsia-800', bar: 'bg-purple-500' },
  ground: { label: 'Terra', bg: 'bg-amber-700/20 text-amber-300 border-amber-700/40', gradient: 'from-amber-600 to-stone-700', bar: 'bg-amber-600' },
  flying: { label: 'Voador', bg: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/40', gradient: 'from-indigo-400 to-sky-600', bar: 'bg-indigo-400' },
  psychic: { label: 'Psíquico', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/40', gradient: 'from-pink-500 to-rose-600', bar: 'bg-pink-500' },
  bug: { label: 'Inseto', bg: 'bg-lime-500/20 text-lime-300 border-lime-500/40', gradient: 'from-lime-600 to-emerald-700', bar: 'bg-lime-500' },
  rock: { label: 'Pedra', bg: 'bg-stone-600/20 text-stone-300 border-stone-600/40', gradient: 'from-stone-600 to-stone-800', bar: 'bg-stone-500' },
  ghost: { label: 'Fantasma', bg: 'bg-purple-900/30 text-purple-200 border-purple-800/40', gradient: 'from-purple-900 to-indigo-950', bar: 'bg-purple-700' },
  dragon: { label: 'Dragão', bg: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/40', gradient: 'from-indigo-700 to-purple-800', bar: 'bg-indigo-500' },
  steel: { label: 'Aço', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40', gradient: 'from-slate-600 to-zinc-700', bar: 'bg-slate-400' },
  fairy: { label: 'Fada', bg: 'bg-rose-400/20 text-rose-300 border-rose-400/40', gradient: 'from-rose-400 to-pink-600', bar: 'bg-rose-400' },
  dark: { label: 'Sombrio', bg: 'bg-neutral-800/40 text-neutral-300 border-neutral-700/50', gradient: 'from-neutral-800 to-black', bar: 'bg-neutral-600' },
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
