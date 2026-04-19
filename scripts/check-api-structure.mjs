/**
 * GrowthCore API のレスポンスに posts_per_day / most_popular_post_time が含まれるか確認するスクリプト。
 * 実行: node scripts/check-api-structure.mjs [InstagramID]
 * 例: node scripts/check-api-structure.mjs instagram
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env.local');

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error('.env.local が見つかりません');
    process.exit(1);
  }
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

function describeValue(value) {
  if (value === null) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', length: 0 };
    const first = value[0];
    const itemKeys =
      typeof first === 'object' && first !== null && !Array.isArray(first)
        ? Object.keys(first)
        : undefined;
    return { type: 'array', length: value.length, itemKeys };
  }
  if (typeof value === 'object') {
    return { type: 'object', keys: Object.keys(value) };
  }
  return typeof value;
}

const id = process.argv[2] || 'instagram';
const env = loadEnv();
const apiKey = env.ACCOUNT_OPTIMIZATION_API_KEY;
if (!apiKey || apiKey === 'your_api_key_here') {
  console.error('ACCOUNT_OPTIMIZATION_API_KEY が .env.local に設定されていません');
  process.exit(1);
}

const url = `https://api.growthcore.co.kr/api/thirdparty/id-analytics?id=${encodeURIComponent(id)}`;
console.log('呼び出し中:', url.replace(apiKey, '***'));

const res = await fetch(url, {
  method: 'GET',
  headers: { 'X-Auth-Key': apiKey, Accept: 'application/json' },
});
const data = await res.json();

if (data.status !== 'success' || data.result == null) {
  console.log('API エラー:', data.message || data.error || data);
  process.exit(1);
}

const result = data.result;
const keys = Object.keys(result);
const structure = {};
for (const k of keys) {
  structure[k] = describeValue(result[k]);
}

console.log('\n=== レスポンス構造 ===');
console.log('トップレベルキー:', keys.join(', '));
console.log('\nhas posts_per_day:', keys.includes('posts_per_day'));
console.log('has most_popular_post_time:', keys.includes('most_popular_post_time'));
console.log('\n各キーの型・構造:');
console.log(JSON.stringify(structure, null, 2));
