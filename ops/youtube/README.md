# LaneCash YouTube pipeline

## Style (v2-oriented)
- Standing 2D tutor (PNG poses: present / point / warn)
- Board text + edge-tts voice + captions
- No stock photo slideshows

## One-time setup
1. Google Cloud project → enable **YouTube Data API v3**
2. OAuth client (Desktop) → Client ID + Secret
3. Add redirect `http://127.0.0.1:53682/callback`
4. On a PC/browser machine:
   ```bash
   export YOUTUBE_CLIENT_ID=...
   export YOUTUBE_CLIENT_SECRET=...
   node ops/youtube/get-refresh-token.mjs
   ```
5. GitHub Secrets:
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`
   - `YOUTUBE_REFRESH_TOKEN`

## Render + upload (manual test)
```bash
echo 'Task apps that charge to withdraw' > /tmp/title.txt
echo 'Red flag one. Red flag two. Educational only. Full guide on LaneCash.' > /tmp/script.txt
bash ops/youtube/render.sh /tmp/title.txt /tmp/script.txt /tmp/out.mp4
node ops/youtube/upload.mjs /tmp/out.mp4 "Title" "Desc https://lanecash.name.ng" unlisted
```

## Assets
Put tutor poses in `ops/youtube/assets/`:
- `tutor_present.png` (main)
- `tutor_point.png` (optional)
- `tutor_warn.png` (optional)
- `bg.png` (optional 1080x1920)

## Note on v2 animation
True lip-sync / walk cycles need more than ffmpeg. This pipeline supports **pose swaps** (v2-lite). Full motion is a later Remotion/Spine step.
