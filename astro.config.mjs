import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Automatically detect GitHub Actions environment for GitHub Pages
const rawRepo = process.env.GITHUB_REPOSITORY; // format: "owner/repo"
const repoOwner = rawRepo ? rawRepo.split('/')[0] : '';
const repoName = rawRepo ? `/${rawRepo.split('/')[1]}` : (process.env.BASE_PATH || '');

export default defineConfig({
  // If in GitHub Actions, sets site to https://<owner>.github.io and base to /<repo>
  site: process.env.SITE_URL || (rawRepo ? `https://${repoOwner}.github.io` : 'https://example.github.io'),
  base: repoName || undefined,
  integrations: [tailwind()],
  build: {
    format: 'directory',
  },
});
