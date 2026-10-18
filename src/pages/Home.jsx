import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import { fetchPokemonList, fetchPokemonByNameOrId } from '../services/api';
import { Navbar } from '../components/Navbar';
import { SearchForm } from '../components/SearchForm';
import { ItemList } from '../components/ItemList';
import { ItemDetails } from '../components/ItemDetails';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const PAGE_LIMIT = 24;

/**
 * Página Principal (Home)
 * Centraliza o estado da aplicação, orquestra hooks e comunicações via props
 */
export function Home() {
  // Estado da lista acumulada de Pokémon
  const [allPokemons, setAllPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estados dos formulários controlados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('id_asc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Estado do item selecionado para o modal de detalhes
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Estado de feedback / Toast transitório
  const [toastMessage, setToastMessage] = useState(null);

  // Custom Hook: useLocalStorage para persistência dos IDs favoritados
  const [favorites, setFavorites] = useLocalStorage('pokedex_favorites', [25, 6, 150]);

  // Custom Hook: useDebounce para suavizar a busca
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Custom Hook: useFetch para a carga inicial da API REST
  const {
    data: initialData,
    loading: initialLoading,
    error: apiError,
    refetch,
  } = useFetch((signal) => fetchPokemonList(PAGE_LIMIT, 0, signal), []);

  // Sincroniza os dados iniciais obtidos pelo useFetch no estado local
  useEffect(() => {
    if (initialData?.results) {
      setAllPokemons(initialData.results);
      setHasMore(Boolean(initialData.next));
    }
  }, [initialData]);

  // Exibe mensagem temporária tipo Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Alterna status de favorito de um Pokémon
  const handleToggleFavorite = useCallback(
    (pokemon) => {
      setFavorites((prevFavorites) => {
        const isFav = prevFavorites.includes(pokemon.id);
        if (isFav) {
          triggerToast(`${pokemon.displayName} removido dos favoritos.`);
          return prevFavorites.filter((id) => id !== pokemon.id);
        } else {
          triggerToast(`★ ${pokemon.displayName} adicionado aos favoritos!`);
          return [...prevFavorites, pokemon.id];
        }
      });
    },
    [setFavorites]
  );

  // Busca direta na API caso o usuário digite um Pokémon que ainda não foi carregado na página
  useEffect(() => {
    const cleanSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!cleanSearch) return;

    // Se já estiver na lista carregada, não precisa fazer requisição extra
    const alreadyLoaded = allPokemons.some(
      (p) => p.name.toLowerCase() === cleanSearch || String(p.id) === cleanSearch
    );
    if (alreadyLoaded) return;

    let isMounted = true;
    const controller = new AbortController();

    async function searchDirectly() {
      try {
        const directPokemon = await fetchPokemonByNameOrId(cleanSearch, controller.signal);
        if (isMounted && directPokemon) {
          setAllPokemons((prev) => {
            const exists = prev.some((p) => p.id === directPokemon.id);
            return exists ? prev : [directPokemon, ...prev];
          });
        }
      } catch {
        // Pokémon não encontrado na busca direta, filtragem local cuidará do empty state
      }
    }

    searchDirectly();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedSearchTerm, allPokemons]);

  // Função para carregar próxima página de Pokémon da API REST
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextOffset = offset + PAGE_LIMIT;

    try {
      const response = await fetchPokemonList(PAGE_LIMIT, nextOffset);
      setAllPokemons((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = response.results.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
      setOffset(nextOffset);
      setHasMore(Boolean(response.next));
    } catch (err) {
      triggerToast('Erro ao carregar mais Pokémon.');
    } finally {
      setLoadingMore(false);
    }
  };

  // Reseta todos os filtros controlados para os padrões iniciais
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSortBy('id_asc');
    setOnlyFavorites(false);
  };

  // Filtragem e Ordenação com useMemo para máxima performance
  const filteredAndSortedList = useMemo(() => {
    let list = [...allPokemons];

    // Filtro 1: Apenas Favoritos
    if (onlyFavorites) {
      list = list.filter((p) => favorites.includes(p.id));
    }

    // Filtro 2: Tipo de Pokémon
    if (selectedType !== 'all') {
      list = list.filter((p) => p.types.includes(selectedType));
    }

    // Filtro 3: Busca textual por Nome ou Pokédex Number
    if (debouncedSearchTerm.trim()) {
      const query = debouncedSearchTerm.trim().toLowerCase();
      list = list.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesId = String(p.id).includes(query);
        const matchesFormatted = p.formattedId.toLowerCase().includes(query);
        return matchesName || matchesId || matchesFormatted;
      });
    }

    // Ordenação
    list.sort((a, b) => {
      switch (sortBy) {
        case 'id_asc':
          return a.id - b.id;
        case 'id_desc':
          return b.id - a.id;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'stats_desc':
          return b.totalStats - a.totalStats;
        default:
          return a.id - b.id;
      }
    });

    return list;
  }, [allPokemons, onlyFavorites, favorites, selectedType, debouncedSearchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Notificação Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-rose-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-rose-500/20 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2.5 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho de Navegação */}
      <Navbar
        favoritesCount={favorites.length}
        totalLoaded={allPokemons.length}
        onlyFavorites={onlyFavorites}
        onToggleOnlyFavorites={() => setOnlyFavorites((prev) => !prev)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Hero Apresentação */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-slate-800/80 p-8 sm:p-10 mb-8 shadow-2xl backdrop-blur-sm">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avaliação Prática AP2 • React & PokéAPI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Explore o Universo Pokémon
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Consulte atributos, fraquezas, áudio oficial de grito e estatísticas em tempo real com consumo direto da PokéAPI REST, gerenciamento de estado e Tailwind CSS.
            </p>
          </div>
        </section>

        {/* Alerta de Erro de Requisição (caso a API falhe) */}
        {apiError && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-6 mb-8 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Falha na conexão com a PokéAPI</h4>
                <p className="text-xs text-rose-300/90">{apiError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refetch}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
            </button>
          </div>
        )}

        {/* Formulário Controlado de Busca e Filtros */}
        <SearchForm
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onlyFavorites={onlyFavorites}
          onToggleOnlyFavorites={() => setOnlyFavorites((prev) => !prev)}
          favoritesCount={favorites.length}
          totalResults={filteredAndSortedList.length}
          onReset={handleResetFilters}
        />

        {/* Grade de Listagem de Itens */}
        <ItemList
          items={filteredAndSortedList}
          loading={initialLoading}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectItem={setSelectedPokemon}
          onLoadMore={handleLoadMore}
          hasMore={hasMore && !onlyFavorites && selectedType === 'all' && !searchTerm}
          loadingMore={loadingMore}
          totalLoaded={allPokemons.length}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Modal de Detalhes do Pokémon Selecionado */}
      {selectedPokemon && (
        <ItemDetails
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Rodapé Acadêmico */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Trabalho de Avaliação Prática (AP2) • Faculdade de Análise e Desenvolvimento de Sistemas (ADS)
          </p>
          <p className="text-slate-400">
            Powered by <strong className="text-rose-400">PokéAPI</strong> &amp; <strong className="text-rose-400">Tailwind CSS</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
