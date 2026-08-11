import fs from 'node:fs';

const input = process.argv[2] || 'data.json';
const raw = fs.readFileSync(input, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) throw new Error('data.json must not contain a UTF-8 BOM');
const data = JSON.parse(raw);

const fail = (message) => { throw new Error(message); };
const isNumOrNull = (v) => v == null || (typeof v === 'number' && Number.isFinite(v));

if (!data || typeof data !== 'object' || Array.isArray(data)) fail('snapshot must be an object');
if (typeof data.timestamp !== 'string' || Number.isNaN(Date.parse(data.timestamp))) fail('timestamp must be a valid ISO date');
for (const key of ['conversasNaoLidas','msgsNaoLidas','chatsComUnread','deltaConvos','deltaMsgs']) {
  if (!isNumOrNull(data[key])) fail(`${key} must be a finite number or null`);
}
if (!Array.isArray(data.top5)) fail('top5 must be an array');
if (data.top5.length > 5) fail('top5 must contain at most 5 entries');
if (!Array.isArray(data.history)) fail('history must be an array');
if (data.history.length > 20) fail('history must contain at most 20 entries');

for (const [i, item] of data.history.entries()) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) fail(`history[${i}] must be an object`);
  if ('history' in item) fail(`history[${i}] must be flat; nested history is forbidden`);
  if ('snippet' in item) fail(`history[${i}] must not contain message snippets`);
  const allowed = new Set(['timestamp','conversasNaoLidas','msgsNaoLidas','chatsComUnread','deltaConvos','deltaMsgs','top']);
  for (const key of Object.keys(item)) if (!allowed.has(key)) fail(`history[${i}] contains unsupported field: ${key}`);
}

const serialized = JSON.stringify(data);
if (serialized.includes('System.Collections.Specialized.OrderedDictionary')) fail('PowerShell object serialization artifact detected');
console.log(`OK: ${input} is a flat snapshot (${data.history.length} history entries)`);
