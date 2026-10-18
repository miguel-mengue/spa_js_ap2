# 🤖 Contexto do Projeto para Inteligências Artificiais (AI Context)

Este documento foi elaborado para fornecer a assistentes de Inteligência Artificial (como Antigravity, GitHub Copilot, Claude, ChatGPT, Cursor, Gemini, etc.) todo o contexto técnico, arquitetural, regras de negócio e convenções de código deste repositório.

---

## 📌 1. Visão Geral do Projeto

- **Nome do Projeto:** PokéCatalog Explorer
- **Contexto:** Trabalho de Avaliação Prática (AP2) do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.
- **Objetivo Principal:** Aplicação web interativa para exploração de Pokémon com consumo assíncrono de API REST pública ([PokéAPI](https://pokeapi.co/)), gerenciamento de estado declarativo, formulários controlados, custom hooks e estilização com Tailwind CSS.
- **Idioma Padrão da Interface e Documentação:** Português do Brasil (`pt-BR`).
- **Idioma do Código:** Inglês para identificadores de código (funções, variáveis, componentes) e comentários explicativos em Português para fins acadêmicos.

---

## 🛠️ 2. Stack Tecnológica

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Biblioteca UI** | React 19.x | Componentes funcionais, Hooks nativos (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) |
| **Build Tool & Bundler** | Vite 8.x | Suporte a HMR, compilação via ESM e plugin `@tailwindcss/vite` |
| **Estilização** | Tailwind CSS v4.x | Abordagem utility-first, tema escuro (`slate-950`), efeitos de *glassmorphism* e responsividade |
| **Ícones** | Lucide React | Ícones vetoriais modernos (`Heart`, `Search`, `Volume2`, `Sparkles`, etc.) |
| **Fonte / Tipografia** | Google Fonts | `Outfit` (títulos e destaques) e `Plus Jakarta Sans` (corpo e leitura) |
| **API Externa** | PokéAPI v2 | RESTful pública, sem necessidade de autenticação/API Key |

---

## 🏛️ 3. Arquitetura e Organização de Pastas

```text
ap2_work/
├── public/                     # Favicons e SVGs estáticos
├── src/
│   ├── components/             # Componentes de apresentação modulares (reutilizáveis via props)
│   │   ├── ItemCard.jsx        # Card individual (exibe artwork, tipos, atributos e toca áudio cry)
│   │   ├── ItemList.jsx        # Container em grid com tratamento de lista vazia e botão carregar mais
│   │   ├── SearchForm.jsx      # Formulário controlado (busca por texto/ID, filtro por tipo, ordenação)
│   │   ├── ItemDetails.jsx     # Modal detalhado com atributos base proporcionais, biologia e geração
│   │   ├── LoadingSpinner.jsx  # Indicador animado de Pokébola e Skeletons de carregamento
│   │   └── Navbar.jsx          # Barra superior com contador de itens, favoritos e navegação
│   │
│   ├── hooks/                  # Custom Hooks encapsulando lógica de negócio reutilizável
│   │   ├── useFetch.js         # Gerencia requisição HTTP, loading, error, refetch e AbortController
│   │   ├── useLocalStorage.js  # Sincronização automática de estado com o localStorage
│   │   └── useDebounce.js      # Suavização de digitação para buscas de alta frequência
│   │
│   ├── services/
│   │   └── api.js              # Funções de consumo da PokéAPI, cache em memória e normalização de dados
│   │
│   ├── pages/
│   │   └── Home.jsx            # Página agregadora: centraliza estado global, efeitos e renderização
│   │
│   ├── App.jsx                 # Componente raiz
│   ├── index.css               # Importação do Tailwind CSS v4 e estilização da scrollbar
│   └── main.jsx                # Ponto de entrada do React no DOM
│
├── index.html                  # HTML5 com metadados SEO e fontes tipográficas
├── vite.config.js              # Configuração do Vite com integração do Tailwind CSS v4
├── package.json                # Dependências do projeto
├── README.md                   # Documentação acadêmica detalhada
├── AGENTS.md                   # Diretrizes para agentes de IA
└── AI_CONTEXT.md               # Arquivo de contexto para LLMs
```

---

## 🎯 4. Regras de Negócio e Requisitos Acadêmicos (AP2)

Ao modificar ou estender o projeto, você **DEVE** preservar o atendimento estrito aos seguintes critérios da rubrica:

1. **Comunicação por Props (0,3 pts):**
   - Dados descem do pai para o filho via `props`.
   - Eventos e ações sobem do filho para o pai exclusivamente através de funções de callback (ex: `onToggleFavorite`, `onSelect`, `onSearchChange`).
2. **Gerenciamento de Estado com useState (0,1 pt):**
   - Estados atômicos e declarativos. Não mutar arrays ou objetos de estado diretamente (utilizar spread operator e formas funcionais: `setList(prev => [...prev, newItem])`).
3. **Efeitos Colaterais com useEffect (0,4 pts):**
   - Sempre definir arrays de dependências estritos e completos.
   - Sempre incluir função de limpeza (*cleanup function*) utilizando `AbortController` em requisições de rede para evitar *memory leaks* e *race conditions*.
4. **Custom Hooks (0,4 pts):**
   - A lógica assíncrona ou de persistência não deve ser acoplada diretamente no componente de visualização. Manter o uso dos hooks `useFetch`, `useLocalStorage` e `useDebounce`.
5. **Formulários Controlados (0,1 pt):**
   - Todo input/select deve ter sua propriedade `value` sincronizada com um estado do React e disparar `onChange` correspondente. Formulários devem possuir evento `onSubmit` com `e.preventDefault()`.
6. **Estilização com Tailwind CSS (0,3 pt):**
   - Manter consistência visual com tema escuro elegante (`bg-slate-950`), paleta de cores dos tipos Pokémon (`TYPE_CONFIG`), responsividade mobile-first e transições suaves.
7. **Organização e Documentação (0,4 pts):**
   - Preservar a clareza e comentários JSDoc nas funções. Manter o `README.md` sincronizado.

---

## 🔌 5. Especificação da API Externa (PokéAPI)

- **Base URL:** `https://pokeapi.co/api/v2`
- **Autenticação:** Nenhuma (API aberta e gratuita).
- **Principais Endpoints Consumidos:**
  - `GET /pokemon?limit={limit}&offset={offset}`: listagem paginada.
  - `GET /pokemon/{id_ou_nome}`: detalhes do Pokémon (sprites, atributos, tipos, áudio oficial de grito em `cries.latest`).
  - `GET /pokemon-species/{id}`: dados biológicos, geração e descrição textual (*flavor text*).
- **Cache:** O módulo `src/services/api.js` implementa um cache em memória (`Map`) para economizar largura de banda e acelerar navegações repetidas.

---

## 💻 6. Comandos Disponíveis no Repositório

```bash
# Instalação das dependências
npm install

# Iniciar servidor de desenvolvimento (HMR em http://localhost:5173)
npm run dev

# Compilar para produção (gera pasta dist/)
npm run build

# Executar linter
npm run lint

# Visualizar build de produção localmente
npm run preview
```

---

## 🧭 7. Diretrizes para a IA ao Gerar ou Modificar Código

1. **Não quebre a compatibilidade:** Ao alterar qualquer componente, assegure-se de que `npm run build` continue passando sem erros ou advertências.
2. **Não introduza dependências desnecessárias:** O projeto já possui todas as bibliotecas necessárias instaladas (`react`, `react-dom`, `lucide-react`, `tailwindcss`, `vite`).
3. **Mantenha o padrão de estilização:** Utilize classes utilitárias do Tailwind CSS respeitando a paleta já estabelecida (`slate-950`, `slate-900`, `slate-800`, `rose-500`, etc.).
4. **Respeite o `.gitignore`:** Arquivos das pastas `node_modules/` e `dist/` nunca devem ser comitados.
5. **Acessibilidade:** Certifique-se de que botões interativos possuam `title`, `aria-label` quando necessário, e que modais possam ser fechados via tecla `Escape`.
