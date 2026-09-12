# Versionamento automático

A versão exibida nas lojas (`expo.version` no `app.json`) é incrementada pela workflow
`.github/workflows/version.yml`, que roda a cada push na `main`. O `versionCode` (Android) e o
build number (iOS) continuam por conta do EAS (`appVersionSource: "remote"` +
`autoIncrement: true`).

## Como o incremento é calculado

O script `scripts/bump-version.js` lê os commits entre a última tag `vX.Y.Z` e o `HEAD`
(ignorando merges) e escolhe o maior incremento encontrado:

| Commit                                      | Incremento |
| ------------------------------------------- | ---------- |
| `tipo!: ...` ou `BREAKING CHANGE:` no corpo | major      |
| `feat: ...`                                 | minor      |
| `fix:`, `perf:`, `refactor:`, `revert:`     | patch      |
| `docs:`, `chore:`, `test:`, `ci:`, `style:` | nenhum     |

Se nada for releasable (por exemplo, um push só de documentação), a workflow não commita nem
cria tag. Quando ainda não existe nenhuma tag, a primeira execução apenas cria a tag da versão
atual, sem bump, para servir de marco inicial.

Depois do bump a workflow commita `chore(release): bump the app version to X.Y.Z [skip ci]`,
cria a tag `vX.Y.Z` e envia os dois. O `[skip ci]` evita que o próprio commit dispare a workflow
de novo.

## Pushes simultâneos

A workflow usa `concurrency: version-main` com `cancel-in-progress: false`, então execuções
ficam enfileiradas e nunca calculam a versão em paralelo. Se ainda assim o push for rejeitado
(alguém mandou commit durante a execução), o job faz `git pull --rebase` e tenta de novo, até
três vezes, falhando de forma visível se não conseguir.

## Verificação no PR

A workflow `Version check` roda `node scripts/bump-version.js --check` em todo PR para a `main`,
garantindo que `app.json`, `package.json` e `package-lock.json` estão na mesma versão. Bumps
manuais que esquecem um dos arquivos quebram o PR.

## Bump manual

Só é necessário para forçar uma versão fora da regra (por exemplo, pular para `2.0.0`). Nesse
caso, atualizar os três arquivos e criar a tag correspondente, para que a próxima execução da
workflow parta dela.
