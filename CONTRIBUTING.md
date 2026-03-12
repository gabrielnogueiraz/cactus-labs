# Contribuindo para o Cactus Labs

## Bem-vindo(a) ao Cactus Labs!
Ficamos extremamente felizes com o seu interesse em contribuir para o Cactus Labs! Nosso objetivo é construir o melhor dashboard de performance para desenvolvedores utilizando a stack moderna do Next.js e da IA. Toda ajuda é muito bem-vinda, seja corrigindo bugs, adicionando features, melhorando a documentação ou ajustando o design.

## Código de Conduta
Por favor, leia nosso [Código de Conduta](CODE_OF_CONDUCT.md) antes de interagir com a comunidade. Em resumo: seja respeitoso, construtivo e inclusivo. Queremos um ambiente seguro para o aprendizado e crescimento de todos.

## Como posso contribuir?

### Reportando bugs
- Antes de abrir uma nova issue, faça uma busca rápida para verificar se alguém já não reportou o mesmo problema.
- Use o template `🐛 Bug Report` disponível no nosso repositório ao abrir uma Issue.
- Inclua todas as informações solicitadas: passos para reproduzir, comportamento esperado vs atual, screenshots (se a interface for afetada), versão do Node.js e sistema operacional.

### Sugerindo melhorias
- Abra uma issue com a label `enhancement` e ou use o template `✨ Feature Request`.
- Descreva detalhadamente qual problema a sua feature resolve e como ela se encaixa no propósito do Cactus Labs.
- Não assuma que uma nova funcionalidade será obrigatoriamente aceita. Recomendamos discutir a ideia na issue antes de começar a codificar, evitando frustrações.

### Sua primeira contribuição
- Recomendamos procurar issues com a label `good first issue` para entender a base do nosso código.
- Comente na issue escolhida avisando que você irá trabalhar nela, assim evitamos que duas pessoas façam o mesmo trabalho.
- Issues marcadas como `help wanted` também são prioridade para a colaboração da comunidade.

## Processo de desenvolvimento

O fluxo básico consiste em fazer um Fork, criar uma Branch e realizar suas modificações.

```bash
# Fork → Clone → Branch → Código → Testes → PR

git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### Convenção de branches
- `feat/` → Para desenvolvimento de novas funcionalidades.
- `fix/` → Para correção de bugs.
- `docs/` → Exclusivamente para melhorias ou correções de documentação.
- `refactor/` → Refatorações de código que não mudem o comportamento do sistema.
- `chore/` → Atualizações de dependências ou configurações de ambiente.

## Convenção de commits (Conventional Commits)

Adotamos a especificação **Conventional Commits** para manter a árvore de commits estruturada. Exemplos:

```text
feat: adiciona exportação em formato CSV
fix: corrige cálculo de commits em repos privados
docs: atualiza guia de configuração do Supabase
refactor: extrai lógica de análise IA para hook separado
chore: atualiza dependências do Next.js para 14.2
```

**Tipos aceitos:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

## Abrindo um Pull Request

Antes de enviar a sua contribuição, siga esse checklist rigoroso:

### Checklist obrigatório antes de abrir PR:
- [ ] A branch foi criada a partir da `main`.
- [ ] O código segue os padrões do projeto (TypeScript strict habilitado em todo lugar, sem tipagem `any` implícita ou explícita).
- [ ] Testei a aplicação localmente e tudo está funcional.
- [ ] Atualizei a documentação correspondente, se necessário.
- [ ] A mensagem dos commits atende ao padrão de Conventional Commits.
- [ ] Meu PR contém um título descritivo e uma descrição detalhada das mudanças.

### O PR deve:
- Referenciar a issue relacionada (exemplo: adicione `Closes #123` na descrição do PR).
- Ter um tamanho razoável. PRs gigantes dificultam review; considere quebrar atividades enormes em passos progressivos.
- Conter screenshots de como estava antes vs e como está depois (se as mudanças englobarem modificação na UI).

## Setup do ambiente de desenvolvimento

O setup exige que você instale dependências do portal, além de executar processos integrados como o Supabase e as variáveis da Groq.

1. Instale a [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started).
2. Na raiz do projeto, inicialize o ambiente local do Supabase via CLI:
   ```bash
   supabase start
   ```
   Isso rodará todo o suporte aos bancos dados e auth localmente no seu host, via Docker. Isso isenta de exigir conta paga e remote remotos para desenvolvimento.
3. Copie as chaves de acesso anônimas e URLs saídas pelo terminal no seu ambiente em branco (cópia de `.env.example` para `.env.local`).
4. Execute e visualize localmente com: `npm run dev`.

## Dúvidas?

Sinta-se à vontade para abrir uma `Discussion` no GitHub se desejar conversar sobre opções arquiteturais ou padrões antes de preencher uma issue formal.
