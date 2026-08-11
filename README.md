# whatsapp-radar

WhatsApp inbox radar atualizado periodicamente por um coletor/cron externo.

## Arquitetura

- `index.html`: dashboard estático. Carrega `data.json` via `fetch()` e trata o arquivo como entrada não confiável.
- `data.json`: snapshot público minimizado para métricas.
- `SNAPSHOT_CONTRACT.md`: contrato que o produtor externo deve obedecer.
- `scripts/validate-snapshot.mjs`: validação do snapshot antes da publicação.

## Validação

```bash
node scripts/validate-snapshot.mjs data.json
```

## Privacidade

Este repositório é público. Não publique nomes de contatos, números de telefone, nomes de grupos nem trechos de mensagens. Dados detalhados devem permanecer em armazenamento local ou privado.

> Importante: remover dados do estado atual do repositório não remove conteúdo já existente no histórico Git. A remediação histórica deve ser feita separadamente, com reescrita do histórico e revisão de caches/forks quando aplicável.
