import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const key = (locals as any).runtime?.env?.VAPID_PUBLIC_KEY || '';
  return new Response(JSON.stringify({ publicKey: key }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
