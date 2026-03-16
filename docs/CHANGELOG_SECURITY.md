# Security Changelog

## [1.0.1] - 2026-03-16

### 🔒 Segurança

- **Redução de escopos OAuth GitHub**: removido escopo `repo` (leitura e escrita
  completa) e substituído pelos escopos mínimos necessários (`read:user`,
  `user:email`, `read:org`). O Cactus Labs é uma ferramenta read-only e não
  requer permissões de escrita.
- Agradecimento à comunidade pelo feedback que identificou esse problema
  no dia do lançamento.
