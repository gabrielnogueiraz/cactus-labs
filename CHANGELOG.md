## [1.1.0] - 2026-03-30

### ✨ Adicionado

- **Brag Document System**: Novo fluxo de pré-análise que gera perguntas contextuais baseadas na atividade do GitHub para enriquecer o relatório final.
- **Painel de Perguntas Contextuais**: Interface interativa para o desenvolvedor fornecer contexto de negócio e impacto real.
- **Análise Enriquecida**: IA agora utiliza as respostas do usuário para gerar relatórios de performance mais profundos e personalizados.

### 🚀 Performance

- **Otimização de Coleta de Dados**: Refatoração completa da integração com GitHub para evitar chamadas redundantes e suportar paginação profunda.
- **Suporte a Organizações**: Agora o sistema busca commits e PRs em todos os repositórios de organizações que o usuário é membro.
- **Cache de Repositórios**: Centralização da lógica de busca para reduzir o consumo da quota da API do GitHub.

### 🔒 Segurança

- **Escopo `repo` reintroduzido**: Adicionado suporte para leitura de repositórios privados. Essa mudança é necessária para que o Brag Document e as métricas de performance reflitam todo o trabalho do desenvolvedor, incluindo projetos privados. O usuário mantém o controle total sobre essa permissão durante o OAuth.

## [1.0.2] - 2026-03-17

### ✨ Adicionado

- Contador de usuários na hero section
- Feature showcase interativo com troca de imagens
- Seção de segurança na landing page

## [1.0.1] - 2026-03-16

### 🔒 Segurança

- **Redução de escopos OAuth GitHub**: removido escopo `repo` (leitura e escrita
  completa) e substituído pelos escopos mínimos necessários (`read:user`,
  `user:email`, `read:org`). O Cactus Labs é uma ferramenta read-only e não
  requer permissões de escrita.
- Agradecimento à comunidade pelo feedback que identificou esse problema
  no dia do lançamento.
