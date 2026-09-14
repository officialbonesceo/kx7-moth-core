import type { SeedMeta } from './data';

const DISCLAIMER =
  '<h2>Disclaimer</h2><p>This guide is educational only. It is not financial, investment, or legal advice. Nothing here promises income or returns. Verify tools yourself and never risk money you cannot afford to lose.</p>';

function link(slug: string | undefined, label: string) {
  if (!slug) return '';
  return `<p><a href="/article/${slug}">${label}</a></p>`;
}

/** Expand compact meta into a full multi-section HTML guide */
export function expand(meta: SeedMeta): string {
  const bullets = meta.bullets.map((b) => `<li>${b}</li>`).join('');
  const steps = meta.steps.map((s) => `<li>${s}</li>`).join('');
  const mistakes = meta.mistakes.map((m) => `<li>${m}</li>`).join('');

  return `
<h2>Why this matters</h2>
<p>${meta.intro}</p>

<h2>Core ideas</h2>
<ul>${bullets}</ul>

<h2>What to do this week</h2>
<ol>${steps}</ol>

<h2>Common mistakes</h2>
<ul>${mistakes}</ul>

<h2>Deeper context</h2>
<p>Online money and creator talk moves in cycles: new apps, new claim posts, new “systems.” Underneath, durable skills change slowly — clear communication, reliable delivery, basic security hygiene, and a weekly look at cash after fees. When a trending thread on X makes you feel late, return to fundamentals instead of paying strangers for speed.</p>
<p>LaneCash series are designed to interlock: phone skills feed creator craft; creator craft needs algorithm literacy; offers need honesty; scam literacy protects the whole path; money discipline keeps experiments from becoming leaks.</p>

<h2>Questions to keep you honest</h2>
<ul>
<li>Can I explain this without hype words?</li>
<li>Do I have one finished sample, or only other people’s screenshots?</li>
<li>Am I about to send money or secrets to “unlock” progress?</li>
<li>What will I review on the same day next week?</li>
</ul>

<h2>How this connects on LaneCash</h2>
<p>Use previous/next links to stay in order. Jumping randomly between apps is how beginners collect accounts instead of skill.</p>
${link(meta.prevSlug, '← Previous part')}
${link(meta.nextSlug, 'Next part →')}

${DISCLAIMER}
`.trim();
}
