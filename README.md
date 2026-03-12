<div align="center">
  <h1>🌵 Cactus Labs</h1>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License: MIT" />
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
  </p>
</div>

**O dashboard definitivo de performance para desenvolvedores.**
Conecte-se com o GitHub via OAuth, acompanhe suas métricas de commits e PRs e obtenha insights gerados por IA.

## ✨ Funcionalidades

- 📊 **Dashboard de Métricas:** Acompanhe commits, PRs e atividades em tempo real.
- 🤖 **Análise com IA:** Insights e relatórios de performance gerados pelas IAs Groq e gpt-oss-120b.
- 📥 **Exportação de Relatórios:** Exporte seus dados em PDF e Excel facilmente.
- 🔐 **OAuth GitHub:** Autenticação segura e unificada utilizando sua conta do GitHub via Supabase.
- 🌓 **Tema Claro/Escuro:** Interface moderna com suporte nativo a temas utilizando shadcn/ui.
- 🗺️ **Heatmap de Contribuições:** Visualização de atividade estilo GitHub.

## 🛠 Stack

| Tecnologia           | Uso                                |
| -------------------- | ---------------------------------- |
| Next.js 14           | Framework principal (App Router)   |
| Supabase             | Auth + banco de dados (PostgreSQL) |
| Groq + LLaMA 3.3 70B | Análise de performance com IA      |
| shadcn/ui + Radix    | Componentes de interface           |
| Recharts             | Gráficos e visualizações           |
| TypeScript           | Tipagem estática                   |
| Tailwind CSS         | Estilização                        |

## 🚀 Começando (Getting Started)

Siga o passo a passo abaixo para rodar o Cactus Labs localmente:

1. **Clone o repositório**

   ```bash
   git clone https://github.com/gabrielnogueira/cactus-labs.git
   cd cactus-labs
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto com base nas informações abaixo.

4. **Configure o Supabase**
   Siga o nosso [Guia de Configuração do Supabase](docs/SUPABASE_SETUP.md) para preparar o banco de dados.

5. **Configure o OAuth do GitHub**
   Siga o nosso [Guia de Configuração do GitHub OAuth](docs/GITHUB_OAUTH.md) para permitir o login com GitHub.

6. **Rode a aplicação localmente**
   ```bash
   npm run dev
   ```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto e preencha com suas chaves:

```env
# URL do projeto do Supabase (Obtenha no painel do Supabase > Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=sua_supabase_url

# Chave anônima (anon key) do Supabase (Obtenha no painel do Supabase > Project Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key

# Supabase Service Role Key (Apenas para operações seguras no backend)
SUPABASE_SERVICE_ROLE_KEY=sua_supabase_service_role_key

# Groq API Key para funcionalidades de IA (Obtenha em https://console.groq.com)
GROQ_API_KEY=sua_groq_api_key

# URLs e credenciais do GitHub OAuth (Configure em GitHub > Developer Settings)
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
```

## 📁 Estrutura do Projeto

```text
cactus-labs/
├── docs/                  # Guias de setup (Supabase, OAuth, etc.)
├── public/                # Assets estáticos (imagens, ícones)
├── src/
│   ├── app/               # Rotas e páginas do Next.js 14 (App Router)
│   ├── components/        # Componentes React reutilizáveis (shadcn/ui e próprios)
│   ├── lib/               # Funções utilitárias, instâncias de clientes (Supabase, Groq)
│   └── types/             # Definições de tipos TypeScript
└── .github/               # Templates de Issues, PRs e fluxos do GitHub Actions
```

## 🤝 Contribuindo

Nós adoramos contribuições da comunidade! Para garantir a melhor experiência para todos, leia nosso guia de contribuição em [CONTRIBUTING.md](CONTRIBUTING.md) antes de enviar um Pull Request.

## 📄 Licença

Este software é licenciado sob a [MIT License](LICENSE).

## 👤 Autor

**Gabriel Nogueira**

- 💼 [LinkedIn](https://www.linkedin.com/in/gabrielnogueiraz)
- 📸 [Instagram](https://www.instagram.com/_gabrielnogueiraz/)
- 🌐 [Portfólio](https://gabrielnogueiraz.vercel.app/)
- 🐙 [GitHub](https://github.com/gabrielnogueiraz)
