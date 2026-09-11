/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  DB: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  VAPID_PUBLIC_KEY?: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
