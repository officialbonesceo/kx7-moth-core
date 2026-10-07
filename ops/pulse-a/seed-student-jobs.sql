INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_student_jobs_100l_2026',
  'online-jobs-100-level-students-nigeria',
  'Online jobs 100-level students in Nigeria can start without capital',
  'A short, honest list of phone-based work paths for new campus students — with risks flagged and links to deeper LaneCash guides.',
  '<p>If you just entered 100 level, you do not need a “big hustle” speech. You need a few realistic paths that fit a student timetable, a phone (or shared laptop), and zero tolerance for “pay first to earn” offers.</p>
<p>Below is a compact list. Each path is common on Nigerian campuses. None of them guarantee income. Treat them as skills practice first; money is secondary until you have proof of work.</p>

<h2>1. Subject tutoring (WAEC / JAMB topics)</h2>
<p>Help SS1–SS3 students with subjects you already passed well. Start with people your parents or church/mosque network know. Charge by session, not by “packages” you cannot deliver. Keep lessons on WhatsApp voice notes or short live calls so transport is optional.</p>

<h2>2. Simple design on phone</h2>
<p>Flyers, birthday cards, and basic Instagram posts using free tools. Price small jobs clearly. Do not buy expensive “Canva Pro courses” from strangers. Practise on free tiers until a real client appears.</p>
<p><a class="inline-cta" href="/search?q=canva">More on design skills →</a></p>

<h2>3. Content support (not “influencer overnight”)</h2>
<p>Editing short clips, writing captions, or uploading for a small creator who already has an audience is more realistic than “get 10k followers this week.” Learn one editing app well before offering paid help.</p>
<p><a class="inline-cta" href="/search?q=content">Content creator guides →</a></p>

<h2>4. Ghostwriting short posts</h2>
<p>Some local businesses need product descriptions or WhatsApp status copy. Write samples first. Never share your bank OTP or “test deposit” with a stranger claiming to hire writers.</p>

<h2>5. Campus micro-tasks</h2>
<p>Form-filling help, printing coordination, or helping seniors format assignments. Keep everything offline-payment or confirmed transfer after delivery — not before.</p>

<h2>What to reject immediately</h2>
<ul>
<li>Any job that asks for an activation fee, “clearance,” or crypto deposit</li>
<li>Telegram “investment rooms” that need you to recruit classmates</li>
<li>Strangers requesting remote access to your phone</li>
</ul>
<p><a class="inline-cta" href="/?tab=scams">Open scam alerts →</a></p>

<p><strong>Educational only — not financial advice.</strong> Build skills, document work, and ignore pressure to pay to “unlock” earnings.</p>',
  'guides',
  NULL,
  4,
  0,
  1,
  'published',
  'LaneCash Desk',
  'LaneCash',
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  category = excluded.category,
  reading_minutes = excluded.reading_minutes,
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');
