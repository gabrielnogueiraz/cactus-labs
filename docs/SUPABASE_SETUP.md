# Guia de Configuração do Supabase

O Cactus Labs utiliza o [Supabase](https://supabase.com/) como seu backend as a service, lidando com autenticação e banco de dados relacional (PostgreSQL). Siga os passos abaixo para configurar seu ambiente.

## 1. Criar projeto no Supabase
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) e faça login.
2. Clique em **"New Project"** e escolha sua organização.
3. Preencha o nome do projeto (ex: `Cactus Labs`), invente uma senha forte para o banco de dados e selecione a região do data center geograficamente mais próxima (como São Paulo).
4. Aguarde o banco de dados ser provisionado (esse processo pode levar alguns minutos).

## 2. Configurar OAuth GitHub
Para permitir que os usuários loguem usando suas contas do GitHub na UI de autenticação:
1. No menu lateral do painel do Supabase, vá em **Authentication** > **Providers**.
2. Encontre a seção **GitHub** e ative (ligando a opção toggle *Enabled*).
3. Você precisará de preencher os valores do **Client ID** e **Client Secret**. (Leia com atenção o nosso [Guia do GitHub OAuth](GITHUB_OAUTH.md) para saber exatamente como gerar essas chaves).
4. Insira as credenciais GitHub na tela do Supabase e salve.

## 3. URLs de Callback
Você agora precisa configurar o redirect do Supabase apontando para o seu GitHub OAuth App, bem como redefinir quais as URLs base válidas para a home do site quando o usuário voltar do Github.
1. Copie a **Callback URL** que consta estáticamente na tela do GitHub Provider no painel do Supabase (geralmente será da forma `https://[seu-projeto].supabase.co/auth/v1/callback`).
2. Utilize exclusivamente essa rota apontada no seu aplicativo em *Developer Settings* do GitHub (novamente, veja `GITHUB_OAUTH.md`).
3. Retorne ao painel do Supabase e vá em **Authentication** > **URL Configuration**.
4. Abaixo de **Site URL**, coloque sua URL base raiz (ex: `http://localhost:3000` se estiver na sua máquina local ou `https://seu-dominio.com` em deploy de produção).
5. Como boa prática em alguns setups, não custa adicionar essas mesmas URLs terminadas em endpoints exatos nos **Redirect URLs** (ex: `http://localhost:3000/auth/callback`).

## 4. Criar as Tabelas e Migrations
Você precisa modelar algumas poucas tabelas em conformidade que vão espelhar os mantenedores autenticados.

Vá até a aba **SQL Editor** no painel central do Supabase clicando em "New query" e rode a sintaxe abaixo:

```sql
-- Habilita extensão pgcrypto se ainda não ativada (úteis para gerar UUIDs extras se necessário)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela pública de perfis do usuário (vinculada ao auth.users e session nativo do Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  github_provider_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS e liberação de permissão da tabela de Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis são visíveis por todos os visitantes" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem inserir seu próprio perfil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários autenticados podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 5. Configurando suas Variáveis de Ambiente
O ato final para integrar a plataforma será colocar essas chaves geradas para o Next.js reconhecer em `.env`.

1. Vá para **Project Settings** > **API**.
2. Copie o valor do atributo de URL listado em **Project URL** para o arquivo `.env.local` na chave `NEXT_PUBLIC_SUPABASE_URL`.
3. Copie o valor de **anon** `public` na seção inferior das Project API Keys para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Pronto! Seu ambiente com a infraestrutura Supabase autêntica já está rodando. O Cactus Labs estará pronto em instantes.
