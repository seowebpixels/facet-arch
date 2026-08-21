import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://facetarchitecture.co.za',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always'
  },
  image: {
    // Defines preferred output formats for Astro's image service
    formats: ['avif', 'webp'],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 78
      }
    },
    domains: [],
    remotePatterns: []
  }
});