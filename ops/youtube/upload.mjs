/**
 * Upload a local MP4 to YouTube (LaneCash channel).
 * Env: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 * Args: video.mp4 "Title" "Description" [privacyStatus]
 */
import fs from 'node:fs';

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const REFRESH = process.env.YOUTUBE_REFRESH_TOKEN || '';

const [,, videoPath, title, description, privacy = 'public'] = process.argv;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH) {
  console.error('Missing YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN');
  process.exit(1);
}
if (!videoPath || !fs.existsSync(videoPath)) {
  console.error('Video file required');
  process.exit(1);
}

async function accessToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH,
      grant_type: 'refresh_token',
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token fail ' + JSON.stringify(j));
  return j.access_token;
}

async function main() {
  const token = await accessToken();
  const meta = {
    snippet: {
      title: (title || 'LaneCash').slice(0, 100),
      description: (description || 'Educational only — not financial advice.\nhttps://lanecash.name.ng').slice(0, 5000),
      tags: ['LaneCash', 'money skills', 'scam awareness', 'education'],
      categoryId: '27',
    },
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: false,
    },
  };

  // Resumable upload init
  const init = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': String(fs.statSync(videoPath).size),
      },
      body: JSON.stringify(meta),
    }
  );
  const uploadUrl = init.headers.get('location');
  if (!uploadUrl) {
    console.error(await init.text());
    process.exit(1);
  }
  const body = fs.readFileSync(videoPath);
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'video/mp4',
      'Content-Length': String(body.length),
    },
    body,
  });
  const result = await put.json();
  if (!put.ok) {
    console.error(result);
    process.exit(1);
  }
  console.log('Uploaded', result.id, 'https://youtu.be/' + result.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
