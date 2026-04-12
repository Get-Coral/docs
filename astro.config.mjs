// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.getcoral.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: 'Coral Docs',
      description: 'Documentation for the Coral ecosystem of Jellyfin modules',
      customCss: ['./src/styles.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Get-Coral',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
          ],
        },
        {
          label: 'Modules',
          items: [
            { label: 'Aurora', slug: 'modules/aurora' },
            { label: 'Fathom', slug: 'modules/fathom' },
            { label: 'Librarian', slug: 'modules/librarian' },
            { label: 'KAPOW', slug: 'modules/kapow' },
            { label: 'Encore', slug: 'modules/encore' },
            { label: 'Marquee', slug: 'modules/marquee' },
          ],
        },
        {
          label: 'Libraries',
          items: [{ label: 'Jellyfin API Client', slug: 'libraries/jellyfin' }],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'Get Started', slug: 'contributing/getting-started' },
            {
              label: 'Project Templates',
              slug: 'contributing/project-templates',
            },
          ],
        },
      ],
    }),
  ],
});
