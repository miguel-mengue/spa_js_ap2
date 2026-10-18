# 🔴 PokéCatalog Explorer — Avaliação Prática (AP2)

> **Curso:** Análise e Desenvolvimento de Sistemas (ADS)  
> **Disciplina:** Desenvolvimento de Aplicações Web / Banco de Dados / Frontend  
> **Tema:** Catálogo Interativo com Consumo de API REST, React, Gerenciamento de Estado e Tailwind CSS  
> **API Externa:** [PokéAPI](https://pokeapi.co/) (RESTful API pública)  

---

## 📋 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Demonstração e Funcionalidades](#-demonstração-e-funcionalidades)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Estrutura de Pastas e Componentização](#-estrutura-de-pastas-e-componentização)
5. [Atendimento aos Critérios de Avaliação](#-atendimento-aos-critérios-de-avaliação)
   - [Comunicação por Props](#1-comunicação-por-props)
   - [Gerenciamento de Estado com useState](#2-gerenciamento-de-estado-com-usestate)
   - [Efeitos Colaterais com useEffect](#3-efeitos-colaterais-com-useeffect)
   - [Custom Hooks (`useFetch`, `useLocalStorage`, `useDebounce`)](#4-custom-hooks)
   - [Formulário Controlado](#5-formulário-controlado)
   - [Estilização com Tailwind CSS](#6-estilização-com-tailwind-css)
6. [API REST e Endpoints Utilizados](#-api-rest-e-endpoints-utilizados)
7. [Instruções de Instalação e Execução](#-instruções-de-instalação-e-execução)
8. [Boas Práticas e Qualidade de Código](#-boas-práticas-e-qualidade-de-código)

---

## 🎯 Sobre o Projeto

O **PokéCatalog Explorer** é uma aplicação web interativa em **React** desenvolvida para consulta, exploração e gestão de Pokémon a partir de dados em tempo real da **PokéAPI REST**.

A aplicação foi planejada sob os princípios de **Single Responsibility Principle (SRP)**, componentização modular, performance com memoização (`useMemo`, `useCallback`), experiência de usuário fluida (filtros instantâneos, áudios originais dos gritos de cada criatura, badges de tipos com cores oficiais, modais detalhados e persistência de favoritos).

---

## ✨ Demonstração e Funcionalidades

- **Listagem Paginada Dinâmica:** Carregamento de Pokémon com dados normalizados (artworks oficiais em alta resolução, badges de tipos, estatísticas básicas).
- **Sistema de Busca em Tempo Real:** Permite buscar por **Nome** (ex: *Pikachu*, *Charizard*) ou pelo **Número/ID da Pokédex** (ex: *25*, *0006*).
- **Busca Global Automática:** Caso o usuário digite o nome de um Pokémon de gerações posteriores ainda não exibido na página atual, a aplicação realiza automaticamente a consulta direta à API REST e o insere no catálogo.
- **Filtro Avançado por Tipo:** Dropdown e barra de botões com filtro rápido por elemento (*Fogo, Água, Planta, Elétrico, Psíquico, Dragão, Fantasma, etc.*).
- **Ordenação Múltipla:** Ordena por Número Crescente/Decrescente, Nome Alfabético (A-Z / Z-A) e Maior Poder Total (BST - Base Stats Total).
- **Sistema de Favoritos com Persistência:** Adicione ou remova Pokémon dos favoritos com um clique. Os dados são sincronizados no `localStorage` do navegador via **Custom Hook** `useLocalStorage`.
- **Efeitos Sonoros Reais (Cries):** Cada card e modal inclui um player interativo com o áudio oficial do grito (*cry*) do Pokémon disponibilizado pela PokéAPI.
- **Modal de Detalhes Aprofundados (`ItemDetails`):**
  - Arte oficial em tamanho expandido.
  - Descrição da espécie (*Flavor Text*) e classificação biológica (*Genus*).
  - Medidas de Altura (metros) e Peso (quilogramas) convertidas para o sistema métrico.
  - Habilidades ativas e indicação de Habilidade Oculta (*Hidden Ability*).
  - Distribuição gráfica dos 6 atributos base (*HP, Ataque, Defesa, Sp. Atk, Sp. Def e Velocidade*) com barras proporcionais coloridas.
  - Fechamento prático com tecla `ESC` ou clique fora do modal.
- **Estados Visuais de Carregamento:** Indicador giratório em formato de Pokébola estilizada e *Skeleton Loaders* com animação suave de pulso.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Função no Projeto |
| :--- | :--- | :--- |
| **React** | `19.x` | Biblioteca base para construção da interface declarativa e componentizada |
| **Vite** | `8.x` | Ferramenta de build e servidor de desenvolvimento ultrarrápido |
| **Tailwind CSS** | `4.x` | Framework CSS utilitário para estilização moderna, responsividade e dark mode |
| **Lucide React** | `^1.59` | Conjunto de ícones vetoriais modernos e acessíveis |
| **PokéAPI REST** | `v2` | API RESTful pública com dados completos do ecossistema Pokémon |

---

## 📁 Estrutura de Pastas e Componentização

O projeto adota rigorosamente a estrutura sugerida na especificação da avaliação prática:

```text
ap2_work/
├── public/                     # Arquivos estáticos e ícones
├── src/
│   ├── components/             # Componentes React modulares e reutilizáveis
│   │   ├── ItemCard.jsx        # Card individual do Pokémon (recebe props e eventos)
│   │   ├── ItemList.jsx        # Grade responsiva de cards e controle de paginação
│   │   ├── SearchForm.jsx      # Formulário controlado (busca, selects e toggle)
│   │   ├── ItemDetails.jsx     # Modal de informações aprofundadas e biologia
│   │   ├── LoadingSpinner.jsx  # Pokébola animada e Skeleton placeholder cards
│   │   └── Navbar.jsx          # Barra de navegação com contadores e identificação
│   │
│   ├── hooks/                  # Custom Hooks para abstração de lógica
│   │   ├── useFetch.js         # Requisições HTTP com AbortController, loading e error
│   │   ├── useLocalStorage.js  # Sincronização de estado persistente no navegador
│   │   └── useDebounce.js      # Suavização de eventos de digitação da busca
│   │
│   ├── services/
│   │   └── api.js              # Funções de consumo da PokéAPI REST e configuração de cores
│   │
│   ├── pages/
│   │   └── Home.jsx            # Página principal agregadora de estado e componentes
│   │
│   ├── App.jsx                 # Componente raiz da aplicação
│   ├── index.css               # Configuração e diretivas do Tailwind CSS v4
│   └── main.jsx                # Ponto de entrada da aplicação React no DOM
│
├── index.html                  # HTML5 semântico com fontes Google (Outfit / Jakarta)
├── vite.config.js              # Configuração do Vite com plugin do Tailwind CSS
├── package.json                # Dependências e scripts do projeto
└── README.md                   # Documentação acadêmica completa da AP2
```

---

## 📊 Atendimento aos Critérios de Avaliação

### 1. Comunicação por Props (0,3 pts)
Os componentes foram desenhados com responsabilidade única e comunicam-se de forma estrita via `props`:
- **Descendente (Dados):** O componente pai `Home.jsx` transfere os objetos de Pokémon (`pokemon`), estado de favorito (`isFavorite`), total de itens (`totalResults`) e seleções ativas para os filhos (`ItemCard`, `ItemList`, `ItemDetails`, `SearchForm`).
- **Ascendente (Eventos/Callbacks):** Os componentes filhos notificam ações do usuário através de funções de callback passadas via props, como `onToggleFavorite(pokemon)`, `onSelect(pokemon)`, `onSearchChange(value)`, `onTypeChange(type)`, `onSortChange(sort)` e `onReset()`.

### 2. Gerenciamento de Estado com `useState` (0,1 pt)
O estado da aplicação é gerenciado com hooks `useState` isolados e previsíveis:
- `allPokemons`: lista de criaturas carregadas da API;
- `searchTerm`: texto digitado no input de busca;
- `selectedType`: tipo selecionado para filtragem;
- `sortBy`: critério de ordenação ativo;
- `onlyFavorites`: booleano para alternar a exibição apenas dos favoritos;
- `selectedPokemon`: referência ao item atualmente aberto no modal;
- `toastMessage`: feedback temporário de ações do usuário;
- `offset` / `loadingMore`: controle do carregamento de páginas subsequentes.

### 3. Efeitos Colaterais com `useEffect` e Consumo de API (0,4 pts)
Requisições HTTP são implementadas seguindo as melhores práticas do React:
- **Array de dependências estrito:** Os hooks `useEffect` contam com arrays de dependências explicitamente definidos para evitar loops infinitos de re-renderização.
- **Cancelamento com `AbortController`:** Evita *memory leaks* e erros de requisições pendentes caso o componente seja desmontado ou a busca seja alterada antes da resposta anterior chegar.
- **Requisições encadeadas:** Ao selecionar um card, o componente `ItemDetails.jsx` dispara um `useEffect` secundário para consultar a espécie (`/pokemon-species/{id}`) e buscar o texto biológico e geração.

### 4. Custom Hooks (0,4 pts)
Foram desenvolvidos três custom hooks funcionais e reutilizáveis:
1. **`useFetch(fetchFunction, dependencies)`:** Encapsula o ciclo de vida completo de uma requisição assíncrona, expondo `{ data, loading, error, refetch }` e limpando requisições com sinal de cancelamento.
2. **`useLocalStorage(key, initialValue)`:** Sincroniza um estado do React com o armazenamento local do navegador, garantindo que os favoritos do discente permaneçam salvos mesmo após atualizar a página.
3. **`useDebounce(value, delay)`:** Atrasa a atualização de strings de busca em 300ms, poupando ciclos de CPU e renderizações desnecessárias.

### 5. Formulário Controlado (0,1 pt)
O componente `SearchForm.jsx` implementa um formulário 100% controlado pelo React:
- O input textual possui `value={searchTerm}` e `onChange={(e) => onSearchChange(e.target.value)}`;
- O select de tipos possui `value={selectedType}` e `onChange={(e) => onTypeChange(e.target.value)}`;
- O select de ordenação possui `value={sortBy}` e `onChange={(e) => onSortChange(e.target.value)}`;
- Botão "Resetar" que restaura imediatamente todos os inputs para seus estados padrão;
- Manipulador de submissão com `e.preventDefault()` prevenindo recarregamentos acidentais.

### 6. Estilização Moderna com Tailwind CSS (0,3 pt)
- **Design System Escuro & Glassmorphism:** Utilização de tons profundos de ardósia (`bg-slate-950`, `bg-slate-900/80`), bordas translúcidas (`border-slate-800`), efeitos de desfoque de fundo (`backdrop-blur-md`) e sombras dinâmicas.
- **Grid Totalmente Responsivo:** Adapta-se fluidamente em dispositivos móveis, tablets e monitores widescreen:
  `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- **Micro-interações:** Animações sutis em hover (`hover:-translate-y-1.5`, `group-hover:scale-110`), transições suaves e indicador de carregamento giratório com gradientes.

---

## 🌐 API REST e Endpoints Utilizados

A aplicação integra-se aos seguintes endpoints da **PokéAPI**:

1. **Listagem Paginada:**
   - **Método:** `GET`
   - **Endpoint:** `https://pokeapi.co/api/v2/pokemon?limit=24&offset=0`
   - **Finalidade:** Retorna a listagem básica e URLs de referência para cada criatura.

2. **Detalhes do Pokémon:**
   - **Método:** `GET`
   - **Endpoint:** `https://pokeapi.co/api/v2/pokemon/{id_ou_nome}`
   - **Finalidade:** Recupera estatísticas base, artworks oficiais, tipos, habilidades e link do áudio de grito.

3. **Detalhes da Espécie e Biologia:**
   - **Método:** `GET`
   - **Endpoint:** `https://pokeapi.co/api/v2/pokemon-species/{id}`
   - **Finalidade:** Fornece o texto da Pokédex (*flavor text*), geração e gênero biológico.

---

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada)
- Gerenciador de pacotes **npm** (ou yarn/pnpm)

### Passo a Passo

1. **Acessar a pasta do projeto:**
   ```bash
   cd ap2_work
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará acessível no navegador no endereço:  
   👉 **`http://localhost:5173`**

4. **Gerar a build de produção (opcional):**
   ```bash
   npm run build
   ```

---

## 💡 Boas Práticas e Qualidade de Código

- **Arquitetura Limpa:** Separação rígida entre camada de serviços (`api.js`), lógica de negócio/estados (`hooks/`) e apresentação (`components/` e `pages/`).
- **Tratamento de Exceções:** Bloqueios `try/catch`, validação de status HTTP nas respostas, mensagens amigáveis em caso de falha de conexão e botão para nova tentativa.
- **Cache em Memória:** Estrutura `Map` na camada de serviço para não realizar requisições duplicadas para o mesmo Pokémon durante a mesma sessão.
- **Acessibilidade:** Uso de atributos `role="dialog"`, `aria-modal="true"`, fechamento via teclado (`Escape`) e tags semânticas do HTML5 (`header`, `main`, `footer`, `section`).
- **Sem chaves de API expostas:** A PokéAPI é aberta e pública, permitindo que a banca examinadora e o professor executem a aplicação imediatamente após o clone sem necessidade de cadastros externos.

---

*Trabalho prático desenvolvido para avaliação da AP2 — Faculdade de Tecnologia / Análise e Desenvolvimento de Sistemas.*
