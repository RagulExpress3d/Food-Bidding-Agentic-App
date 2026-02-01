import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnv() {
  let key = '';
  for (const file of ['.env', '.env.local']) {
    const p = join(root, file);
    if (!existsSync(p)) continue;
    const content = readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*(?:GEMINI_API_KEY|API_KEY)\s*=\s*(.+?)\s*$/);
      if (m) key = (m[1].replace(/^["']|["']$/g, '').trim() || key);
    }
  }
  return key;
}

async function main() {
  const apiKey = loadEnv();
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in .env or .env.local');
    process.exit(1);
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Reply with exactly: OK',
    });
    const text = (res?.text ?? '').trim();
    if (text) {
      console.log('Gemini API key is valid.');
      process.exit(0);
    }
    console.error('Unexpected response from Gemini');
    process.exit(1);
  } catch (err) {
    const msg = err?.message ?? String(err);
    if (msg.includes('API key') || msg.includes('401') || msg.includes('403')) {
      console.error('Invalid Gemini API key. Check .env GEMINI_API_KEY.');
    } else {
      console.error('Gemini request failed:', msg);
    }
    process.exit(1);
  }
}

main();
