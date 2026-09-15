/**
 * IndexNow ping for Bing & partners (not Google).
 * Env: INDEXNOW_KEY, SITE_HOST (default lanecash.name.ng)
 * Args: full URL(s)
 */
const KEY = process.env.INDEXNOW_KEY || '';
const HOST = process.env.SITE_HOST || 'lanecash.name.ng';
const urls = process.argv.slice(2).filter(Boolean);

if (!KEY || !urls.length) {
  console.log('skip IndexNow: need INDEXNOW_KEY and urls');
  process.exit(0);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
};

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
console.log('IndexNow', r.status, await r.text());
