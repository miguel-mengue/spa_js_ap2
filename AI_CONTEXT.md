# 🧠 Contexto do Repositório para Modelos de IA (AI Context)

> **Resumo Rápido para LLMs:** Este repositório contém a **Avaliação Prática AP2** (Faculdade de Análise e Desenvolvimento de Sistemas). É um catálogo interativo em **React 19 + Vite 8 + Tailwind CSS v4** consumindo a **PokéAPI REST**.
> 
> *Para a especificação técnica completa, consulte o arquivo detalhado: [`AGENTS.md`](./AGENTS.md).*

---

## ⚡ Guia Rápido de Arquitetura

### 1. Componentes (`src/components/`)
- **`Navbar.jsx`:** Cabeçalho com logo, contadores em tempo real e botão de alternar visualização de favoritos.
- **`SearchForm.jsx`:** Formulário 100% controlado por estado (`searchTerm`, `selectedType`, `sortBy`, `onlyFavorites`, `onReset`).
- **`ItemList.jsx`:** Grade responsiva (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`), tratamento de lista vazia e botão de paginação (*Carregar Mais*).
- **`ItemCard.jsx`:** Card individual de cada criatura, exibindo imagem oficial, badges com as cores oficiais de cada tipo, atributos base, botão de favoritar e botão de reprodução do áudio oficial do grito (*cry*).
- **`ItemDetails.jsx`:** Modal rico que se abre ao clicar em um card, exibindo biologia da espécie, geração, altura, peso, habilidades (incluindo ocultas) e barras gráficas proporcionais de todos os 6 atributos base.
- **`LoadingSpinner.jsx`:** Indicador giratório em formato de Pokébola e componentes de *Skeleton Loading*.

### 2. Custom Hooks (`src/hooks/`)
- **`useFetch.js`:** Encapsula chamadas HTTP com `AbortController`, `loading`, `error` e função `refetch`.
- **`useLocalStorage.js`:** Sincroniza o array de IDs de favoritos no `localStorage` do navegador.
- **`useDebounce.js`:** Atrasa a emissão de alterações no campo de busca para evitar renderizações excessivas.

### 3. Camada de Serviço (`src/services/`)
- **`api.js`:** Comunicação com a PokéAPI (`https://pokeapi.co/api/v2`), normalização dos dados recebidos, sistema de cache em memória (`Map`) e paleta de cores/gradientes por tipo (`TYPE_CONFIG`).

### 4. Página Principal (`src/pages/`)
- **`Home.jsx`:** Gerencia o estado central da aplicação, orquestra os hooks, realiza a filtragem e ordenação combinadas com `useMemo` e distribui os dados via `props`.

---

## 📋 Critérios Avaliativos (Rubrica de 1,5 pts)

1. **Props e comunicação entre componentes (0,3 pts)**
2. **useState (0,1 pt)**
3. **useEffect e consumo de API (0,4 pts)**
4. **Custom Hook (0,4 pts)**
5. **Formulário controlado (0,1 pt)**
6. **Estilização com Tailwind CSS (0,3 pt)**
7. **Organização e boas práticas (0,1 pt)**
8. **Documentação acadêmica (0,3 pt)**

---

## 💻 Comandos Essenciais

- Iniciar ambiente de desenvolvimento: `npm run dev`
- Gerar build de validação: `npm run build`
- Rodar linter: `npm run lint`
