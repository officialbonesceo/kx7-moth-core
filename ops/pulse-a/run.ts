/**
 * pulse-a — LaneCash
 * Longer finance/crypto/hustle articles + images + strict niche
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || "";

const CATEGORIES = ["money", "opportunities", "scams", "guides", "news"] as const;
type Category = (typeof CATEGORIES)[number];

interface FeedItem {
  title: string; link: string; summary: string; source: string; score: number;
}
interface ArticleDraft {
  title: string; summary: string; content: string; category: Category;
  reading_minutes: number; source_name?: string; source_url?: string; image_url?: string;
}

const FEEDS = [
  { name: "Nairametrics", url: "https://nairametrics.com/feed/", weight: 3 },
  { name: "BusinessDay", url: "https://businessday.ng/feed/", weight: 3 },
];

const TOPIC_SEEDS: FeedItem[] = [
  { title: "How to earn with little money daily in Nigeria", link: "https://lanecash.local/seed/earn-little-daily", summary: "Practical low-capital daily income ideas with realistic expectations and safety tips.", source: "LaneCash Desk", score: 30 },
  { title: "Beginner crypto methods that don’t need big capital", link: "https://lanecash.local/seed/crypto-small", summary: "Small-capital crypto learning path, risk controls, and scam avoidance for beginners.", source: "LaneCash Desk", score: 30 },
  { title: "USDT and stablecoins explained for Nigerians", link: "https://lanecash.local/seed/usdt", summary: "What USDT is, why people use it, fees, and common mistakes.", source: "LaneCash Desk", score: 28 },
  { title: "Small capital side hustles you can start this week", link: "https://lanecash.local/seed/hustles", summary: "Low-budget hustles, tools, and how to test demand before spending.", source: "LaneCash Desk", score: 28 },
  { title: "How to avoid crypto and investment scams", link: "https://lanecash.local/seed/scams", summary: "Red flags, fake platforms, and how to protect your money.", source: "LaneCash Desk", score: 29 },
  { title: "POS business: realistic costs, risks and daily earnings", link: "https://lanecash.local/seed/pos", summary: "Honest breakdown of POS/agent banking as a small business.", source: "LaneCash Desk", score: 27 },
];

const STRONG = ["naira","cbn","fintech","bank","loan","inflation","investment","funding","paystack","flutterwave","opay","moniepoint","kuda","pos","payment","hustle","freelance","scam","ponzi","crypto","bitcoin","usdt","stablecoin","trading","airdrop","token","salary","budget","tax"];
const BLOCK = ["iphone","galaxy","foldable","specs","release date","football","super eagles","nollywood","celebrity","album","table of contents"];

const PRODUCT_LINKS: Record<string,string> = {
  capcut:"https://www.capcut.com/", canva:"https://www.canva.com/", paystack:"https://paystack.com/", flutterwave:"https://flutterwave.com/",
  opay:"https://www.opayweb.com/", moniepoint:"https://moniepoint.com/", kuda:"https://www.kuda.com/", binance:"https://www.binance.com/",
  fiverr:"https://www.fiverr.com/", upwork:"https://www.upwork.com/",
};

const SYSTEM = `You are a senior practical finance editor for LaneCash (Nigeria-focused).
Write COMPLETE articles, not short blurbs.
Target length: 700-1100 words equivalent in HTML.
Structure with multiple <h2> sections and detailed <p> paragraphs.
Include concrete steps, risks, realistic numbers ranges when useful, and a clear takeaway.
Allowed topics only: money, crypto, side hustles, fintech, scams, banking, payments, small-capital earning.
No get-rich-quick claims. No gadget reviews.
When mentioning tools (CapCut, Canva, Paystack, Binance...), use real HTML links.
Return ONLY JSON: title, summary, content, category, reading_minutes.
category: money|opportunities|scams|guides|news
content HTML tags: h2,p,ul,li,a only.
summary must be 1-2 strong sentences.`;

function slugify(t:string){return t.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").slice(0,70)}
function stripTags(h:string){return h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}
function decodeBasic(t:string){return t.replace(/<!\[CDATA\[/g,"").replace(/\]\]>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'")}
function scoreItem(title:string, summary:string, w:number){
  const text=`${title} ${summary}`.toLowerCase();
  if(BLOCK.some(k=>text.includes(k))) return -100;
  let s=w, strong=0; for(const k of STRONG) if(text.includes(k)){s+=3;strong++}
  return strong? s : -1;
}
function injectLinks(content:string){
  let out=content;
  for(const [name,url] of Object.entries(PRODUCT_LINKS)){
    if(out.toLowerCase().includes(url.toLowerCase())) continue;
    out=out.replace(new RegExp(`\\b(${name})\\b`,"ig"), m=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${m}</a>`);
  }
  return out;
}
function ensureSource(content:string, name:string, url:string){
  if(!url || url.includes('lanecash.local') || content.includes(url)) return content;
  return `${content}\n\n<h2>Source</h2>\n<p>Based on reporting from <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>.</p>`;
}
function imageFor(title:string, category:string){
  const prompt=encodeURIComponent(`${category} finance crypto money nigeria dark editorial photo no text`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=675&nologo=true&seed=${Math.abs([...title].reduce((a,c)=>a+c.charCodeAt(0),0)%99999)}`;
}
function parseDraft(raw:string){
  try{
    let c=String(raw||"").replace(/```json/gi,"").replace(/```/g,"").trim();
    const a=c.indexOf("{"), b=c.lastIndexOf("}"); if(a!==-1&&b!==-1) c=c.slice(a,b+1);
    c=c.replace(/,\s*}/g,"}").replace(/,\s*]/g,"]");
    const obj=JSON.parse(c);
    if(!obj.title||!obj.content) return null;
    if(String(obj.content).length < 700) return null; // reject very short
    const blob=`${obj.title} ${obj.summary||""}`.toLowerCase();
    if(BLOCK.some(k=>blob.includes(k))) return null;
    const category=CATEGORIES.includes(obj.category)?obj.category:"money";
    return { title:String(obj.title).trim(), summary:String(obj.summary||"").trim(), content:String(obj.content).trim(), category, reading_minutes:Number(obj.reading_minutes)||6 };
  }catch{return null}
}
function expandLocal(item:FeedItem):ArticleDraft{
  const cat:Category=/scam|fraud|ponzi/i.test(item.title+item.summary)?"scams":/crypto|usdt|bitcoin|token/i.test(item.title+item.summary)?"opportunities":/hustle|earn|freelance|capital|daily/i.test(item.title+item.summary)?"guides":"money";
  const content=injectLinks(`
<h2>Why this matters</h2>
<p>${item.summary || item.title} In Nigeria, small decisions around cashflow, tools, and risk often matter more than big theories. This guide keeps the focus on practical steps you can test without burning money.</p>
<h2>What to do first</h2>
<p>Start with clarity: what skill, tool, or asset do you already have? Phone data, a skill you can teach, a product you can resell, or time blocks after work. Write one target for the next 7 days — not a fantasy monthly income.</p>
<ul>
<li>Pick one channel only (WhatsApp, Jiji, Fiverr, crypto learning, POS, etc.).</li>
<li>Set a tiny daily action you can finish in 30–60 minutes.</li>
<li>Track every naira in and out in a note on your phone.</li>
</ul>
<h2>Money and risk rules</h2>
<p>If anyone promises guaranteed profit, daily returns, or “double your money”, treat it as a warning. Real opportunities are usually slower, boring, and require proof. For crypto, never invest money you cannot lose, and never share OTPs, seed phrases, or remote-access to your phone.</p>
<h2>Tools that can help</h2>
<p>For content hustles, <a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a> and <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Canva</a> are enough to start. For payments and small business, look at trusted local rails like Paystack, Flutterwave, Opay, Moniepoint or Kuda — verify official sites before signing up.</p>
<h2>7-day action plan</h2>
<ol>
<li>Day 1–2: choose one offer and write a simple pitch.</li>
<li>Day 3–4: talk to 10 possible customers or publish 2 pieces of content.</li>
<li>Day 5–6: improve based on replies, not vibes.</li>
<li>Day 7: review what made money or attention, then repeat only that.</li>
</ol>
<h2>Bottom line</h2>
<p>Small capital works only when paired with consistency and risk control. Build proof in public, keep expenses low, and upgrade tools after cashflow — not before.</p>
${item.link.includes('lanecash.local')?'':`<h2>Source</h2><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a></p>`}
`.trim());
  return { title:item.title, summary:item.summary||item.title, content, category:cat, reading_minutes:7, source_name:item.source, source_url:item.link.includes('lanecash.local')?undefined:item.link, image_url:imageFor(item.title,cat) };
}

async function fetchFeeds(){
  const all:FeedItem[]=[];
  for(const feed of FEEDS){
    try{
      const res=await fetch(feed.url,{headers:{"User-Agent":"Mozilla/5.0 LaneCashBot/1.3",Accept:"application/rss+xml, application/xml, text/xml, */*"},signal:AbortSignal.timeout(15000)});
      if(!res.ok){console.warn(`[pulse-a] feed fail ${feed.name}`);continue}
      const xml=await res.text();
      for(const part of xml.split(/<item[\s>]/i).slice(1,12)){
        const title=stripTags(decodeBasic((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").trim()));
        const link=stripTags(decodeBasic((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]||"").trim()));
        const description=stripTags(decodeBasic((part.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1]||"").trim()));
        if(!title||!link) continue;
        const score=scoreItem(title,description,feed.weight);
        if(score<4) continue;
        all.push({title,link,summary:description.slice(0,240),source:feed.name,score});
      }
    }catch(e:any){console.warn(`[pulse-a] ${feed.name}:`,e.message)}
  }
  all.push(...TOPIC_SEEDS);
  all.sort((a,b)=>b.score-a.score);
  return all;
}

async function generateCF(item:FeedItem){
  if(!CF_ACCOUNT_ID||!CF_API_TOKEN) return null;
  for(const model of ["@cf/meta/llama-3.1-8b-instruct","@cf/meta/llama-3.2-3b-instruct"]){
    try{
      const res=await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`,{method:"POST",headers:{Authorization:`Bearer ${CF_API_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:SYSTEM},{role:"user",content:`SOURCE_NAME:${item.source}\nSOURCE_URL:${item.link}\nTITLE:${item.title}\nSUMMARY:${item.summary}\nWrite a FULL long practical article (not short).`}],max_tokens:1800,temperature:0.3})});
      if(!res.ok) continue;
      const data=await res.json() as any;
      const parsed=parseDraft(data?.result?.response||"");
      if(!parsed) continue;
      console.log(`[pulse-a] CF AI ${model}`);
      return { ...parsed, content:injectLinks(ensureSource(parsed.content,item.source,item.link)), source_name:item.source, source_url:item.link.includes('lanecash.local')?undefined:item.link, image_url:imageFor(parsed.title,parsed.category) } as ArticleDraft;
    }catch(e:any){console.warn(`[pulse-a] CF ${model}`,e.message)}
  }
  return null;
}

async function generateOR(item:FeedItem){
  if(!OPENROUTER_API_KEY) return null;
  for(const model of ["meta-llama/llama-3.1-8b-instruct:free","google/gemma-2-9b-it:free","mistralai/mistral-7b-instruct:free"]){
    try{
      const res=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${OPENROUTER_API_KEY}`,"Content-Type":"application/json","HTTP-Referer":"https://github.com/officialbonesceo/kx7-moth-core","X-Title":"pulse-a"},body:JSON.stringify({model,messages:[{role:"system",content:SYSTEM},{role:"user",content:`SOURCE_NAME:${item.source}\nSOURCE_URL:${item.link}\nTITLE:${item.title}\nSUMMARY:${item.summary}\nWrite a FULL long article.`}],temperature:0.3,max_tokens:1200})});
      if(!res.ok) continue;
      const data=await res.json() as any;
      const parsed=parseDraft(data?.choices?.[0]?.message?.content||"");
      if(!parsed) continue;
      console.log(`[pulse-a] OpenRouter ${model}`);
      return { ...parsed, content:injectLinks(ensureSource(parsed.content,item.source,item.link)), source_name:item.source, source_url:item.link.includes('lanecash.local')?undefined:item.link, image_url:imageFor(parsed.title,parsed.category) } as ArticleDraft;
    }catch(e:any){console.warn(`[pulse-a] OR ${model}`,e.message)}
  }
  return null;
}

async function d1(sql:string, params:any[]=[]){
  const res=await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,{method:"POST",headers:{Authorization:`Bearer ${CF_API_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({sql,params})});
  const text=await res.text();
  if(!res.ok){console.error("[pulse-a] D1",res.status,text);return null}
  try{return JSON.parse(text)}catch{return{ok:true}}
}
async function exists(link:string,title:string){
  const data=await d1(`SELECT id FROM articles WHERE source_url = ? OR title = ? LIMIT 1`,[link,title]);
  const rows=data?.result?.[0]?.results||data?.results||[];
  return Array.isArray(rows)&&rows.length>0;
}
async function publish(draft:ArticleDraft){
  const id="a_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  const slug=`${slugify(draft.title)||"article"}-${id.slice(-5)}`;
  const data=await d1(`INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, source_name, source_url, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, datetime('now'), datetime('now'), datetime('now'))`,[id,slug,draft.title,draft.summary,draft.content,draft.category,draft.image_url||null,draft.reading_minutes,draft.source_name||null,draft.source_url||null]);
  if(!data){console.error("[pulse-a] publish failed");process.exit(1)}
  console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
}

async function main(){
  console.log("[pulse-a] start long-form finance/crypto");
  if(!CF_ACCOUNT_ID||!CF_API_TOKEN||!CF_D1_DATABASE_ID){console.error("missing CF creds");process.exit(1)}
  const items=await fetchFeeds();
  for(const item of items.slice(0,20)){
    if(await exists(item.link,item.title)){console.log("[pulse-a] skip",item.title.slice(0,50));continue}
    console.log("[pulse-a] processing",item.title.slice(0,70));
    const draft=(await generateCF(item))||(await generateOR(item))||expandLocal(item);
    await publish(draft);
    break;
  }
  console.log("[pulse-a] done");
}
main().catch(e=>{console.error(e);process.exit(1)});
