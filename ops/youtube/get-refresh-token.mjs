/**
 * One-time: get YouTube OAuth refresh token.
 * Usage:
 *   export YOUTUBE_CLIENT_ID=...
 *   export YOUTUBE_CLIENT_SECRET=...
 *   node ops/youtube/get-refresh-token.mjs
 * Open the printed URL, approve with the LaneCash channel Google account,
 * paste the code back here. Copy refresh_token into GitHub Secret YOUTUBE_REFRESH_TOKEN.
 */
import http from 'node:http';
import { URL } from 'node:url';

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const PORT = 53682;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET');
  process.exit(1);
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  }).toString();

console.log('\n1) Open this URL in a browser (LaneCash channel account):\n');
console.log(authUrl);
console.log('\n2) Waiting for redirect on', REDIRECT, '...\n');

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', `http://127.0.0.1:${PORT}`);
    if (u.pathname !== '/callback') {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const code = u.searchParams.get('code');
    if (!code) {
      res.writeHead(400);
      res.end('missing code');
      return;
    }
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT,
        grant_type: 'authorization_code',
      }),
    });
    const json = await tokenRes.json();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (!json.refresh_token) {
      res.end('<h1>No refresh_token — revoke app access and retry with prompt=consent</h1><pre>' + JSON.stringify(json, null, 2) + '</pre>');
      console.error('Response without refresh_token', json);
    } else {
      res.end('<h1>OK — copy refresh_token from terminal, then close this tab</h1>');
      console.log('\n=== SAVE AS GITHUB SECRET: YOUTUBE_REFRESH_TOKEN ===\n');
      console.log(json.refresh_token);
      console.log('\n=====================================================\n');
    }
    server.close();
    process.exit(0);
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end(String(e));
    process.exit(1);
  }
});

server.listen(PORT);
