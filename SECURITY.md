# Política de Segurança — Cactus Labs 🌵

## Princípio fundamental

O Cactus Labs é uma ferramenta **somente de leitura**. Nunca escrevemos, modificamos ou deletamos nada no seu GitHub. Nosso acesso é estritamente para leitura dos dados necessários para gerar seu dashboard.

## Permissões OAuth solicitadas

| Escopo | Motivo |
|--------|--------|
| `read:user` | Leitura do seu perfil (nome, foto, bio) |
| `user:email` | Acesso ao seu email para identificação |
| `read:org` | Leitura das organizações que você participa |

### O que NÃO fazemos

- ❌ Não escrevemos em nenhum repositório
- ❌ Não acessamos settings ou webhooks
- ❌ Não gerenciamos deploy keys ou collaboration invites
- ❌ Não armazenamos seu código-fonte
- ❌ Não compartilhamos seus dados com terceiros

## O que armazenamos

Armazenamos no Supabase (PostgreSQL) apenas:

- Seu token de acesso OAuth (criptografado)
- Metadados de commits e PRs (mensagens, datas, repositórios)
- Seu perfil público do GitHub

Nunca armazenamos código-fonte ou conteúdo de arquivos.

## Versões suportadas

Apenas a versão mais recente em produção recebe patches de segurança.

| Versão | Suportada |
| ------ | --------- |
| 1.0.x  | ✅ Sim    |
| < 1.0  | ❌ Não    |

## Reportando uma vulnerabilidade

**Não abra uma issue pública para vulnerabilidades de segurança.**

Envie um e-mail para: contato@gabrielnogueira.dev

Inclua:

- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestão de correção (se tiver)

Resposta em até 48 horas. Crédito público ao pesquisador após o fix, se desejado.
