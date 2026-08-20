import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://facetarchitecture.co.za', // Required for @astrojs/sitemap to work
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 78 // Default quality for all optimized images (0-100)
      }
    },
    domains: [],
    remotePatterns: []
  }
});