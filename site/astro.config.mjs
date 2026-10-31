import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lanecash.name.ng',
  output: 'server',
  adapter: cloudflare(),
  integrations: [tailwind()],
});
