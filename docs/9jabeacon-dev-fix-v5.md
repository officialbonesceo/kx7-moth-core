# 9jaBeacon — Developer AI Fix Brief v5
**Date:** 2 Oct 2026  
**Audience:** Production AI / code agent that writes the rewrite pipeline (not article text)  
**Do not change:** ad placement scripts, SVG image fallbacks (intentional)  
**Domain:** https://www.9jabeacon.name.ng/

---

## A. What is working (keep)

- Daily publishing is live (JNPSNC strike, Kora One Rail, Navy crude, Mercy Bassey, Kenya agents, etc.).
- Source attribution block + outbound original URL on many stories (Vanguard, TechCabal, Punch).
- Share buttons, canonical URL, Meziem footer branding.
- Category **Business** correct on Kenya mobile-money story.
- Sponsored blocks labeled; leave Monetag/Adsterra zones alone unless user asks.

---

## B. Article audit (Oct 1–2 sample)

| Story | Strengths | Problems |
|-------|-----------|----------|
| **JNPSNC 3-day strike** | Matches Punch/TheCable core facts (N500 petrol, midnight 2–4 Oct, 8 unions) | Thin (~2 min); little beyond one source; no “what this means for services” |
| **Kora One Rail** | TechCabal-aligned; good CEO quote; IMF 60% line | Tagged **Naija News** on home + article — should be **Business** (or dual tag) |
| **ICE / Etinosa Osahon** | Real person/case exists | Copy reads like **fresh arrest this week**; Sahara May 2026 + later CAT litigation — **date-lock** required; avoid “this week” without source date |
| **Navy 80k litres + NDLEA** | Punch-attributed numbers | Heavy filler paragraphs; little location/operation name beyond “creeks” |
| **Mercy Bassey hit-and-run** | Punch-attributed | Some speculative tone (“may have been distracted”); stick to police-confirmed facts |
| **Kenya agents −34k** | Correct **Business**; solid numbers | Short; good model for structure |

**Recommended / related:** On Naija stories, “Recommended” is almost always more Naija News — OK for topical match, but **Kora** should recommend other **Business** pieces when category is fixed.

**Most Read This Week:** Still mixes Liga MX, SA femicide, etc. under Naija labels — either compute real engagement or remove synthetic ranks.

**TTS (“Listen to this story”):** UI present; client `speechSynthesis` must start **only on user click**, plain text (strip HTML), handle `voiceschanged`, pause/resume. Do not auto-play.

---

## C. Pipeline rules (implement in code)

### 1. Category classifier (AI chooses from allow-list)

Pass the **full list** of site categories into the rewrite prompt. Require JSON field `category` ∈ allow-list only.

**Suggested allow-list (adjust to DB enums):**
`Naija News` | `Business` | `Sports` | `World` | `Politics` | `Tech` (if exists)

**Rules (topic-first, not keyword-first):**
- Fintech, banks, CBN, stablecoins, markets, investment → **Business** (even if “Nigeria” in headline).
- Labour/strike/police/crime/governance inside Nigeria → **Naija News** (or Politics if you split).
- Foreign league scores, non-Nigeria sports → **Sports** (never Naija News).
- Non-Nigeria geopolitics without Nigerian agency → **World**.
- Money words alone do **not** force Business if the story is a crime/arrest with no market angle.

**Dual category:** Optional second tag for e.g. player transfer (Sports + Business). Primary drives home rail.

### 2. Fact-lock rewrite

- Require `source_url` + `source_name` + short excerpt from source before publish.
- **No inventing** court dates, loss amounts, or “this week” unless in source.
- If source is weeks old, headline/lede must not imply brand-new breaking event.
- Fail closed if body &lt; ~900 characters after strip HTML or if planning/leak phrases appear.
- Prefer 4–6 short sections over one thin block; still no padding (“signals meaningful progress…” filler).

### 3. Images

- Prefer real wire/source image when URL valid.
- **SVG brand fallback OK** if image missing (do not invent stock faces).
- Never copy third-party news logos as the hero “photo.”

### 4. Ads (do not spam)

- Max **1–2** mid-body sponsored slots on long articles; **do not** repeat the same native card format stacked.
- Keep existing zone IDs; density by word count if you already implement that pattern.

### 5. Home & SEO

- Newest `published_at` first.
- Related stories: same primary category when possible.
- Strip query params from canonical; noindex pure filter URLs if any.

### 6. TTS fix (client)

```js
// Pseudocode — on user click only
btn.addEventListener('click', () => {
  const text = articleEl.innerText.replace(/\s+/g, ' ').trim();
  if (!window.speechSynthesis || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
});
```

---

## D. Acceptance tests

1. Fintech story (Kora-style) → category **Business** on article + home badge.
2. Strike/crime → **Naija News**; source link opens real outlet page.
3. No “Most Read” row with impossible engagement if no analytics.
4. Listen button starts voice once per click; no auto-speak on load.
5. Ad count does not multiply identical widgets in consecutive paragraphs.

---

## E. Out of scope for this brief

- Redesign of entire chrome.
- Changing ad network contracts.
- LaneCash / UniHarbour (separate repos).

**Ship priority:** category fix + fact date-lock + TTS click + Most Read honesty.
