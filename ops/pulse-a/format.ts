/** Turn messy model output into clean article HTML */

export function markdownToHtml(raw: string): string {
  let s = String(raw || '').trim();
  if (!s) return '';

  // Strip code fences
  s = s.replace(/^```(?:html|markdown|md)?\s*/i, '').replace(/```$/i, '').trim();

  // If already mostly HTML tags, light cleanup only
  const htmlRatio = (s.match(/<\/?(p|h2|h3|ul|ol|li|a)\b/gi) || []).length;
  if (htmlRatio >= 3) {
    return sanitizeHtml(s);
  }

  // Normalize line endings
  s = s.replace(/\r\n/g, '\n');

  // Headings
  s = s.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  s = s.replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');

  // Bold / italic
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(?<![a-zA-Z])\*([^*]+)\*(?![a-zA-Z])/g, '<em>$1</em>');

  // Inline-ish step lines: **Step 1: Title** - text
  s = s.replace(
    /<strong>(Step\s*\d+[:.]?\s*[^<]*)<\/strong>\s*[-–—:]?\s*/gi,
    '</p><h3>$1</h3><p>'
  );

  // Unordered list lines
  s = s.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  s = s.replace(/((?:<li>[\s\S]*?<\/li>\s*)+)/g, (block) => `<ul>${block}</ul>`);

  // Numbered lists
  s = s.replace(/^\s*\d+[.)]\s+(.+)$/gm, '<li>$1</li>');

  // Paragraphs: split on blank lines
  const parts = s.split(/\n{2,}/);
  const out: string[] = [];
  for (let part of parts) {
    part = part.trim();
    if (!part) continue;
    if (/^<(h2|h3|ul|ol|li|p|div)/i.test(part)) {
      out.push(part);
      continue;
    }
    // Single newlines → space inside paragraph
    const inner = part.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!inner) continue;
    if (/^<(h2|h3|ul|ol)/i.test(inner)) out.push(inner);
    else out.push(`<p>${inner}</p>`);
  }

  let html = out.join('\n');
  // Fix accidental nested p from step rewrite
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[23]>)/gi, '$1');
  html = html.replace(/(<\/h[23]>)\s*<\/p>/gi, '$1');
  return sanitizeHtml(html);
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function stripMetaLines(raw: string): {
  title?: string;
  summary?: string;
  category?: string;
  body: string;
} {
  let body = raw;
  const title = body.match(/^TITLE:\s*(.+)$/im)?.[1]?.trim();
  const summary = body.match(/^SUMMARY:\s*(.+)$/im)?.[1]?.trim();
  const category = body.match(/^CATEGORY:\s*(money|opportunities|scams|guides)\s*$/im)?.[1]?.trim();
  body = body
    .replace(/^TITLE:\s*.+$/im, '')
    .replace(/^SUMMARY:\s*.+$/im, '')
    .replace(/^CATEGORY:\s*.+$/im, '')
    .trim();
  return { title, summary, category, body };
}
