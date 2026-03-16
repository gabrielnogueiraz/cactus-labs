# Guia de Configuração do GitHub OAuth

Para fazer o Cactus Labs funcionar em sua essência através do login e da leitura das métricas de contribuição, você precisará cadastrar um **OAuth App** através de uma conta desenvolvedora do GitHub.

1. Acesse sua conta e profile no GitHub.
2. No canto superior direito, expanda o menu dropdown da sua foto de avatar e vá em **Settings**.
3. No painel de navegação esquerdo, role a barra até a última opção nas bases e clique em **Developer settings**.
4. Clique em **OAuth Apps** no painel em submenu esquerdo.
5. Pressione livremente o botão superior **New OAuth App**.
6. Preencha agora os campos atrelados do web app da seguinte forma:
   - **Application name:** `Cactus Labs` (ou um alias atrelado, como "App Dev" no stage de desenvolvimento em máquina local).
   - **Homepage URL:** Sua URL principal raiz para verificação (ex: `http://localhost:3000`).
   - **Application description:** (Campo totalmente opcional, como "*Dashboard de análise*").
   - **Authorization callback URL:** **Este passo é obrigatório**. Em cenários em que o Supabase gerencia o tráfego da API Auth para você, cole exatamente a **Callback URL** do provedor listada em dashboard Auth do seu projeto Supabase. 
     *(Normalmente com sintaxe seguindo as diretrizes: `https://[seu-projeto].supabase.co/auth/v1/callback`)*. Observe atentamente a URI final e de protocolo HTTPS.
7. Com os campos finalizados, clique no botão para confirmar em **Register application**.
8. Na próxima tela, você verá que o seu projeto obteve um **Client ID**. Copie-o.
9. Clique no botão inferior **Generate a new client secret** (Você precisará digitar sua senha do modelo de acesso GitHub, ou certificar via MFA se habilitado).
10. Logo após esse password sensível se formar e ser revelado, **salve este Client Secret em um local estritamente privado e seguro** diretamente no seu arquivo `.env.local`. 
Atenção total: Por razões óbvias de segurança de conta, o GitHub exibirá essa String secreta apenas **uma única vez** antes de ocultá-la eternamente sob máscaras.

---

### Inserindo essas chaves geradas em variáveis de API de ambiente local

Para conectar esse mecanismo diretamente à sua instância Next.js rodando paralela, insira ou atualize o `.env.local`:

```sh
GITHUB_CLIENT_ID="copie_seus_caracteres_do_client_id_aqui"
GITHUB_CLIENT_SECRET="cole_com_cuidado_o_hash_sensivel_visto_aqui"
```

Acompanhe os guias em paridade lendo o [README.md](../README.md) sobre o arquivo de base de Variáveis para prosseguir integrando as APIs.

---

### Escopos OAuth solicitados

O Cactus Labs é uma ferramenta **somente de leitura** e solicita apenas os escopos mínimos necessários:

| Escopo | Motivo |
|--------|--------|
| `read:user` | Leitura do perfil do usuário (nome, foto, bio) |
| `user:email` | Acesso ao email do usuário para identificação |
| `read:org` | Leitura das organizações que o usuário participa |

> **Nota:** O escopo `repo` **não** é solicitado. A API do GitHub permite que o usuário autenticado liste seus próprios repositórios (incluindo privados), commits e pull requests sem esse escopo.
