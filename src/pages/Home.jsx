import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import { fetchPokemonList, fetchPokemonByNameOrId } from '../services/api';
import { Navbar } from '../components/Navbar';
import { SearchForm } from '../components/SearchForm';
import { ItemList } from '../components/ItemList';
import { ItemDetails } from '../components/ItemDetails';
import { AlertCircle, RefreshCw, Heart } from 'lucide-react';

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
          triggerToast(`${pokemon.displayName} adicionado aos favoritos!`);
          return [...prevFavorites, pokemon.id];
        }
      });
    },
    [setFavorites]
  );

  // Busca direta na API caso o usuário busque por um Pokémon ainda não carregado
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
        // Pokémon não encontrado na busca direta; filtragem cuidará do estado vazio
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
    } catch {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notificação Simples */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Título da Página Simples e Direto */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Explorar Pokémon
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Consulte características, tipos elementais, atributos base e vocalizações oficiais consumidas da PokéAPI.
          </p>
        </div>

        {/* Alerta de Erro de Requisição (caso a API falhe) */}
        {apiError && (
          <div className="bg-rose-950/40 border border-rose-800 rounded-xl p-4 mb-6 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold text-rose-200">Falha ao conectar com a PokéAPI</p>
                <p className="text-rose-300/80">{apiError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refetch}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
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

      {/* Rodapé Simples e Honesto */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Trabalho de Avaliação Prática (AP2) • Análise e Desenvolvimento de Sistemas
          </p>
          <p>
            Dados fornecidos pela <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white underline">PokéAPI</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
