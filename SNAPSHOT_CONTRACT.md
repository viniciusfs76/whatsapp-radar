# Snapshot contract

`data.json` is the only runtime data source consumed by the public dashboard.

## Security and privacy invariants

1. `index.html` must never embed raw WhatsApp-derived JSON inside an HTML `<script>` block.
2. The public snapshot must be treated as untrusted input and rendered with DOM `textContent`, not by interpolating message-derived values into `innerHTML`.
3. `history` must be flat. A history entry must never contain another `history` property.
4. Keep at most 20 history entries.
5. Serialize as UTF-8 without BOM. Do not decode/re-encode already-corrupted strings.
6. Public snapshots should contain metrics only. Names, phone numbers, group names and message snippets must remain in local/private storage.

## Canonical shape

```json
{
  "timestamp": "2026-08-11T10:48:06-03:00",
  "conversasNaoLidas": 10,
  "msgsNaoLidas": 40,
  "chatsComUnread": 10,
  "deltaConvos": -1,
  "deltaMsgs": -3,
  "proximoTick": "2026-08-11T11:03:06-03:00",
  "top5": [],
  "history": [
    {
      "timestamp": "2026-08-11T10:33:36-03:00",
      "conversasNaoLidas": 11,
      "msgsNaoLidas": 43,
      "chatsComUnread": 11,
      "deltaConvos": 0,
      "deltaMsgs": 0
    }
  ]
}
```

## Producer rule

Never append the whole current snapshot to history. Construct a new flat object explicitly:

```js
const historyEntry = {
  timestamp: current.timestamp,
  conversasNaoLidas: current.conversasNaoLidas,
  msgsNaoLidas: current.msgsNaoLidas,
  chatsComUnread: current.chatsComUnread,
  deltaConvos: current.deltaConvos,
  deltaMsgs: current.deltaMsgs
};
next.history = [historyEntry, ...(previous.history || [])].slice(0, 20);
```

Validate before publishing:

```bash
node scripts/validate-snapshot.mjs data.json
```
